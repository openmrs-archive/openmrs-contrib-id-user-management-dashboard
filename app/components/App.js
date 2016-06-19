import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Header from './Header';
import DataGrid from './Datagrid';
import SearchBox from './SearchBox';
import ComboBox from './ComboBox';

/*
 * Static data (demo)
 */
const display = ['Id', 'First Name', 'Last Name', 'inLDAP', 'inMongo'];
const filter = ['LDAP', 'Mongo'];
const groups = ['User', 'Admin', 'Other Group'];

const statDisplay = 'Display: Id, inLDAP, inMongo';
const statFilter = 'Filter: All';
const statGroups = 'Groups: User, Admin';

const UserModel = {
  name: {type: String},
  inMongo: {type: Boolean},
  inLDAP: {type: Boolean}
};

const users = [
  {name: 'Javi Jimenez', inLdap: true, inMongo: false},
  {name: 'Dmytro Trifonov', inLdap: true, inMongo: true}
];

const App = () => (
  <div>
    <Header />
    <Grid>
      <Row>
        <Col md={12}>
          <SearchBox label={'Search...'}/>
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
      <DataGrid model={UserModel} source={users}/>
    </Grid>
  </div>
);

export default App;