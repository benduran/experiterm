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

/**
 * Represents either an inbound or outbound message coming or going to the daemon
 */
export interface StdioMessage {
  direction: StdioMessageDirection;
  message: string;
  time: number;
  type: StdioMessageType;
}

/**
 * Represents a keyboard event that will be sent to the daemon and processed and piped to Stdin
 */
export type StdInEvent = Pick<KeyboardEvent, 'key' | 'keyCode' | 'altKey' | 'ctrlKey' | 'shiftKey' | 'which'>;
