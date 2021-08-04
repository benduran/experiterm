import 'xterm/css/xterm.css';

import { StdioMessageType } from '@experiterm/shared';
import React, { useCallback, useEffect, useState } from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';
import { Terminal } from 'xterm';

import { useStdioSocketContext } from '../../context';

interface XTermProps {
  className?: string;
}

export const XTerm = ({ className }: XTermProps) => {
  const classes = useCreateStyles({
    terminalDivWrapper: {
      '& > .terminal': {
        flexGrow: 1,
        overflowY: 'auto',
      },
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minHeight: 0,
    },
  });
  const { messages, sendMessage } = useStdioSocketContext();
  const [terminalDiv, setTerminalDiv] = useState<HTMLDivElement | null>(null);
  const [xterm, setXterm] = useState<Terminal | null>(null);
  const messagesLen = messages.length;
  const lastMessage = messages.length ? messages[messages.length - 1] : null;

  const handleTerminalSendData = useCallback(
    (message: string) => {
      sendMessage({
        message,
        time: Date.now(),
        type: StdioMessageType.STDIN,
      });
    },
    [sendMessage],
  );

  useEffect(() => {
    if (!xterm && terminalDiv) {
      const t = new Terminal({
        cursorBlink: true,
        logLevel: 'debug',
        rendererType: 'canvas',
      });
      t.onData(handleTerminalSendData);
      t.open(terminalDiv);
      setXterm(t);
    }
  }, [handleTerminalSendData, sendMessage, terminalDiv, xterm]);

  useEffect(() => {
    if (xterm && lastMessage) {
      console.info(`%cWriting message to xterm: ${lastMessage.message}`, 'font-weight: bold; color: blue;');
      xterm.write(lastMessage.message);
    }
  }, [lastMessage, messagesLen, xterm]);

  return <div className={`${classes.terminalDivWrapper} ${className || ''}`} ref={setTerminalDiv} />;
};
