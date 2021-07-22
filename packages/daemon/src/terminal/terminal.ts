import { spawn } from 'child_process';

import { logger } from '../logger';

logger.info('Starting terminal...');
// let's only deal with a singleton process right now
const terminalProcess = spawn('/usr/bin/zsh', ['-i']);
let stdoutBuffer = '';

terminalProcess.stdout.on('data', msg => {
  logger.info('Received message from terminal process');
  stdoutBuffer += msg.toString();
  console.info(stdoutBuffer);
});

let stdErrBuffer = '';
terminalProcess.stderr.on('data', msg => {
  logger.error('Received error from terminal process');
  stdErrBuffer += msg.toString();
  console.info(stdErrBuffer);
});

export function sendCommand(cmdWithArgs: string) {
  logger.info(`Sending command ${cmdWithArgs}`);
  terminalProcess.stdin.write(`${cmdWithArgs}\n`);
  terminalProcess.stdin.end();
}
