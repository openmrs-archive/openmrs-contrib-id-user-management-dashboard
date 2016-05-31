import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {green100, green500, green700} from 'material-ui/styles/colors';
import DataGrid from './datagrid.jsx';
import Search from './search.jsx';

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

injectTapEventPlugin();

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <h2>Total: 5</h2>
          <Search />
          <DataGrid />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App;