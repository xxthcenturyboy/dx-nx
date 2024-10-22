const {
  composePlugins,
  withNx,
  withReact
} = require('@nx/rspack');
const { DefinePlugin } = require('@rspack/core');
const path = require('path');

const APP_DIR = 'web';
const LIB_PREFIX = 'lib';
const SHARED_DIR = 'shared';
const VENDOR_PREFIX = 'vendor';

function getDevServer(config) {
  return config.mode === 'development'
  ? {
    ...config.devServer,
    host: '0.0.0.0',
    historyApiFallback: true
  }
  : undefined;
  // : {
  //   ...config.devServer,
  //   allowedHosts: [
  //     'dev.data.mira.umusic.com',
  //     'qa.data.mira.umusic.com',
  //     'uat.data.mira.umusic.com',
  //     'data.mira.umusic.com'
  //   ],
  //   compress: true,
  //   historyApiFallback: true,
  //   host: '0.0.0.0',
  //   port: 3000
  // };
}

function getEntry(config) {
  const entry = config.mode === 'development' ? {
    main: '/app/apps/mira-web-data-app/src/main.tsx',
  } : {
    main: '/app/apps/mira-web-data-app/src/main.tsx',
  }
  return entry;
}

function getOptimization(config) {
  if (config.mode === 'production') {
    return {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        cacheGroups: {
          libs: {
            test(module) {
              return module.resource
              && module.resource.includes(`${path.sep}libs${path.sep}`)
              && (
                module.resource.includes(`${path.sep}${APP_DIR}${path.sep}`)
                || module.resource.includes(`${path.sep}${SHARED_DIR}${path.sep}`)
              )
              && (
                !module.resource.includes(`${path.sep}libs${path.sep}config${path.sep}`)
                && !module.resource.includes(`${path.sep}libs${path.sep}data-access${path.sep}`)
                && !module.resource.includes(`${path.sep}libs${path.sep}logger${path.sep}`)
                && !module.resource.includes(`${path.sep}libs${path.sep}store${path.sep}`)
              );
            },
            name(module) {
              try {
                const packageName = module.context.match(
                  /[\\/]libs[\\/](.*?)([\\/]|$)/,
                )[1];

                // npm package names are URL-safe, but some servers don't like @symbols
                return `${LIB_PREFIX}.${packageName.replace('@', '')}`;
              } catch (err) {
                console.error(err);
              }
            },
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              try {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                )[1];

                // npm package names are URL-safe, but some servers don't like @symbols
                return `${VENDOR_PREFIX}.${packageName.replace('@', '')}`;
              } catch (err) {
                console.error(err);
              }
            },
          }
        }
      }
    };
  }

  return undefined;
}

function withCustomFactory (config, { options, context }) {
  const customConfig = {
    ...config,
    devServer: getDevServer(config),
    // entry: getEntry(config),
    optimization: getOptimization(config),
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.css$/,
          type: 'css'
        },
        {
          test: /error-boundary.component.tsx$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
              },
            },
          },
          type: 'javascript/auto',
        },
      ]
    },
    devtool: 'source-map',
    stats: 'errors-only' //'summary'
  };

  customConfig.plugins.push(new DefinePlugin({
    webAppEnvVars: {
      API_PORT: process.env.API_PORT,
      API_URL: process.env.API_URL,
      ENV: process.env.NODE_ENV,
      WEB_APP_PORT: process.env.WEB_APP_PORT,
      WEB_APP_URL: process.env.WEB_APP_URL
    }
  }));

  // console.log(config.plugins[customConfig.plugins.length - 1]);

  return customConfig;
}

module.exports = composePlugins(
  withNx(),
  withReact(),
  withCustomFactory
);
