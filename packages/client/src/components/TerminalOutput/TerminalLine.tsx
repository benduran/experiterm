import 'ts-replace-all';

import { StdioMessage } from '@experiterm/shared';
import ansiStyles from 'ansi-styles';
import React, { useMemo } from 'react';

import { colors } from '../../theme';

const styleStart = (color: string) => `<span style="color: ${color};">`;
const styleClose = () => '</span>';

/**
 * This component unwraps the ANSI styles
 * and transforms them into browser-friendly ones
 */
export const TerminalLine = ({ message }: Pick<StdioMessage, 'message'>) => {
  const formattedMsg = useMemo(() => {
    let out = message;
    out = out.replaceAll(ansiStyles.green.open, styleStart(colors.green));
    out = out.replaceAll(ansiStyles.green.close, styleClose());
    out = out.replaceAll(ansiStyles.grey.open, styleStart(colors.gray));
    out = out.replaceAll(ansiStyles.grey.close, styleClose());
    out = out.replaceAll(ansiStyles.magenta.open, styleStart(colors.purple));
    out = out.replaceAll(ansiStyles.magenta.close, styleClose());
    out = out.replaceAll(ansiStyles.magentaBright.open, styleStart(colors.brightPurple));
    out = out.replaceAll(ansiStyles.magentaBright.close, styleClose());
    out = out.replaceAll(ansiStyles.red.open, styleStart(colors.red));
    out = out.replaceAll(ansiStyles.red.close, styleClose());
    out = out.replaceAll(ansiStyles.redBright.open, styleStart(colors.brightRed));
    out = out.replaceAll(ansiStyles.redBright.close, styleClose());
    out = out.replaceAll(ansiStyles.white.open, styleStart(colors.white));
    out = out.replaceAll(ansiStyles.white.close, styleClose());
    out = out.replaceAll(ansiStyles.whiteBright.open, styleStart(colors.brightWhite));
    out = out.replaceAll(ansiStyles.whiteBright.close, styleClose());
    out = out.replaceAll(ansiStyles.yellow.open, styleStart(colors.yellow));
    out = out.replaceAll(ansiStyles.yellow.close, styleClose());
    out = out.replaceAll(ansiStyles.yellowBright.open, styleStart(colors.brightYellow));
    out = out.replaceAll(ansiStyles.yellowBright.close, styleClose());

    return out;
  }, [message]);

  return <span dangerouslySetInnerHTML={{ __html: formattedMsg }} />;
};
