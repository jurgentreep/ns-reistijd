const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new MomentLocalesPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};