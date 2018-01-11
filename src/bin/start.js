#! /usr/bin/env node
/* global process */
import 'babel-polyfill';
import 'source-map-support/register';
import commandLineArgs from 'command-line-args';
import { join, delimiter } from 'path';
import server from '..';
import { stat } from '../utils';

(async () => {

  const { configOption, port } = commandLineArgs([
    { name: 'config', alias: 'c', type: String, defaultOptions: true },
    { name: 'port', alias: 'p', type: Number }
  ]);

  let configErrors = {};
  const config = configOption || (await Promise.all(['dist/config.js', 'config.js']
    .map(p => join(process.cwd(), p))
    .map(configPath => {
      try {
        stat(configPath);
        return configPath;
      } catch (e) { configErrors[configPath] = e; }
    })
  )).filter(Boolean)[0];

  if (!config) {
    console.log('Errors trying to import config file(s):');
    console.log(Object.entries(configErrors).map(([file, err]) => `${file}:\n${err}`));
    throw new Error('Cannot find a config file. Provide with --config');
  }

  server(config, port);
})().catch(e => console.error(`Error`, e));