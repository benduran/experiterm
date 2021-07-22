import { StdioMessage, StdioMessageDirection, StdioMessageType } from '@experiterm/shared';
import WebSocket from 'ws';

import { logger } from '../logger';
import { sendCommand } from '../terminal/terminal';

function formatMessage(msg: Omit<StdioMessage, 'direction'>) {
  return JSON.stringify({ ...msg, direction: StdioMessageDirection.OUTPUT });
}

function handleMessage(socket: WebSocket) {
  return (e: { data: string }) => {
    const parsed = JSON.parse(e.data) as StdioMessage;
    switch (parsed.type) {
      case StdioMessageType.SHELL_START:
        sendCommand('zsh');
        break;
      default:
        break;
    }
  };
}

function handleClose(
  socket: WebSocket,
  onMessageHandler: ReturnType<typeof handleMessage>,
  onErrorHandler: ReturnType<typeof handleError>,
) {
  const closeHandler = () => {
    socket.removeEventListener('error', onErrorHandler);
    socket.removeEventListener('message', onMessageHandler);
    socket.removeEventListener('close', closeHandler);
    logger.warn('Socket was closed');
  };
  return closeHandler;
}

function handleError(socket: WebSocket) {
  return () => logger.error('Socket experienced a connection error');
}

/**
 * Sets up the handlers for messages and such over the socket
 */
export function onSocketConnection(socket: WebSocket) {
  logger.info('Socket has connected');
  const onMessage = handleMessage(socket);
  const onError = handleError(socket);
  const onClose = handleClose(socket, onMessage, onError);
  socket.addEventListener('message', onMessage);
  socket.addEventListener('close', onClose);
  socket.addEventListener('error', onError);
  socket.send(formatMessage({ message: 'Hello!', time: Date.now(), type: StdioMessageType.HELLO }));
}
