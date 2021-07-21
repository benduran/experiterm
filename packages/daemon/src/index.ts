import express from 'express';
import { Server as WsServer } from 'ws';

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
  wss.on('connection', () => {
    console.info('TODO: Bind logic for connections here');
  });
}

launchDaemonServer();
