import 'ts-replace-all';

import { detectAnsi, removeIrrelevantDetectionCharacters, StdioMessage } from '@experiterm/shared';
import Ansi from 'ansi-to-react';
import React, { useMemo } from 'react';

/**
 * This component unwraps the ANSI styles
 * and transforms them into browser-friendly ones
 */
export const TerminalLine = ({ message }: Pick<StdioMessage, 'message'>) => {
  const detections = useMemo(() => detectAnsi(message), [message]);
  const cleanedMessage = useMemo(() => removeIrrelevantDetectionCharacters(message), [message]);
  return <Ansi>{cleanedMessage}</Ansi>;
};
