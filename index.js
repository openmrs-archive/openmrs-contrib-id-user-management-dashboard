'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');

const compiler = webpack(config);

module.exports = function(app) {
  require('./app/lib/Api')(app);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.get('/user-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, './app/index.html'));
  });

  // add a link to the admin page
  app.admin.addPage('Data Management', '/user-dashboard');
};
