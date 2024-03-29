const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../../build/server/dist'),
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: '../../public' },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        build: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
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
        loader: '@svgr/webpack',
        test: /\.svg$/,
      },
      {
        type: 'asset/resource',
        exclude: /\.(js|jsx|ts|tsx|css|html|svg)$/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
