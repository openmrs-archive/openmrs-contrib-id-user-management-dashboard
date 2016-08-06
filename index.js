'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');

const compiler = webpack(config);

module.exports = function(app) {
  
  var router = express.Router();
  
  require('./app/lib/Api')(router);
  
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
  
  // mount user dashboard
  app.use('/admin/user-dashboard/api', router);

  // add a link to the admin page
  app.admin.addPage('Data Management', '/user-dashboard');
};
