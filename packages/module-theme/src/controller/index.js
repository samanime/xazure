import express, { Router } from 'express';
import { readModuleFile } from '@xazure/utils';
import apiController from './api';

export default ({ module, a }) => {
  const { normalApiPath, theme, publicPath } = module;

  return Router()
    .use(normalApiPath, apiController({ a }))
    .use(`${publicPath}/theme`, express.static(theme.publicRoot))
    .get('*', async (req, res) => res.send(await readModuleFile(a, module, 'public/index.html', req)))
  ;
}