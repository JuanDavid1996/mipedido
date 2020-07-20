#!/usr/bin/env node

import { Server } from "https";
import { AddressInfo } from "net";
import * as process from "process";

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('domi-back:server');
const http = require('http');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

let server: Server|null = null;

import mongoose, {Mongoose} from "mongoose";
mongoose
    .connect(
    'mongodb://localhost:27017/domi',
    {useNewUrlParser: true, useUnifiedTopology: true})
      .then((con: Mongoose) => {

        server = http.createServer(app);
        server!.listen(port);
        server!.on('error', onError);
        server!.on('listening', onListening);
      });

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr: AddressInfo|null|string = server!.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}
