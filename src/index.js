/* global global, process */
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { join, resolve } from 'path';
import { requireFile, flatten, normalizeModules, checkConfig, stringifyConfig } from './utils';
import logger, { Levels } from 'xazure-logger';
import EventManager from 'xazure-event-manager';
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
    mongoose.connect(dbUrl);
    mongoose.Promise = global.Promise;
  }

  const eventParams = ({ config, eventManager, mongoose, a: eventManager.apply.bind(eventManager) });
  eventManager.addMap(getEvents(eventParams));

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
    res.on('finish', () => {
      logger.info(`${req.url} | ${res.statusCode} | ${req.session.userId}`);
    });

    !(await eventManager.apply('allowed', { req, allowed: true }))
      ? res.status(403).send('Forbidden') : next();
  });

  app.get('/config', (req, res) => res.send(publicConfig));
  app.get(`${publicPath}/babel-polyfill`, (req, res) => res.sendFile(resolve(require.resolve('babel-polyfill'), '../../dist/polyfill.js')));

  flatten(modules.map(module => {
    console.log(module);
    const { controller, events, name, filePath, publicFilePath, path, publicPath } = module;
    const params = { ...eventParams, module };
    const messages = [];
    
    if (controller) {
      app.use(path, controller(params));
      messages.push(`[${name}] Registered controller to ${path}`);
    }
    
    if (events) {
      eventManager.addMap(events(params));
      messages.push(`[${name}] Registered events: ${Object.keys(events).join(', ')}`);
    }
    
    if (publicPath && publicFilePath) {
      app.use(publicPath, express.static(publicFilePath));
      messages.push(`[${name}] Registered public directory to ${publicPath}`);
    }

    return messages;
  })).sort().forEach(m => logger.log(m));

  await eventManager.apply('init');

  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      logger.info(`Listening on port ${port}`);
      resolve();
    }).on('error', err => {
      logger.error(`Error connecting: ${err}`);
      reject();
    });
  });
};