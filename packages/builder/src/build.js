import { spawn } from 'child_process';
import { symlink as symlinkCallback } from 'fs';
import { join, relative, dirname, basename } from 'path';
import { platform } from 'os';
import { createMonitor } from 'watch';
import { walkDir, rimraf, mkdirp, readDir, promisify, findPackageRoot } from './utils';
import builderBuilderConfig from './builder-builder';

const symlink = promisify(symlinkCallback);

const BUILDER_CONFIG_NAME_ROOT = '@xazure/builder-';

const runNpm = (args = [], options = {}, logger) => new Promise(resolve => {
  const child = spawn(`npm${platform() === 'win32' ? '.cmd' : ''}`, args, Object.assign({ stdio: 'pipe' }, options));
  child.stdout.on('data', d => logger && logger.debug(`NPM ${args.join(' ')}: ${d}`));
  child.stderr.on('error', d => logger && logger.error(`NPM ${args.join(' ')} ERROR: ${d}`));
  child.on('close', code => resolve(code === 0));
});

const moduleAvailable = name => {
  try {
    require.resolve(name);
    return true;
  } catch(e) { }

  return false;
};

const readPackageJson = dir => require(join(dir, 'package.json'));

/**
 * Sees if there is a suitable module in the sibling directory of this module.
 * If there is, it'll create a symlink from it to `node_modules`.
 * @param name
 */
const linkLocalModule = async name => {
  const packageRoot = await findPackageRoot(__dirname);
  const thisModuleDir = basename(packageRoot);
  const parentDir = dirname(packageRoot);
  const files = await readDir(parentDir);

  const moduleDir = files.find(file => {
    if (file !== thisModuleDir) {
      try {
        return readPackageJson(join(parentDir, file)).name === name;
      } catch (e) { }
    }

    return false;
  });

  if (!moduleDir) {
    return false;
  }

  const src = join(parentDir, moduleDir);
  const dest = join(packageRoot, 'node_modules', name
  );

  await runNpm(['run', 'prepare'], { cwd: src });

  try {
    await mkdirp(dirname(dest));
    await symlink(join(parentDir, moduleDir), dest, 'junction');
  } catch (e) { /* swallow error, it may otherwise get there by a parallel process, which is okay */ };
  return true;
};

const installModuleWithNpm = (name, logger) => runNpm(['install', name], {}, logger);

const installModule = async (name, logger) => {
  if (!(await linkLocalModule(name))) {
    const installed = await installModuleWithNpm(name, logger);
    installed && logger && logger.debug(`${name}: Installed from registry.`);
    return installed;
  }

  logger && logger.debug(`${name}: Linked local module.`);
  return true;
};

const getBuilderConfig = async (type, logger) => {
  if (type === 'builder') {
    return builderBuilderConfig;
  }

  const name = `${BUILDER_CONFIG_NAME_ROOT}${type}`;

  if (!moduleAvailable(name) && !(await installModule(name, logger))) {
    throw new Error(`Could not install missing builder config '${name}'`);
  }

  const configModule = require(`@xazure/builder-${type}`);
  return configModule.default || configModule;
};

export default async (dir, config, command = 'default', watch = false, logger = null, onRestartServer = () => {}, onRestartBuilds = () => {}) => {
  const { source, dest, builders: builderConfigs } = await getBuilderConfig(config.type, logger);

  const builders = builderConfigs.map(({ builder, ...rest }) =>
    ({ builder: builder(dir, config), ...rest }));

  const findBuilder = filePath => builders.find(({ matcher }) => matcher(filePath)) || {};

  const buildFile = async filePath => {
    const builder = findBuilder(filePath);
    const { name, builder: { build } = {} } = builder;

    if (!name) {
      logger && logger.debug(`[skip] ${filePath}`);
    } else {
      logger && logger.log(`${name ? `[${name}] ` : ''}${filePath}`);
      await build(filePath);
      logger && logger.debug(`[${name}] ${filePath} done.`);
      return builder;
    }
  };

  const restartIfNeeded = ({ restartOnChange, restartBuildsOnChange } = {}) => {
    if (restartBuildsOnChange) {
      onRestartBuilds();
    } else if (restartOnChange) {
      onRestartServer();
    }
  };

  const doRebuild = type => async filePath => {
    const relativePath = relative(join(dir, source), filePath);
    logger && logger.debug(type, relativePath);
    restartIfNeeded(await buildFile(relativePath));
  };

  let monitor;
  if (command === 'watch' || watch) {
    createMonitor(join(dir, source), { interval: .5 }, m => {
      monitor = m;
      monitor.on('created', doRebuild('created'));
      monitor.on('changed', doRebuild('changed'));
      monitor.on('removed', async filePath => {
        const relativePath = relative(join(dir, source), filePath);
        const builder = findBuilder(filePath);
        const { builder: { remove = () => {} } = {} } = builder;
        logger && logger.debug('removed', relativePath);

        await remove(relativePath);
        restartIfNeeded(builder);
      });
    });
  }

  const clean = async () => rimraf(join(dir, dest));

  const build = async () => {
    await mkdirp(join(dir, dest));
    return walkDir(join(dir, source), buildFile);
  };

  switch (command) {
    case 'clean':
      await clean();
      break;
    case 'build':
      await build();
      break;
    case 'default':
      await clean();
      await build();
      break;
    case 'watch':
      break;
    default:
      throw new Error(`Unknown command: ${command}.`);
  }

  return () => {
    monitor.stop();
  };
};