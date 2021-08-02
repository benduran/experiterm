const path = require('path');

const { craBaseConfig } = require('../../config.overrides.base');

module.exports = craBaseConfig({
  packageJsonPath: path.join(__dirname, 'package.json'),
  additionalEnvVars: {
    STDIO_SOCKET_URL: '"ws://localhost:2345/stdio"',
  },
});
