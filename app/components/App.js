import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import connectToStores from 'alt-utils/lib/connectToStores';
import Header from './Header';
import DataGrid from './Datagrid';
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
  inMongo: {type: Boolean},
  inLDAP: {type: Boolean}
};

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  static getStores() {
    return [AppStore];
  }

  static getPropsFromStores() {
    return AppStore.getState();
  }
  
  render() {
    return (
      <div>
        <Header />
        <Grid>
          <Row>
            <Col md={12}>
              <SearchBox label={'Filter...'} onChange={AppActions.setQuery}/>
            </Col>
          </Row>
          <Row>
            <Col md={4} style={{marginTop: '20px'}}>
              <ComboBox label={statFilter}
                        source={filter}
                        dialogLabel={'Choose types to filter'}
                        dialogTitle={'Filter data'}/>
            </Col>
            <Col md={4} style={{marginTop: '20px'}}>
              <ComboBox label={statDisplay}
                        source={display}
                        dialogLabel={'Choose columns to display'}
                        dialogTitle={'Display selected columns'}/>
            </Col>
            <Col md={4} style={{marginTop: '20px'}}>
              <ComboBox label={statGroups}
                        source={groups}
                        dialogLabel={'Set groups'}
                        dialogTitle={'LDAP groups user belongs to'}/>
            </Col>
          </Row>
          <DataGrid model={UserModel} source={this.props.filteredItems}/>
        </Grid>
      </div>
    )
  }
}

export default connectToStores(App);