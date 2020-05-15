#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const program = require('commander');
const Pagic = require('..').default;
const http = require('http');
const ecstatic = require('ecstatic');

const DEFAULT_PORT = 8000;

program
  .option('-w, --watch', 'watch src dir change')
  .option('-s, --serve', 'serve public dir')
  .option('-p, --port', 'override default port')
  .parse(process.argv);

const pagic = new Pagic();

if (program.watch) {
  pagic.setConfig({
    watch: true
  });
}

if (program.serve) {
  let port = DEFAULT_PORT;
  if (program.port) {
    port = program.port;
  }

  http.createServer(ecstatic({ root: pagic.config.publicDir })).listen(port);

  console.log(`Serve ${pagic.config.publicDir} on http://localhost:${port}/`);
}
