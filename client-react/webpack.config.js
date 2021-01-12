const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
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
        exclude: /\.(js|jsx|ts|tsx|css)$/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
