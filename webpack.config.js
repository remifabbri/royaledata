var webpack = require('webpack');
var path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const dev = process.env.NODE_ENV === "dev"

let cssLoaders = [
    'style-loader',
	{ 
		//Permet de de faire commprendre a webpack comment travailler avec le css
		// et de pouvoir utiliser les @import et les url se trouvant dans le css
		loader: 'css-loader', options: { importLoaders: 1, minimize: !dev } 
	},
]

if (!dev) {
	cssLoaders.push({
		loader: 'postcss-loader', //Permet de faire du post-traitement avant la publication du css
		options: {
			plugins: (loader) => [
	      		require('autoprefixer')({ //Ajoute les préfixs pour améliorer la compatibliité aves les navigateurs plus anciens
	      			browsers: ['last 2 versions', 'ie > 8']
	      		}),
			]
		}
	})
}


let config = {

  //mode: 'development',

  entry: {
    //bundleBackend: ['./public/scss/appBackend.scss', './public/js/appBackend.js'],
    bundleFrontend: ['./public/scss/appFrontend.scss', './public/js/appFrontend.js']
  }, 

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/dist"
  },

  watch: dev, 
  devtool: dev ? "cheap-module-eval-source-map" : false,
  
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: { presets: ["es2015"] }
        }
      },
      {
        test:/\.css$/,
        use: cssLoaders	
      },

      {
        test:/\.scss$/,
        use: [...cssLoaders, 'sass-loader'] //charge les fichiers scss et les compile en css			
      },
    ]
  }
};

if (!dev){
    config.plugins.push(new UglifyJSPlugin({
        sourceMap: true
    }))
}

module.exports = config