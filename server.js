'use strict';

const express = require('express');
const app = express();

require('./index')(app);

app.listen(process.env.PORT || 3000, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://0.0.0.0:3000');
});
