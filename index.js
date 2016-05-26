'use strict';

var express = require('express'),
    dashboard = express();

exports = module.exports = function(app) {
  require('./lib/main')(dashboard);
  // mount user dashboard on '/dashboard' route
  app.use('/dashboard', dashboard);
};