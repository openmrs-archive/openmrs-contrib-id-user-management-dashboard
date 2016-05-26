import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import DataGrid from './datagrid';
import Search from './search';

injectTapEventPlugin();

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <h2>Total: 5</h2>
          <Search/>
          <DataGrid/>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App;