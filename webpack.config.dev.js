const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolveTsconfigPathsToAlias } = require('./webpack.utils.js');
const Dotenv = require('dotenv-webpack');

const directory = fs.realpathSync(process.cwd());
const resolve = (relativePath) => path.resolve(directory, relativePath);

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  entry: {
    'js': [
      require.resolve('react-hot-loader/patch'),
      resolve('src/index.tsx')
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      ...resolveTsconfigPathsToAlias(),
      'react-dom': '@hot-loader/react-dom'
    },
  },
  output: {
    pathinfo: true,
    filename: '[name]/bundle.js',
    path: resolve('build'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
          plugins: ['react-hot-loader/babel']
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|png)$/,
        use: ['file-loader']
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: resolve('./src/index.html'),
      chunks: ['js']
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'build'),
      }]
    }),
    new Dotenv({
      path: './.env.local',
      systemvars: true
    })
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000'
      }
    },
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    allowedHosts: 'all',
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "build"),
      watch: true
    }
  }
};
