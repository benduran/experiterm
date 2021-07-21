import React from 'react';
import { useCreateStyles } from 'simplestyle-js/esm/react';

import { borderRadius, colors, heights, spacings, toPx } from '../../theme';

export const TerminalInput = () => {
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

  return <textarea className={classes.terminalRoot} placeholder='Blep' />;
};
