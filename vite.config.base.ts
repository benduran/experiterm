import reactRefresh from '@vitejs/plugin-react-refresh';
import fs from 'fs';
import path from 'path';
import { defineConfig, UserConfig, UserConfigExport } from 'vite';
import envCompatible from 'vite-plugin-env-compatible';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

type Env = Record<string, string | number | SubEnv>;
// Hack to allow circular typings
interface SubEnv extends Env {}

interface ExtendViteBaseConfigOptions {
  additionalEnvVars?: Env;
  configOverrides?: UserConfig;
}

export function extendViteBaseConfig({
  additionalEnvVars = {},
  configOverrides = {},
}: ExtendViteBaseConfigOptions = {}): UserConfigExport {
  const nodeEnv = process.env.NODE_ENV || 'prod';

  const { name, version } = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const now = new Date().toISOString();
  const appName = name.split('/')[1] || name;

  const env: Env = {
    APP_NAME: `"${appName}"`,
    APP_VERSION: `"${version}"`,
    BUILD_BRANCH: `"${process.env.BRANCH || process.env.CARSON_NETFLIX_BUILD_BRANCH || ''}"`,
    BUILD_SHA: `"${process.env.SHA || ''}"`,
    BUILD_TIME: `"${now}"`,
    BUILD_URL: `"${process.env.BUILD_URL || ''}"`,
    NODE_ENV: `"${nodeEnv}"`,
    // Allow an app to override any of these incoming values
    ...additionalEnvVars,
  };
  const define = Object.entries(env).reduce(
    (prev, [key, val]) => ({ ...prev, [`process.env.${key}`]: val }),
    {} as any,
  );
  console.info('Using the following process.env variables', define);
  return defineConfig({
    ...configOverrides,
    define,
    build: {
      ...configOverrides.build,
      outDir: path.join(process.cwd(), 'build'),
      sourcemap: true,
    },
    plugins: [
      envCompatible(),
      reactRefresh(),
      tsconfigPaths({ root: process.cwd() }),
      svgr(),
      ...(configOverrides.plugins || []),
    ],
    resolve: {
      ...configOverrides.resolve,
      // Copy over the defaults from Vite's documentation, but also allow regular main files as a fallback
      mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
    },
    root: process.cwd(),
    server: {
      port: 1234,
      strictPort: true, // Fail fast if port is taken
    },
  });
}
