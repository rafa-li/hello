var webpack = require('webpack')
var fs = require("fs")

function walk(dir) {
    var children = []
    fs.readdirSync(dir).forEach(function(filename){
        var path = dir+"/"+filename
        var stat = fs.statSync(path)
        if (stat && stat.isDirectory()) {
            children = children.concat(walk(path))
        }
        else {
            children.push(path)
        }
    })
    return children
}


module.exports = {
  entry: './mvc/index.js',
  output: {
    path: './public',
    publicPath: '/pub/',
    filename: 'build.js'
  },
  module: {
    // avoid webpack trying to shim process
    noParse: /es6-promise\.js$/,
    loaders: [
      {
        test: /\.vue$/,
        loader: __dirname+'/vue-loader/loader.js',
        include: walk(__dirname+"/mvc"),
        query: {
            "mvc-dir": __dirname+"/mvc"
            , "rest-dir": __dirname+"/rest"
        }
      },
      {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel'
      },
    //   {
    //     test: /\.vue$/,
    //     loader: 'noesmodule-vue/remove-usestrict.js'
    //   }
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  plugins: [new NoStrictPlugin]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
} else {
  module.exports.devtool = '#source-map'
}



function NoStrictPlugin() {
}
NoStrictPlugin.prototype.apply = function(compiler) {
	compiler.plugin("compilation", function(compilation) {
		compilation.plugin("succeed-module", function(module) {
            if(module._source)
                module._source._value = module._source._value.replace(/["']use strict["']/,'" no strict"')
		});
	});
};
