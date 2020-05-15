#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('init <dir>', 'create a new Pagic folder')
  .command('build [options]', 'build static page')
  .parse(process.argv);
