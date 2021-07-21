import React from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';

import { borderRadius, colors, spacings, toPx } from '../../theme';

export const TerminalOutput = () => {
  const classes = useCreateStyles({
    terminalLine: {
      padding: toPx(spacings.space1),
    },
    terminalOutputRoot: {
      border: `1px solid ${colors.green}`,
      borderRadius: toPx(borderRadius.borderRadius0),
      color: colors.green,
      flexGrow: 1,
      flexShrink: 1,
      listStyle: 'none',
      margin: 0,
      marginBottom: toPx(spacings.space1),
      minHeight: 0,
      overflowY: 'auto',
      padding: 0,
      '--webkit-overflow-scrolling': 'touch',
    },
  });

  return (
    <ul className={classes.terminalOutputRoot}>
      <li className={classes.terminalLine}>Something here</li>
    </ul>
  );
};
