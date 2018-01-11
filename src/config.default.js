import { join } from 'path';
import { Levels } from 'xazure-logger';

export default {
  public: {},
  port: 8000,
  logger: {
    level: Levels.DEBUG,
    modules: []
  },
  security: {
    roles: [],
    paths: []
  },
  publicPath: '/public',
  modules: [],
  db: {
    suppressUrlWarning: false
  }
};