import moment from 'moment';

export const Levels = {
  ERROR: 100,
  WARN: 50,
  INFO: 20,
  LOG: 10,
  DEBUG: 0
};

export const getDefaultConfig = () => ({
  level: Levels.LOG,
  modules: [],
  timestamp: true,
  timestampFormat: null
});

export const Logger = (initialConfig = {}) => {
  const config = Object.assign({}, getDefaultConfig(), initialConfig);
  let modules = config.modules.map(m => m(config));

  const shouldLog = messageLevel => messageLevel >= config.level;

  const log = (level, messages) => shouldLog(level)
    && modules.forEach(m => m(level, config.timestamp
      ? [`[${moment().format(config.timestampFormat)}]`].concat(messages) : messages));

  return {
    error(...messages) { log(Levels.ERROR, messages); },
    warn(...messages) { log(Levels.WARN, messages); },
    info(...messages) { log(Levels.INFO, messages); },
    log(...messages) { log(Levels.LOG, messages); },
    debug(...messages) { log(Levels.DEBUG, messages); },
    logAt: (level, ...messages) => log(level, messages),
    willLog: shouldLog,
    configure(newConfig) {
      Object.assign(config, newConfig);
      modules = config.modules.map(m => m(config))
    }
  };
};

export default Logger();