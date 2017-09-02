module.exports = {
  entry: "./public/javascripts/app.js",
  output: {
      path: __dirname + "/public",
      filename: "bundle.js"
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                  loader: 'babel-loader',
                  options: {
                      presets: ['react']
                  }
              }
          }
      ]
  },
  watch: true
}