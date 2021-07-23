import React, { useCallback, useState } from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';

import { StdioMessageType } from '../../../../shared/src';
import { useStdioSocketContext } from '../../context';
import { borderRadius, colors, heights, spacings, toPx } from '../../theme';

export const TerminalInput = () => {
  const [input, setInput] = useState('');
  const classes = useCreateStyles({
    terminalRoot: {
      '&:focus': {
        borderColor: colors.green,
        boxShadow: `0px 0px ${toPx(spacings.space2)} ${colors.green} inset`,
      },
      '&::placeholder': {
        color: colors.green,
      },
      backgroundColor: colors.background,
      border: `1px solid ${colors.green}`,
      borderRadius: toPx(borderRadius.borderRadius0),
      color: colors.green,
      height: toPx(heights.terminalInput),
      padding: toPx(spacings.space1),
      resize: 'none',
    },
  });

  const { sendMessage } = useStdioSocketContext();

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      switch (e.key) {
        case 'Enter':
          if (e.shiftKey) return;
          e.preventDefault();
          sendMessage({ message: input, time: Date.now(), type: StdioMessageType.STDIN });
          setInput('');
          break;
        default:
          break;
      }
    },
    [input, sendMessage],
  );
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.currentTarget.value), []);

  return (
    <textarea
      className={classes.terminalRoot}
      onChange={handleChange}
      onKeyDown={handleKeydown}
      placeholder='Input here'
      value={input}
    />
  );
};
