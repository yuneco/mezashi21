module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.glsl$/i,
          use: 'raw-loader'
        }
      ]
    }
  }
}
