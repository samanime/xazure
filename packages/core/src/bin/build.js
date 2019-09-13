import logger from '@xazure/logger';
import build, { utils } from '@xazure/builder';

const { readConfig } = utils;

export default async (dir, watch) => {
  const config = readConfig(dir);

  try {
    build(dir, config, 'build', watch, logger)
      .then(() => console.log(watch ? 'Build done. Watching for changes...' : 'Done.'))
      .catch(err => console.error(`Error: ${err}`));
  } catch (err) {
    console.error(err);
  }
}