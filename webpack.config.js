const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

function getExternals() {
  return fs.readdirSync('node_modules')
    .concat(['react-dom/server'])
    .filter(mod => mod !== '.bin')
    .reduce((externals, mod) => {
      externals[mod] = `commonjs ${mod}`;
      return externals;
    }, {});
}

module.exports = [
  {
  
    entry: {
      index: './source/client/index.js',
    },
    
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].js',
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
    
    plugins: NODE_ENV === 'production'
      ? [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
        new ExtractTextPlugin('[name].css'),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: { discardComments: { removeAll: true } },
        }),
        new UglifyJSPlugin({
          sourceMap: false,
          output: {
            comments: false,
          },
        }),
      ]
      : [
        new ExtractTextPlugin('[name].css'),
      ],
    
  },
  {
  
    entry: {
      index: './source/views/index.src.js',
    },
    
    target: 'node',
  
    externals: getExternals(),
  
    output: {
      path: path.join(__dirname, 'source/views'),
      filename: '[name].js',
      libraryTarget: 'umd',
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
    
    plugins: NODE_ENV === 'production'
      ? [
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
      ]
      : [
        //
      ],
    
  },
];
