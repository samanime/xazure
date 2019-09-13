import { join, basename } from 'path';
import controller from './controller';
import events from './events';

const name = basename(__dirname.replace(/^xazure-module-/, ''));
const filePath = join(__dirname);
const publicFilePath = join(filePath, 'public');

export { controller, events, publicFilePath, filePath, name };