import 'xterm/css/xterm.css';

import React, { useEffect, useState } from 'react';
import { Terminal } from 'xterm';

import { useStdioSocketContext } from '../../context';

interface XTermProps {
  className?: string;
}

export const XTerm = ({ className }: XTermProps) => {
  const { messages } = useStdioSocketContext();
  const [terminalDiv, setTerminalDiv] = useState<HTMLDivElement | null>(null);
  const [xterm, setXterm] = useState<Terminal | null>(null);
  const lastMessage = messages.length ? messages[messages.length - 1] : null;

  useEffect(() => {
    if (!xterm && terminalDiv) {
      const t = new Terminal({
        rendererType: 'canvas',
      });
      t.open(terminalDiv);
      setXterm(t);
    }
  }, [terminalDiv, xterm]);

  useEffect(() => {
    if (xterm && lastMessage) xterm.write(lastMessage.message);
  }, [lastMessage, xterm]);

  return <div className={className} ref={setTerminalDiv} />;
};
