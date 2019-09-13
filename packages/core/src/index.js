/* global global, process */
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { join, resolve } from 'path';
import { requireFile, flatten, normalizeModules, checkConfig, stringifyConfig } from './utils';
import logger, { Levels } from '@xazure/logger';
import EventManager from '@xazure/event-manager';
import getEvents from './events';
import defaultConfig from './config.default';

export default async (configPath, portOption) => {
  const config = Object.assign({}, defaultConfig,
    {
      port: 8000,
      publicPath: '/public'
    },
    await requireFile(configPath || join(__dirname, './config.js')),
    portOption && { port: portOption }
  );

  const {
    public: publicConfig,
    publicPath,
    port,
    secret,
    logger: {},
    db: { url: dbUrl }
  } = config;

  checkConfig(config);

  logger.configure(config.logger);

  const modules = config.modules = normalizeModules(config.modules);
  const eventManager = EventManager();

  if (dbUrl) {
    mongoose.set('debug', (collection, method, ...args) => {
      const argsStr = args.map(a => {
        if (!a || typeof a !== 'object') {
          return a;
        }

        const objStr = Object.entries(a)
          .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
          .join(', ');

        return objStr ? `{ ${objStr} }` : '{}';
      }).join(', ');
      logger.debug(`[Mongoose] ${collection}.${method}(${argsStr})`);
    });
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl)
      .then(async () => logger.log('Connected to Mongo'))
      .catch(err => logger.error('Error connecting to Mongo', err));
  }

  const commonParams = ({ config, eventManager, mongoose, a: eventManager.apply.bind(eventManager) });
  eventManager.addMap(getEvents(commonParams));

  logger.willLog(Levels.DEBUG) && logger.debug(stringifyConfig(config));

  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    store: new (MongoStore(session))({ mongooseConnection: mongoose.connection })
  }));

  app.use(async (req, res, next) => {
    const start = Date.now();
    const url = req.url;
    res.on('finish', () => {
      logger.info(`${url} | ${req.method} | ${res.statusCode} | ${req.session.userId} | ${Date.now() - start}`);
    });

    !(await eventManager.apply('allowed', { req, allowed: true })).allowed ? res.status(403).send('Forbidden') : next();
  });

  app.get('/config', (req, res) => res.send(publicConfig));
  app.get(`${publicPath}/babel-polyfill`, (req, res) =>
    res.sendFile(resolve(require.resolve('babel-polyfill'), '../../dist/polyfill.js')));

  const { messages, controllerPaths, staticFiles } = modules.map(module => {
    const { controller, events, name, publicFilePath, path, publicPath } = module;
    const params = { ...commonParams, module };
    const controllerPaths = [];
    const staticFiles = [];
    const messages = [];
    
    if (controller) {
      controllerPaths.push({ path, handler: controller(params) });
      messages.push(`[${name}] Registered controller to ${path}`);
    }
    
    if (events) {
      eventManager.addMap(events(params));
      messages.push(`[${name}] Registered events: ${Object.keys(events).join(', ')}`);
    }
    
    if (publicPath && publicFilePath) {
      staticFiles.push({ path: publicPath, handler: express.static(publicFilePath) });
      messages.push(`[${name}] Registered public directory to ${publicPath}`);
    }

    return { messages, staticFiles, controllerPaths };
  }).reduce((r, { messages, staticFiles, controllerPaths }) =>
    ({
      messages: r.messages.concat(messages),
      controllerPaths: r.controllerPaths.concat(controllerPaths),
      staticFiles: r.staticFiles.concat(staticFiles)
    }),
    { messages: [], controllerPaths: [], staticFiles: []});

  staticFiles.forEach(({ path, handler }) => app.use(path, handler));
  controllerPaths.forEach(({ path, handler }) => app.use(path, handler));
  messages.sort().forEach(m => logger.log(m));

  await eventManager.apply('init');

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${port}`);
      resolve(server);
    });

    server.on('error', err => {
      logger.error(`Error connecting: ${err}`);
      reject();
    });
  });
};