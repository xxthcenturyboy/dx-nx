const {
  composePlugins,
  withNx,
  withReact
} = require('@nx/rspack');
const { DefinePlugin } = require('@rspack/core');
// const path = require('path');
// const ROOT = path.resolve(__dirname, '../../');

function withCustomFactory(config, { options, context }) {
  // console.log(options);
  // console.log(context);
  const customConfig = {
    ...config,
    devServer: {
      ...config.devServer,
      historyApiFallback: true,
      // allowedHosts: 'all'
      // allowedHosts: [process.env.WEB_APP_URL]
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.css$/,
          type: 'css'
        }
      ]
    }
  };

  // console.log(customConfig);
  // console.log(config.module.rules);
  // const ROOT = path.resolve(__dirname, '../../');
  // console.log(ROOT, __dirname);
  // console.log(process.env);
  // const keys = [];
  // const defines = {}
  // Object.keys(process.env).forEach(function (key) {
  //   defines['process.env.' + key] = JSON.stringify(process.env[key])
  //   if(!key.startsWith("NX_")) {
  //     keys.push(key);
  //     defines['process.env.' + key] = JSON.stringify(process.env[key])
  //   }
  // });
  // console.log(keys);
  // customConfig.plugins.push(new DotenvPlugin());
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
