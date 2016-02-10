module.exports = {
  entry: './ping-chart.js',
  output: {
    path: 'dist',
    filename: 'ping-chart.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  }
};