const commonConfig = require('./webpack.common');

module.exports = {
  ...commonConfig,
  mode: 'development',
  devServer: {
    compress: true,
    hot: true,
    proxy: {
      '/': 'http://localhost:3000',
    },
  },
  devtool: 'eval-source-map',
};
