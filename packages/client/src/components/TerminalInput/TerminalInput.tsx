import { StdioMessageType } from '@experiterm/shared';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';

import { useStdioSocketContext } from '../../context';
import { colors } from '../../theme';

export const TerminalInput = () => {
  const classes = useCreateStyles({
    terminalInputContentEditable: {
      color: colors.green,
      display: 'inline-block',
      minWidth: '100px',
    },
  });
  const { sendMessage } = useStdioSocketContext();
  const [terminalInputRef, setTerminalInputRef] = useState<HTMLSpanElement | null>(null);

  const handleSendMessageOnEnter = useCallback(
    (e: KeyboardEvent) => {
      if (terminalInputRef && e.key === 'Enter') {
        e.preventDefault();
        sendMessage({ message: terminalInputRef?.innerHTML, time: Date.now(), type: StdioMessageType.STDIN });
        terminalInputRef.innerHTML = '';
      }
    },
    [sendMessage, terminalInputRef],
  );

  useEffect(() => {
    if (terminalInputRef) terminalInputRef.focus();
  }, [terminalInputRef]);

  useLayoutEffect(() => {
    document.addEventListener('keydown', handleSendMessageOnEnter);
    return () => document.removeEventListener('keydown', handleSendMessageOnEnter);
  }, [handleSendMessageOnEnter]);

  return <span className={classes.terminalInputContentEditable} contentEditable ref={setTerminalInputRef}></span>;
};
