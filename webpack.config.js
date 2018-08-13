
const path = require('path') // path: module node.js permetant de résoudre les chemin absolut. 
const UglifyJSPlugin = require('uglifyjs-webpack-plugin') // Minify le JavaScript
const ExtractTextPlugin = require("extract-text-webpack-plugin") //Permet d'extraire le css dans des fichiers séparer
const ManifestPlugin = require('webpack-manifest-plugin') //permet de crer un fichier json qui contient la liste des fichiers généré
const CleanWebpackPlugin = require('clean-webpack-plugin') //permet de supprimer les fichier obsoletes avant la génération d'un nouveau build

// variable d'environnement defini dans package.json
// pour adapter la compilation dev/prod
const dev = process.env.NODE_ENV === "dev"

let cssLoaders = [
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

  //definition des points d'entrés 
  entry: {
    //bundleBackend: ['./public/scss/appBackend.scss', './public/js/appBackend.js'],
    bundleFrontend: ['./public/scss/appFrontend.scss', './public/js/appFrontend.js']
  },


  watch: dev, // ajoute le paramettre watch pour le dev

  //Définition des points de de sortie
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: dev ? '[name].js' : '[name][chunkhash:8].js',
    //path Devellopement : Production
    publicPath: dev ? './dist/' : './'

  },

  resolve: {
    alias: {
      '@scss': path.resolve('./public/scss/'),
      '@js': path.resolve('./public/js/'),
      '@images': path.resolve('./public/images/'),
      '@fonts': path.resolve('./public/fonts/')
    }
  },

  // Permet de générer une sourceMap, c'est grâce à lui, que l'on peut retrouver    
  // la ligne du fichier source qui contient l'erreur.
  // lien des différents paramètres possible
  // https://webpack.js.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
  devtool: dev ? "cheap-module-eval-source-map" : false,

  module: {
    rules: [
      
      {
        //Babel est un module qui permetant d'assurer la compatibilité du JavaScript pour les navigateur plus ancien.
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader", //injecte le css dans le DOM
          use: cssLoaders //
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader", //injecte le css dans le DOM
          use: [...cssLoaders, 'sass-loader'] //charge les fichiers scss et les compile en css
        })
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader', //permet de charger les fichiers
            options: {
              name: '[name].[hash:7].[ext]'
            }
          },
          {
            loader: 'img-loader', //optimise le poid des images
            options: {
              enabled: !dev
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader', //Charge les fichiers sous forme d'url codée en base64 
            options: {
              limit: 8192, //
              name: '[name].[hash:7].[ext]'
            }
          },
          {
            loader: 'img-loader', //optimise le poid des images
            options: {
              enabled: !dev
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader', //permet de charger les fichiers
            options: {
              name: '[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(wav)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader', //permet de charger les fichiers
            options: {
              name: '[name].[hash:7].[ext]'
            }
          }
        ]
      }
    ]
  },


  plugins: [
    new ExtractTextPlugin({
      filename: dev ? '[name].css' : '[name][contenthash:8].css',
      disable: dev
    }),
  ]
}

if (!dev) {
  config.plugins.push(new UglifyJSPlugin({
    sourceMap: false
  }))
  config.plugins.push(new ManifestPlugin())
}

config.plugins.push(new CleanWebpackPlugin(['themes/courant'], {
  root: path.resolve('./'),
  exclude: ['persistant'], //dossier fichier a exclure de la suppresion
  verbose: true,
  dry: false, //true pour faire un test a sec / false mode réel 
}))

module.exports = config
