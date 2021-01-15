const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        options: {
          projectReferences: true,
          transpileOnly: true,
        },
      },
      {
        loader: 'babel-loader',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/,
      },
      {
        type: 'asset/resource',
        exclude: /\.(js|jsx|ts|tsx|css|html)$/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
