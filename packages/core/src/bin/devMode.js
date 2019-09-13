/**
 * devMode finds all sibling packages which define a valid xazure config.
 * It will then enter build-watch mode with all of them, with a special logger.
 *
 * On change, if the file was changed by a builder that has restartOnChange set to true,
 * then the server will also be restarted.
 */
import { spawn } from 'child_process';
import { platform } from 'os';
import { dirname, join } from 'path';
import build, { utils } from '@xazure/builder';
import logger, { Levels } from '@xazure/logger';
import consoleLogger from '@xazure/logger-console';

const { findPackageRoot, readDir, readConfig } = utils;

logger.configure({ modules: [consoleLogger], level: Levels.LOG });

const doLog = (name, level, messages) => logger.logAt.apply(logger, [level, `[${name}]`].concat(messages));

const createPassthroughLogger = name => ({
  error: (...messages) => doLog(name, Levels.ERROR, messages),
  warn: (...messages) => doLog(name, Levels.WARN, messages),
  info: (...messages) => doLog(name, Levels.INFO, messages),
  log: (...messages) => doLog(name, Levels.LOG, messages),
  debug: (...messages) => doLog(name, Levels.DEBUG, messages),
});

const getXazurePackages = async parentDir =>
  (await Promise.all((await readDir(parentDir)).map(async dir => {
    const config = (await readConfig(join(parentDir, dir)));
    return config.type && { config, dir, name: require(join(parentDir, dir, 'package.json')).name }
  }))).filter(Boolean);

export default async (dir, configPath, port) => {
  const packageRoot = await findPackageRoot(dir);
  const parentDir = dirname(packageRoot);
  const packages = await getXazurePackages(parentDir);

  let server, stops;

  const startServer = async () => {
    logger.log('Starting server.');

    const args = [join(__dirname, 'index.js')];
    configPath && args.push('-c', configPath);
    port && args.push('-p', port);

    server = spawn(`node`, args, { stdio: 'pipe', cwd: dir });
    server.on('error', e => logger.error(`${e}`.trim()));
    server.stdout.on('data', d => logger.log(`${d}`.trim()));
    server.stderr.on('data', d => logger.error(`${d}`.trim()));
  };

  const restartServer = async () => {
    if (server) {
      logger.log('Stopping server.');
      return new Promise(resolve => {
        server.once('close', () => {
          logger.log('Server stopped.');
          resolve(startServer());
        });

        server.kill();
      });
    } else {
      return startServer();
    }
  };

  const restartBuilds = async () => {
    if (stops) {
      stops.forEach(stop => stop());
    }

    stops = await Promise.all(packages.filter(({ name }) => name !== '@xazure/core').map(({ config, dir, name }) =>
      build(join(parentDir, dir), config, 'default', true, createPassthroughLogger(name), restartServer, restartBuilds)));

    return restartServer();
  };

  await restartBuilds();
};