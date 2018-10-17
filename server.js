/* eslint-disable no-console,global-require,import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');

const PORT = 3001;
const DIST_DIR = path.join(__dirname, 'public');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.dev');

  console.log('Compiling bundle... 👷🏽');
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: '/assets/scripts/',
      stats: {
        colors: true,
      },
    }),
  );

  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(DIST_DIR));

const server = app.listen(PORT, err => {
  if (err) {
    console.log(err);
  }

  console.log(`Listening at http://localhost:${PORT} 👂`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server');
  if (server) {
    server.close(err => {
      if (err) {
        console.log('Failed to shut down server');
        process.exit(1);
      }

      console.log('Shut down server');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
