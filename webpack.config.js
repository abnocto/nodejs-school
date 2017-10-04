const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const devPlugins = [
  new ExtractTextPlugin('styles.css'),
];

const prodPlugins = devPlugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new OptimizeCssAssetsPlugin({
    cssProcessorOptions: { discardComments: { removeAll: true } },
  }),
  new UglifyJSPlugin({
    sourceMap: false,
    output: {
      comments: false,
    },
  }),
]);

module.exports = {
  
  entry: './source/client/index.js',
  
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
    
    ],
    
  },
  
  plugins: NODE_ENV === 'production' ? prodPlugins : devPlugins,
  
};
