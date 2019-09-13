import merge from 'merge';
import auth from '@xazure/module-auth';
import admin from '@xazure/module-admin';
import posts from '@xazure/module-posts';
import theme from '@xazure/module-theme';
import defaultTheme from '@xazure/theme-default';
import { Levels } from '@xazure/logger';
import consoleLogger from '@xazure/logger-console';

export default merge({
  public: {},
  port: 8000,
  logger: {
    level: Levels.DEBUG,
    modules: [consoleLogger]
  },
  publicPath: '/public',
  modules: [
    {
      ...auth,
      path: '/',
      apiPath: '/api/auth',
      roles: ['admin'],
      paths: [
        { path: '/admin', requiredRoles: ['admin'] },
        { path: '/api', methods: ['POST', 'PUT', 'DELETE'], requiredRoles: ['admin'] },
        { path: '/', allowAll: true },
      ]
    },
    { ...posts, path: '/', apiPath: '/api/post', public: { adminPath: '/posts' }, routes: { page: '/:slug' } },
    { ...admin, path: '/admin' },
    { ...theme, path: '/', publicPath: '/public/theme', apiPath: '/api/theme', theme: defaultTheme }
  ]
}, require('./config.private').default);