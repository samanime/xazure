import { Levels } from '@xazure/logger';

export default {
  public: {},
  port: 8000,
  logger: {
    level: Levels.INFO,
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