export const unit = 8;

export const spacings = {
  space0: unit / 2,
  space1: unit,
  space2: unit * 2,
  space3: unit * 3,
  space4: unit * 4,
};

export const fontSizes = {
  fontSize0: 12,
  fontSize1: 16,
  fontSize2: 24,
  fontSize3: 32,
  fontSize4: 40,
  fontSize5: 48,
  fontSize6: 56,
};

export const colors = {
  name: '3024 Night',
  black: '#090300',
  red: '#db2d20',
  green: '#01a252',
  yellow: '#fded02',
  blue: '#01a0e4',
  purple: '#a16a94',
  cyan: '#b5e4f4',
  white: '#a5a2a2',
  brightBlack: '#5c5855',
  brightRed: '#e8bbd0',
  brightGreen: '#3a3432',
  brightYellow: '#4a4543',
  brightBlue: '#807d7c',
  brightPurple: '#d6d5d4',
  brightCyan: '#cdab53',
  brightWhite: '#f7f7f7',
  background: '#090300',
  foreground: '#a5a2a2',
  selectionBackground: '#4a4543',
  cursorColor: '#a5a2a2',
};

export const heights = {
  terminalInput: 80,
};

export const borderRadius = {
  borderRadius0: 2,
  borderRadius1: 4,
  borderRadius2: 8,
};

export function toPx(val: number) {
  return `${val}px`;
}
