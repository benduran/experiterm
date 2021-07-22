import express from 'express';
import { Server as WsServer } from 'ws';

import { onSocketConnection } from './socket';

function launchDaemonServer() {
  const app = express();
  if (process.env.NODE_ENV === 'production') {
    // TODO: Add express static middleware to serve the UI
  }
  const listener = app.listen(2345, '0.0.0.0', () => {
    console.info('Listening for connections on http://0.0.0.0:2345');
  });
  const wss = new WsServer({
    server: listener,
    path: '/stdio',
  });
  wss.on('connection', onSocketConnection);
}

launchDaemonServer();
