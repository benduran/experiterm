import { spawn } from 'node-pty';
import os from 'os';

import { logger } from '../logger';

export class Terminal {
  static lineEnding = os.platform() === 'win32' ? '\r\n' : '\n';
  static shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

  private terminalProcess: ReturnType<typeof spawn>;
  private stdoutBuffer = '';
  private onDataHandlers: Array<(msg: string) => void>;

  constructor() {
    logger.info('Starting terminal...');
    this.terminalProcess = spawn(Terminal.shell, [], {
      cwd: process.env.HOME,
      env: process.env as Record<string, string>,
    });

    this.onDataHandlers = [];

    this.terminalProcess.onData(this.handleOnData);
  }

  onData(handler: (msg: string) => void) {
    this.onDataHandlers.push(handler);
  }

  sendCommand(cmdWithArgs: string) {
    logger.info(`Sending command ${cmdWithArgs}`);
    this.terminalProcess.write(cmdWithArgs);
  }

  kill() {
    this.terminalProcess.kill();
    this.onDataHandlers = [];
  }

  handleOnData = (msg: string) => {
    logger.info('Received message from terminal process');
    this.onDataHandlers.forEach(handler => handler(msg));
  };
}
