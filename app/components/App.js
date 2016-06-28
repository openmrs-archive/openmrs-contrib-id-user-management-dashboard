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
const display = ['Id', 'First Name', 'Last Name', 'inLDAP', 'inMongo'];
const filter = ['LDAP', 'Mongo'];
const groups = ['User', 'Admin', 'Other Group'];

const statDisplay = 'Display: Id, inLDAP, inMongo';
const statFilter = 'Show: All';
const statGroups = 'Groups: User, Admin';

const UserModel = {
  name: {type: String},
  inMongo: {type: String},
  inLDAP: {type: String}
};

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
              <ComboBox label={statDisplay}
                        source={display}
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
          <DataGrid model={UserModel} source={this.state.filteredItems} groups={this.state.groups}/>
        </Grid>
      </div>
    )
  }
}

export default App;