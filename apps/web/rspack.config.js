const {
  composePlugins,
  withNx,
  withReact
} = require('@nx/rspack');
const { DefinePlugin } = require('@rspack/core');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  config.devServer = {
    ...config.devServer,
    historyApiFallback: true,
    // static: ['a']
  };
  // console.log(config);
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
  // config.plugins.push(new DotenvPlugin());
  config.plugins.push(new DefinePlugin({
    webAppEnvVars: {
      API_PORT: process.env.API_PORT,
      API_URL: process.env.API_URL,
      ENV: process.env.NODE_ENV,
      WEB_APP_PORT: process.env.WEB_APP_PORT,
      WEB_APP_URL: process.env.WEB_APP_URL
    }
  }));
  // console.log(config.plugins[config.plugins.length - 1]);
  return config;
});
