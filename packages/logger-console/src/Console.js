import { Levels } from '@xazure/logger';

const methods = {
  [Levels.ERROR]: console.error,
  [Levels.WARN]: console.warn,
  [Levels.INFO]: console.info,
  [Levels.LOG]: console.log,
  [Levels.DEBUG]: console.debug
};

export default config => (level, messages) => {
  (methods[level] || console.log).apply(console, messages);
};