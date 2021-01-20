const commonConfig = require('./webpack.common');

module.exports = {
  ...commonConfig,
  mode: 'development',
  devServer: {
    compress: true,
    hot: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  devtool: 'eval-source-map',
};
