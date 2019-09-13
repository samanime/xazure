import { join, sep, normalize } from "path";
import * as fs from "fs";
import mkdirpCallback from 'mkdirp';
import rimrafCallback from 'rimraf';
import { platform } from "os";

export const makeMatcher = (...patterns) =>
  Object.assign(path => patterns.every(pattern => pattern.test(path)), { patterns });

export const promisify = func => (...args) =>
  new Promise((resolve, reject) => func.apply(func, args.concat((err, result) => err ? reject(err) : resolve(result))));

export const rimraf = promisify(rimrafCallback);

export const mkdirp = promisify(mkdirpCallback);

export const readDir = promisify(fs.readdir);

export const readFile = promisify(fs.readFile);

export const stat = promisify(fs.stat);

export const writeFile = promisify(fs.writeFile);

export const readConfig = dir => {
  try {
    return require(join(dir, 'xazure.config.js'));
  } catch (e) {
    try {
      const json = require(join(dir, 'package.json'));
      return json.xazure ? (typeof json.xazure === 'object' ? json.xazure : { type: json.xazure }) : {};
    } catch (e) {
      return {};
    }
  }
};

export const walkDir = async (startDir, onFile, exclude = ['node_modules'], dir = '') =>
  Promise.all((await readDir(join(startDir, dir)))
    .filter(file => !exclude.includes(file))
    .map(async file =>
      (await (stat(join(startDir, dir, file)))).isDirectory()
        ? walkDir(startDir, onFile, exclude, join(dir, file))
        : Promise.resolve(onFile(join(dir, file))))
  );

const getSystemRoot = () => platform() === 'win32' ? process.cwd().split(sep)[0] : '/';

export const findPackageRoot = async (dir = __dirname) => {
  try {
    await stat(`${dir}/package.json`);
    return dir;
  } catch (e) {
    if (dir === getSystemRoot()) {
      throw new Error(`Unable to find 'package.json' in hierarchy of '${__dirname}'. Is this outside a Node module?`);
    }
  }

  return findPackageRoot(normalize(`${dir}/..`));
};