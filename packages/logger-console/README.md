# Xazure Logger - Console Module

A module for [Xazure Logger](https://github.com/samanime/xazure-logger).

Logs all values to `console`.

## Basic Usage

    import logger from 'xazure-logger';
    import consoleLogger from 'xazure-logger-module-console';
    
    logger.configure({ plugins: [consoleLogger] });
    logger.log('Hello');
    
## Information

Uses the `console` methods `error()`, `warn()`, `info()`, `log()`, and `debug()`
for the corresponding log levels. 

If given a level other than the core levels, uses `console.log()`.