/* eslint-disable no-console */
import { StdioMessage, StdioMessageDirection, StdioMessageType } from '@experiterm/shared';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

function formatMessage(msg: Omit<StdioMessage, 'direction'>) {
  return JSON.stringify({ ...msg, direction: StdioMessageDirection.INPUT });
}

export interface StdioSocketContextProps {
  messages: StdioMessage[];
  socket: WebSocket;

  sendMessage: (...args: Parameters<typeof formatMessage>) => void;
}

const context = createContext<StdioSocketContextProps | null>(null);

export const StdioSocketProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const sockRef = useRef(new WebSocket(process.env.STDIO_SOCKET_URL));

  const [messages, setMessages] = useState<StdioMessage[]>([]);

  const handleConnection = useCallback(() => {
    console.info('STDIO socket has connected');
  }, []);
  const handleMessage = useCallback((e: MessageEvent<string>) => {
    const parsed = JSON.parse(e.data) as StdioMessage;
    if (parsed.type === StdioMessageType.HELLO) {
      console.info('%cSocket connected and said hello!', 'color: green;');
      return sockRef.current.send(formatMessage({ message: '', time: Date.now(), type: StdioMessageType.SHELL_START }));
    }
    setMessages(prev => prev.concat(parsed));
  }, []);
  const sendMessage = useCallback(
    (...args: Parameters<typeof formatMessage>) => sockRef.current.send(formatMessage(...args)),
    [],
  );

  const props = useMemo(
    (): StdioSocketContextProps => ({ messages, sendMessage, socket: sockRef.current }),
    [messages, sendMessage],
  );

  useEffect(() => {
    const { current: sock } = sockRef;
    sock.addEventListener('open', handleConnection);
    sock.addEventListener('message', handleMessage);
    return () => {
      sock.removeEventListener('open', handleConnection);
      sock.removeEventListener('message', handleMessage);
    };
  }, [handleConnection, handleMessage]);

  return <context.Provider value={props}>{children}</context.Provider>;
};

export function useStdioSocketContext() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error('Unable to read from <StdioSocketProvider />. Is one in the render tree?');
  }
  return ctx;
}
