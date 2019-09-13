# Xazure Logger

An extensible, configurable logger. Used by Xazure CMS.

Provides a singleton which can easily be used in any module in your project.

## Basic Usage

    import logger from 'xazure-logger';
    import consoleLogger from 'xazure-logger-module-console';
    
    logger.configure({ modules: [consoleLogger] });
    logger.log('Hello World');
    
## Modules

Xazure Logger does no logging without a logging module. By adding modules, you can
log to anything, whether it is the browser console, a file system, an HTTP endpoint,
or anything else.

A module is quick simple. It's just a function that accepts the config object and
returns a method with logging.

    export default config => (level, messages) => {
      // do something with messages
    }
    
You don't have to check the level against the configuration, `logger` will do that itself
and only call the plugin method when it should do the logging.

The config it is given is the same one given to `logger`. Anytime the logger configuration
is changed, all modules will be regenerated with the new configuration as well.

By convention, logging modules for Xazure Logger should be `xazure-logger-module-*`. 
    
## Logging Levels

The logger has 5 different built-in levels, in order: `ERROR, WARN, INFO, LOG, DEBUG`.
There are constants available on the `Levels` object.

    import logger, { Levels } from 'xazure-logger';

The logger has a logging level which controls which messages are given. Setting the logger
to a level will log all messages of that level and higher. For example, if you set it
to `INFO`, you'll log `ERROR`, `WARN`, and `INFO` messages, while `LOG` and `DEBUG`
will be ignored.

You can change the level with `logger.configure()`.

    import logger, { Levels } from 'xazure-logger';
    
    logger.configure({ level: Levels.INFO });

There are functions for each level: `error()`, `warn()`, `info()`, `log()`, `debug()`.
You can give it any number of messages:

    `error('A', 'B', 'C', 'D')`
    
You can also log with a number:

    `logAt(41, 'A')` 
    
This can allow you to specify your own custom levels.

It's recommended that you set the level with a configuration file or environment
variables, so you can have more verbose levels while developing, and less verbose
in production.
    
## Singleton vs. Instances

    import logger, { Logger } from 'xazure-logger';
    
    const newLogger = Logger();
    
`logger` is a singleton. It'll always have the same configuration in all files. In most
cases, this is what you'll want to use.

`Logger()` will create a non-singleton instance which can have a separate configuration
from the singleton. **Note:** If you want to share this around, you'll have to pass it
manually.

## Configuration

     // Defaults
     {
       modules: []
       level: Levels.VERBOSE
     }
     
You can configure an existing instance, like the singleton, with `configure()`:

    logger.configure(newConfig);
    
**Note:** When you call `logger.configure`, it will merge the values into the
existing configuration (only changing what you provided). If you want to restore
it to the defaults, you can use `getDefaultConfig()`.
    
You can also pass a configuration when creating a new instance:

    const newLogger = Logger(config);
    
## API

    logger
    
    import logger from 'xazure-logger';
    
A singleton instance of `Logger()` for easily using the logger anywhere with shared
configuration.

    Logger(config)
    
    import { Logger } from 'xazure-logger';
        
Creates a new instance of Logger with the given configuration object.
See [Configuration](#configuration) for properties. `config` is optional.

    Levels.ERROR
    Levels.WARN
    Levels.INFO
    Levels.LOG
    Levels.DEBUG
    
    import { Levels } from 'xazure-logger';
    
The default logging levels, in order of verbosity.

    getDefaultConfig();
    
    import { getDefaultConfig } from 'xazure-logger';
    
Gets the default config object.

    logger.error(...messages)  // Levels.ERROR
    logger.warn(...messages)   // Levels.WARN
    logger.info(...messages)   // Levels.INFO
    logger.log(...messages)    // Levels.LOG
    logger.debug(...messages)  // Levels.DEBUG
    
Logs at the corresponding logging level.

    logger.logAt(level:number, ...messages)
    
Logs messages at the provided level.

    logger.willLog(level):boolean
    
Indicates if the given level would log.