'use strict';

var express = require('express'),
  app = express();

require('./lib/main')(app);
app.listen(3000, () => {
  console.log('App started..');
});
  