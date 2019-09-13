#! /usr/bin/env node
/*
 This is required as the entry point so the actual built files don't get locked so they
 can restart themselves.
 */
require(require('path').join(__dirname, 'dist', 'bin'));