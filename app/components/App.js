import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Header from './Header';
import DataGrid from './DataGrid';
import SearchBox from './SearchBox';
import ComboBox from './ComboBox';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

/*
 * Static data (demo)
 */
const filter = ['LDAP', 'Mongo'];
const groups = ['User', 'Admin', 'Other Group'];

const statFilter = 'Show: All';
const statGroups = 'Groups: User, Admin';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = AppStore.getState();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    AppStore.listen(this.onStoreChange);
  }

  componentWillUnmount() {
    AppStore.unlisten(this.onStoreChange);
  }

  onStoreChange(state) {
    console.log('trace: onStoreChange: ', state);
    this.setState(state);
  }

  onSearchBoxChange(key, value) {
    return AppActions.setQuery(value);
  }
  
  render() {
    return (
      <div>
        <Header />
        <Grid>
          <Row>
            <Col md={12}>
              <SearchBox label={'Filter...'} onChange={this.onSearchBoxChange}/>
            </Col>
          </Row>
          <Row>
            <Col md style={{marginTop: '20px'}}>
              <ComboBox label={statFilter}
                        source={filter}
                        dialogLabel={'Choose types to filter'}
                        dialogTitle={'Filter data'}/>
            </Col>
            <Col md style={{marginTop: '20px'}}>
              <ComboBox label={'Display: '}
                        value={this.state.columns}
                        source={this.state.allColumns}
                        dialogLabel={'Choose columns to display'}
                        dialogTitle={'Display selected columns'}/>
            </Col>
            <Col md style={{marginTop: '20px'}}>
              <ComboBox label={statGroups}
                        source={groups}
                        dialogLabel={'Set groups'}
                        dialogTitle={'LDAP groups user belongs to'}/>
            </Col>
          </Row>
          <DataGrid model={this.state.userModel} source={this.state.filteredItems} allGroups={this.state.allGroups}/>
        </Grid>
      </div>
    )
  }
}

export default App;