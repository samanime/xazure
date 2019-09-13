import { join, dirname, basename, relative, sep } from 'path';
import { transform, transformFile as transformFileCallback } from 'babel-core';
import { mkdirp, writeFile, rimraf, promisify, makeMatcher } from '../utils';

const transformFile = promisify(transformFileCallback);

const jsMatcherPattern = /\.js$/;

export const publicMatcher = makeMatcher(jsMatcherPattern);

export const privateMatcher = makeMatcher(jsMatcherPattern, /^(?!public)/);

const privateBabelConfig = {
  babelrc: false,
  presets: ['env'],
  plugins: ['transform-object-rest-spread'],
  sourceMaps: true
};

const publicBabelConfig = {
  babelrc: false,
  presets: [['env', { modules: false }]],
  plugins: [
    'transform-object-rest-spread',
    ['import-rename', {"^(\\.+)\/((.(?!\\.[a-z]+))*)$": "$1/$2.js"}]
  ],
  sourceMaps: true
};

const mergeBabel = (arr, add, remove) => {
  return [].concat(arr)
    .filter(a => !(remove.includes([].concat(a)[0]) || add.find(a2 => [].concat(a2)[0] === [].concat(a)[0])))
    .concat(add);
};

const buildBabelConfig = (base, { plugins = [], presets = [], disablePlugins = [], disablePresets = [] } = {}) =>
  Object.assign(base, {
    presets: mergeBabel(base.presets, presets, disablePresets),
    plugins: mergeBabel(base.plugins, plugins, disablePlugins)
  });

const buildJsFile = async (sourceFilePath, destinationFilePath, config) => {
  const { code, map } = await transformFile(sourceFilePath,
    Object.assign({ sourceFileName:
        join(relative(dirname(destinationFilePath), dirname(sourceFilePath)).replace(new RegExp(`\\${sep}`, 'g'), '/'), basename(destinationFilePath)) }, config));

  await mkdirp(dirname(destinationFilePath));
  return Promise.all([
    writeFile(join(destinationFilePath), code + `\n//# sourceMappingURL=${basename(destinationFilePath)}.map`),
    writeFile(join(`${destinationFilePath}.map`), JSON.stringify(map))
  ]);
};

const createJsBuilder = (rootDir, sourceDir, destinationDir, defaultConfig, baseConfig) => {
  const config = buildBabelConfig(defaultConfig, baseConfig);

  return {
    build: filePath => buildJsFile(join(rootDir, sourceDir, filePath), join(rootDir, destinationDir, filePath), config),
    remove: filePath => Promise.all([
      rimraf(join(rootDir, destinationDir, filePath)),
      rimraf(join(rootDir, destinationDir, `${filePath}.map`))
    ])
  };
};

export const publicBuilder = (sourceDir, destinationDir) =>
  (rootDir, { babel: { public: babelPublic = {} } = {} } = {}) =>
    createJsBuilder(rootDir, sourceDir, destinationDir, publicBabelConfig, babelPublic);

export const privateBuilder = (sourceDir, destinationDir) =>
  (rootDir, { babel: { private: babelPrivate = {} } = {} } = {}) =>
    createJsBuilder(rootDir, sourceDir, destinationDir, privateBabelConfig, babelPrivate);