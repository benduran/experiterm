/* eslint-disable no-console */
import { StdioMessage, StdioMessageDirection, StdioMessageType } from '@experiterm/shared';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export interface StdioSocketContextProps {
  socket: WebSocket;

  messages: StdioMessage[];
}

const context = createContext<StdioSocketContextProps | null>(null);

function formatMessage(msg: Omit<StdioMessage, 'direction'>) {
  return JSON.stringify({ ...msg, direction: StdioMessageDirection.INPUT });
}

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

  const props = useMemo((): StdioSocketContextProps => ({ messages, socket: sockRef.current }), [messages]);

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
