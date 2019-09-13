import { readFile as readFileCallback } from 'fs';
import { join } from 'path';

const readFile = path => new Promise((resolve, reject) =>
  readFileCallback(path, (err, data) => err ? reject(err) : resolve(data)));

export const findDotPath = (obj, parts) => {
  parts = typeof parts === 'string' ? parts.split(/./) : parts;
  obj = obj[parts.shift()];
  return (obj && parts.length) ? findDotPath(obj, parts) : obj;
};

export const normalizePath = (root, path) => `/${path.replace(new RegExp(`^${root}`), '')}`.replace(/\/+/, '/');

export const isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

export const findModule = (modules, moduleName) => modules.find(m => m.name === moduleName);

export const readModuleFile = async (a, module, filePath, req) =>
  (await a('parseTemplate', { module, req, text: `${await readFile(join(module.filePath, filePath))}` })).text;