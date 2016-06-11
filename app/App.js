import React from 'react';
const {Grid, Row, Col} = require('react-flexbox-grid');
import Header from './Header';
import DataGrid from './Datagrid';
import SearchBox from './SearchBox';
import ComboBox from './ComboBox';

/*
 * Static data (demo)
 */
const display = ['Id', 'First Name', 'Last Name', 'inLDAP', 'inMongo'];
const filter = ['LDAP', 'Mongo'];

const statDisplay = 'Display: Id, inLDAP, inMongo';
const statFilter = 'Filter: All';

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
        <Col md={6}>
          <SearchBox label={'Search...'}/>
        </Col>
        <Col md={3} style={{marginTop: '20px'}}>
          <ComboBox label={statFilter} 
                    source={filter} 
                    dialogLabel={'Choose types to filter'}
                    dialogTitle={'Filter data'}/>
        </Col>
        <Col md={3} style={{marginTop: '20px'}}>
          <ComboBox label={statDisplay} 
                    source={display}
                    dialogLabel={'Choose columns to display'}
                    dialogTitle={'Display selected columns'}/>
        </Col>  
      </Row>
      <DataGrid model={UserModel} source={users}/>
    </Grid>
  </div>
);

export default App;