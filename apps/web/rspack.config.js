const {
  composePlugins,
  withNx,
  withReact
} = require('@nx/rspack');
// const { DefinePlugin, EnvironmentPlugin } = require('@rspack/core');
// const { DotenvPlugin } = require('rspack-plugin-dotenv');

module.exports = composePlugins(withNx(), withReact(), (config) => {
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
  // config.plugins.push(new DefinePlugin(defines));
  // config.plugins.push(new EnvironmentPlugin(process.env));
  // console.log(config.plugins[config.plugins.length - 1]);
  return config;
});
