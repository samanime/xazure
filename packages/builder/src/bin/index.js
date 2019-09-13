#! /usr/bin/env node
/* global process */
import 'source-map-support/register';
import 'babel-polyfill';
import { delimiter } from 'path';

const runDir = process.cwd();

process.env.NODE_PATH = [process.env.NODE_PATH, __dirname, runDir].filter(Boolean).join(delimiter);
process.chdir(__dirname);

import { readConfig } from '../utils';
import build from '..';

const availableCommands = ['default', 'clean', 'build', 'watch'];

const initialIndex = 2;
const firstOptionIndex = process.argv.findIndex(a => /^-/.test(a));
const commands = process.argv.slice(initialIndex, firstOptionIndex !== -1 ? firstOptionIndex : undefined);
const options = firstOptionIndex !== -1 ? process.argv.slice(firstOptionIndex) : [];

const dir = commands[0] && !availableCommands.includes(commands[0]) ? commands[0] : runDir;
const command = availableCommands.includes(commands[0]) ? commands[0] : (availableCommands.includes(commands[1]) ? commands[1] : 'default');
const watch = options.includes('-w') || options.includes('--watch');
const debug = options.includes('-d') || options.includes('--debug');
const config = readConfig(dir);

build(dir, config, command, watch, Object.assign({ debug: (...args) => debug && console.debug.apply(console, args) }, console))
  .then(() => console.log(watch ? 'Build done. Watching for changes...' : 'Done.'))
  .catch(err => {
    console.error(`Error: ${err}`, err.stack);
    process.exit(128);
  });