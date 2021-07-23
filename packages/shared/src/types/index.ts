export enum StdioMessageDirection {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export enum StdioMessageType {
  HELLO = 'HELLO',
  SHELL_START = 'SHELL_START',
  STDIN = 'STDIN',
  STDOUT = 'STDOUT',
}

export interface StdioMessage {
  direction: StdioMessageDirection;
  message: string;
  time: number;
  type: StdioMessageType;
}
