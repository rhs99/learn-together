const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  config.resolve.fallback = {
    fs: false
  };
  config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
  config.plugins.push(new NodePolyfillPlugin())
  return config
}
