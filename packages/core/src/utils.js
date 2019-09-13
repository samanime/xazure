import { stat as statCallback } from 'fs';
import { normalizePath } from '@xazure/utils';
import logger from '@xazure/logger';
import clone from 'clone';

export const requireFile = async file => {
  try {
    await stat(file);
  } catch (e) { return; }

  try {
    const obj = require(file.default || file);
    return obj.default || obj;
  } catch (e) {
    e.message = `Error requiring file '${file}': ${e}`;
    throw e;
  }
};

export const stat = path => new Promise((resolve, reject) =>
  statCallback(path, (err, stat) => err ? reject(err) : resolve(stat)));

export const flatten = arr => arr.reduce((flat, a) => flat.concat(a), []);

export const normalizeModules = modules => modules.map(module => {
  const obj = typeof module === 'object' ? module : { name: module };

  if (!obj.name) {
    throw new Error('Module must provide a name');
  } else if (!obj.filePath) {
    throw new Error(`Module ${obj.name} must provide a filePath`);
  }

  obj.path = obj.path || `/module/${obj.name}`;
  obj.apiPath = obj.apiPath || `${obj.path}/api`.replace(/\/+/, '/');
  obj.publicPath = obj.publicPath || `/public/${obj.name}`;
  obj.normalApiPath = normalizePath(obj.path, obj.apiPath);
  return obj;
});

export const checkConfig = ({ logger, modules, db }) => {
  if (logger.modules.length === 0) {
    console.warn("No logger modules specified, you won't be able to receive any logs.");
  }

  if (modules.length === 0) {
    logger.warn("No modules specified. Won't really do anything.");
  }

  if (!db.url && !db.suppressUrlWarning) {
    logger.warn("No MongoDB URL (db.url) provided. No modules will be able to use a MongoDB connection.");
    logger.warn("If this is intentional, you can suppress this warning by setting db.suppressUrlWarning to true.");
  }
};

export const stringifyConfig = config => {
  const copy = clone(config);
  return JSON.stringify(copy, null, 2);
};