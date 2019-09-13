import { stat } from '../utils';
import { join } from "path";
import server from '../index';

export default async (runDir, configOption, port) => {
  let configErrors = {};

  const config = configOption || (await Promise.all(['dist/config.js', 'config.js']
    .map(p => join(runDir, p))
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

  return server(config, port);
};