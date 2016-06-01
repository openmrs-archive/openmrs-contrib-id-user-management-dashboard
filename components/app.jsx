import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {green100, green500, green700} from 'material-ui/styles/colors';
import DataGrid from './datagrid.jsx';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: green100
  }
}, {
  avatar: {
    borderColor: null
  },
  userAgent: 'all'
});

const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <DataGrid />
  </MuiThemeProvider>
);

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('app'));