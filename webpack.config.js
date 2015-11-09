var fs = require('fs')
var webpack = require('webpack')

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var cssLoader = ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')

var contentBase = __dirname + '/public'

var stylesheets = fs.readdirSync('./css')
  .filter(function(name) {
    return /\.css$/.test(name)
  })
  .map(function(name) {
    return './css/' + name
  })

var options = {
  entry: {
    app: ['./app.js'].concat(stylesheets),
    vendor: ['vue', 'vue-router'],
  },

  output: {
    path: contentBase + '/assets',
    filename: 'app.js',
    contentBase: contentBase,
  },

  module: {
    loaders: [
      {test: /\.vue$/, loader: 'vue'},
      {test: /\.css$/, loader: cssLoader},
    ]
  },

  plugins: [
      new ExtractTextPlugin('app.css', {disable: false}),
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
  ],

  vue: {
    loaders: {
      css: cssLoader,
    }
  },

  postcss: function (pack) {
    // use webpack context
    return [
      require('postcss-import')({addDependencyTo: pack}),
      require('postcss-custom-properties')({variables: require('./variables')}),
      require('autoprefixer'),
    ]
  },

  devtool: 'source-map',
}

if (process.env.NODE_ENV === 'production') {
  options.entry = ['./index.js'].concat(stylesheets)
  options.output = {
    path: './build',
    filename: 'vui.js',
    library: 'vui',
    libraryTarget: 'umd',
  }
}

module.exports = options
