/* global process */
import 'source-map-support/register';
import 'babel-polyfill';
import { delimiter } from 'path';

const runDir = process.cwd();

console.log(runDir);

process.env.NODE_PATH = [process.env.NODE_PATH, __dirname, runDir].filter(Boolean).join(delimiter);
process.chdir(__dirname);

import commandLineArgs from 'command-line-args';
import build from './build';
import start from './start';
import devMode from './devMode';

(async () => {
  const { command = 'start', config, port } = commandLineArgs([
    { name: 'command', defaultOption: true,  },
    { name: 'config', alias: 'c', type: String, defaultOptions: true },
    { name: 'port', alias: 'p', type: Number }
  ]);

  if (command && !['dev-mode', 'build', 'watch', 'start'].includes(command)) {
    throw new `Invalid command: ${command}`;
  }

  switch (command) {
    case 'build':
    case 'watch':
      return build(runDir, command === 'watch');
    case 'dev-mode':
      return devMode(runDir, config, port);
    case 'start':
    default:
      return start(runDir, config, port);
  }
})().catch(e => console.error(`Error`, e));