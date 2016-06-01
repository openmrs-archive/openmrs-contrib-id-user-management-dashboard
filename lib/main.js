//require('babel-register')({
//  presets: ['react', 'es2015']
//});

//var React = require('react')
  var path = require('path')
  , express = require('express');
  //, ReactDOM = require('react-dom/server')
  //, appComponent = require('../components/app.jsx').default;

//var App = React.createFactory(appComponent);

module.exports = function(app) {
  app.engine('pug', require('pug').__express);
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../views'));

  app.use(express.static(path.join(__dirname, '../public')));

  app.get('/', function(req, res){
    res.render('index');
  });
};