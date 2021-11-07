
const merge = require('webpack-merge');
const devEnv = require('./dev.env');

module.exports = merge(devEnv, {
  mode: 'testing',
  watch: true,
});
