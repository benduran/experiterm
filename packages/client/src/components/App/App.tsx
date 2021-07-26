import React from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';

import { StdioSocketProvider } from '../../context';
import { colors, spacings, toPx } from '../../theme';
import { TerminalOutput } from '../TerminalOutput';

export const App = () => {
  const classes = useCreateStyles({
    app: {
      background: colors.background,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      left: 0,
      padding: toPx(spacings.space1),
      position: 'fixed',
      right: 0,
      top: 0,
    },
  });
  return (
    <StdioSocketProvider>
      <section className={classes.app}>
        <TerminalOutput />
      </section>
    </StdioSocketProvider>
  );
};
