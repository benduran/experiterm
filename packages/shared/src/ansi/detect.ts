/* eslint-disable no-useless-escape */

import ansiEscape from 'ansi-escape-sequences';
import escapeStrForRegexp from 'escape-string-regexp';

import { ANSI_ESCAPE } from './escape';

const move = new RegExp(`^${escapeStrForRegexp(ANSI_ESCAPE)}](\\d+);`);

export function detectAnsi(input: string) {
  const cursorHide = input.includes(ansiEscape.cursor.hide);
  const cursorShow = input.includes(ansiEscape.cursor.show);
  const cursorMove = move.exec(input)?.[1];

  return {
    cursor: {
      hide: cursorHide,
      move: Number(cursorMove ?? -1),
      show: cursorShow,
    },
  };
}

export function removeIrrelevantDetectionCharacters(input: string) {
  return input.replace(move, '');
}
