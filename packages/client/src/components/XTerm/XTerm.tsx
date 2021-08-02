import 'xterm/css/xterm.css';

import { StdioMessageType } from '@experiterm/shared';
import React, { useCallback, useEffect, useState } from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';
import { IEvent, Terminal } from 'xterm';

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
  const lastMessage = messages.length ? messages[messages.length - 1] : null;

  useEffect(() => {
    if (!xterm && terminalDiv) {
      const t = new Terminal({
        rendererType: 'canvas',
      });
      t.onData(msg => {
        sendMessage({
          message: msg,
          time: Date.now(),
          type: StdioMessageType.STDIN,
        });
      });
      t.open(terminalDiv);
      setXterm(t);
    }
  }, [sendMessage, terminalDiv, xterm]);

  useEffect(() => {
    if (xterm && lastMessage) {
      console.info(`%cWriting message to xterm: ${lastMessage.message}`, 'font-weight: bold; color: blue;');
      xterm.write(lastMessage.message);
    }
  }, [lastMessage, xterm]);

  return <div className={`${classes.terminalDivWrapper} ${className || ''}`} ref={setTerminalDiv} />;
};
