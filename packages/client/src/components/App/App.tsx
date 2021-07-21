import React from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';

import { colors, spacings, toPx } from '../../theme';
import { TerminalInput } from '../TerminalInput';
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
    <section className={classes.app}>
      <TerminalOutput />
      <TerminalInput />
    </section>
  );
};
