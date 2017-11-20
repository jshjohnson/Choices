const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.dev');
const opn = require('opn');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  quiet: true, // lets WebpackDashboard do its thing
}).listen(3001, 'localhost', (err) => {
  if (err) console.log(err);
  opn('http://localhost:3001');
  console.log('Listening at localhost:3001');
});
