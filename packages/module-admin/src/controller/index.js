import { Router } from 'express';
import { readModuleFile } from '@xazure/utils';
import apiController from './api';

export default ({ module, a }) => {
  const { normalApiPath } = module;
  return Router()
    .use(normalApiPath, apiController({ a }))
    .get('*', async (req, res) => res.send(await readModuleFile(a, module, 'public/index.html', req)))
  ;
};