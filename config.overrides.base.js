/* eslint-disable no-console */

const path = require('path');

const chalk = require('chalk');
const fs = require('fs-extra');

const webpack = require('webpack');

// NOTE: Add additional folders here if you need to have folders outside of your
// UI's main "src" folder compiled. This is useful if you rely on a shared folder within this Monorepo.
const transpilePaths = [path.join(__dirname, './packages/shared/src')];

/**
 * Sets up the base Create-React-App config overrides and supplements with a select set of your own values.
 * @param {object} opts - Object containing all of the options
 * @param {string} opts.packageJsonPath - The path to your local package's package.json (REQUIRED)
 * @param {object} opts.additionalEnvVars - Additional environment variables to inject into process.env at runtime
 * @param {string[]} opts.additionalTranspilePaths - Additional paths to include in your CRA + TypeScript compilation
 * @param {object[]} opts.additionalWebpackPlugins - An array of additional Webpack plugins you'd need applied to your configuration
 * returns Customize-CRA config to use in your local module.exports assignment
 */
exports.craBaseConfig = function craBaseConfig({
  packageJsonPath,
  additionalEnvVars = {},
  additionalTranspilePaths = [],
  additionalWebpackPlugins = [],
}) {
  if (!packageJsonPath) {
    throw new Error('Unable to instantiate base CRA Config because no package.json path was provided.');
  }
  if (!packageJsonPath.endsWith('.json')) {
    throw new Error('Unable to instantiate base CRA Config because path provided was not a JSON file.');
  }
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Unable to instantiate base CRA Config because "${packageJsonPath}" does not exist.`);
  }

  // Blank out this variable, which is now being set by Rocket.
  // See this ticket as to why: https://github.com/facebook/create-react-app/issues/3657
  // (there are numerous tickets explaining this undocumented feature of CRA - https://github.com/facebook/create-react-app/issues/7344)
  process.env.CI = '';

  // eslint-disable-next-line global-require,import/no-dynamic-require
  const { name, version } = require(packageJsonPath);
  const now = new Date().toISOString();
  const appName = name.split('/')[1] || name;

  const env = {
    APP_NAME: `"${appName}"`,
    APP_VERSION: `"${version}"`,
    BUILD_BRANCH: `"${process.env.BRANCH || process.env.CARSON_NETFLIX_BUILD_BRANCH || ''}"`,
    BUILD_SHA: `"${process.env.SHA || ''}"`,
    BUILD_TIME: `"${now}"`,
    BUILD_URL: `"${process.env.BUILD_URL || ''}"`,
    // Allow an app to override any of these incoming values
    ...additionalEnvVars,
  };

  console.info(chalk.yellow(`Using ${appName} config for:`));

  console.info(chalk.blue('Config used is:'));
  console.info(chalk.blue(JSON.stringify(env, null, 2)));

  // const additionalPluginOverrides = additionalWebpackPlugins.map(p => addWebpackPlugin(p));
  return (config, nodeEnv, ...rest) => {
    const definePlugin = new webpack.DefinePlugin({
      process: {
        env,
      },
    });
    config.plugins.push(definePlugin);
    additionalWebpackPlugins.forEach(plugin => config.plugins.push(plugin));

    const resolutionPaths = transpilePaths.concat(additionalTranspilePaths);
    const oneOfRule = config.module.rules.find(r => 'oneOf' in r);

    // Grab the first babel rule, as it's the one we want
    const firstBabelRule = oneOfRule.oneOf.find(rule => rule.loader.includes('babel-loader'));
    resolutionPaths.forEach(rp => {
      if (!Array.isArray(firstBabelRule.include)) firstBabelRule.include = [firstBabelRule.include];
      firstBabelRule.include.push(rp);
    });

    return config;
  };
};
