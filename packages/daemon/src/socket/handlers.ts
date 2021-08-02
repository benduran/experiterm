import 'ts-replace-all';

import { ansiIgnore, StdioMessage, StdioMessageDirection, StdioMessageType } from '@experiterm/shared';
import WebSocket from 'ws';

import { logger } from '../logger';
import { Terminal } from '../terminal';

/**
 * Formats an outbound message that's meant to be received by the browser's socket connection
 */
function formatMessage(msg: Omit<StdioMessage, 'direction'>) {
  return JSON.stringify({ ...msg, direction: StdioMessageDirection.OUTPUT });
}

/**
 * Handles an inbound message from the browser, meant to be piped to STDIN
 */
function handleSocketMessage(terminal: Terminal, socket: WebSocket) {
  return ({ data: msg }: { data: string }) => {
    const parsed = JSON.parse(msg) as StdioMessage;
    switch (parsed.type) {
      case StdioMessageType.SHELL_START:
        terminal.sendCommand('zsh');
        break;
      case StdioMessageType.STDIN:
        terminal.sendCommand(parsed.message);
        break;
      default:
        break;
    }
  };
}

function handleClose(
  terminal: Terminal,
  socket: WebSocket,
  onMessageHandler: ReturnType<typeof handleSocketMessage>,
  onErrorHandler: ReturnType<typeof handleError>,
) {
  const closeHandler = () => {
    socket.removeEventListener('error', onErrorHandler);
    socket.removeEventListener('message', onMessageHandler);
    socket.removeEventListener('close', closeHandler);
    logger.warn('Socket was closed');
    terminal.kill();
    logger.warn('Terminal was killed');
  };
  return closeHandler;
}

function handleError(terminal: Terminal, socket: WebSocket) {
  return () => logger.error('Socket experienced a connection error');
}

function removeAnsiIgnoreChars(msg: string) {
  return Object.values(ansiIgnore).reduce((prev, sequence) => prev.replaceAll(sequence, ''), msg);
}

/**
 * Sets up the handlers for messages and such over the socket
 */
export function onSocketConnection(socket: WebSocket) {
  const terminal = new Terminal();
  logger.info('Socket has connected');
  const onSocketMessage = handleSocketMessage(terminal, socket);
  const onError = handleError(terminal, socket);
  const onClose = handleClose(terminal, socket, onSocketMessage, onError);
  terminal.onData(msg => {
    socket.send(
      formatMessage({ message: removeAnsiIgnoreChars(msg), time: Date.now(), type: StdioMessageType.STDOUT }),
    );
  });
  socket.addEventListener('message', onSocketMessage);
  socket.addEventListener('close', onClose);
  socket.addEventListener('error', onError);
  socket.send(formatMessage({ message: 'Hello!', time: Date.now(), type: StdioMessageType.HELLO }));
}
