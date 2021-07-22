import { extendViteBaseConfig } from '../../vite.config.base';

export default extendViteBaseConfig({
  additionalEnvVars: {
    STDIO_SOCKET_URL: '"ws://localhost:2345/stdio"',
  },
});
