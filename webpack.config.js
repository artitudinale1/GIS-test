var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: './src/app.js',
    output: {
      path: __dirname + "/docs/",
      filename: 'app.bundle.js'
    },

    devServer: {
      contentBase: "./src",
      hot: true
    },

    module:{
      rules:[

        {test:/\.scss$/,
        use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ['css-loader', 'sass-loader'],
                publicPath: "/docs/"
          })
        }
      ],
    },
      plugins: [
        new HtmlWebpackPlugin({
            title: 'GIS test',
            minify:{
              collapseWhitespace: true
            },
            hash: true,
            template: './src/index.html',
          }),

        new ExtractTextPlugin({
            filename: "app.css",
            disable: false,
            allChunks: true
          }),

        new CopyWebpackPlugin([
              { from: 'src' }
          ])
      ]
}
