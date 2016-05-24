'use strict';

var express = require('express'),
    dashboard = express();

exports = module.exports = function(app) {
  require('./lib/app')(dashboard);
  // mount user dashboard on '/dashboard' route
  app.use('/dashboard', dashboard);
};