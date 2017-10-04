const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const devPlugins = [];

const prodPlugins = devPlugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new UglifyJSPlugin({
    sourceMap: false,
    output: {
      comments: false,
    },
  }),
]);

module.exports = {
  
  entry: './source/client/ssr.js',
  
  target: 'node',
  
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.server.js',
    libraryTarget: 'commonjs',
  },

  module: {
    
    rules: [
  
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: NODE_ENV === 'production'
          ? ['babel-loader']
          : ['babel-loader', 'eslint-loader'],
      },
  
      {
        test: /\.css$/,
        use: [
          'ignore-loader',
        ],
      },
    
    ],
    
  },
  
  plugins: NODE_ENV === 'production' ? prodPlugins : devPlugins,

};
