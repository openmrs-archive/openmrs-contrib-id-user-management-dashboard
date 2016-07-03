import 'react-toolbox/lib/commons.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route } from 'react-router';
import App from './components/App.js';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/user-dashboard" component={App}>
    </Route>
  </Router>
), document.getElementById('app'));
