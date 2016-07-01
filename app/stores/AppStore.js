import _ from 'lodash';

import AltInstance    from '../lib/AltInstance';
import Actions        from '../actions/AppActions';

class AppStore {
  constructor() {
    let {setGridData, setFilters, setQuery, setColumns} = Actions;

    this.bindListeners({
      setGridData: setGridData,
      setFilters: setFilters,
      setQuery: setQuery,
      setColumns: setColumns
    });

    this.applyFilters = this.applyFilters.bind(this);

    this.state = {
      allItems: [],
      filteredItems: [],
      allColumns: {
        id: 'ID',
        firstName: 'First Name',
        lastName: 'Last Name',
        inLDAP: 'LDAP',
        inMongo: 'Mongo'
      },
      columns: ['id', 'lastName', 'inLDAP'],
      allFilters: {
        inLDAP: 'In LDAP',
        inMongo: 'In Mongo'
      },
      filters: [],
      query: '',
      allGroups: ['admin', 'user', 'writer'],
      userModel: {},
      defaultModel: {
        firstName: {type: String},
        lastName: {type: String},
        id: {type: String},
        inMongo: {type: String},
        inLDAP: {type: String},
        groups: {type: [String]}
      }
    };
    // temporary data
    this.state.allItems.push({
      id: '124124', firstName: 'Javi', lastName: 'Jimenez', inLDAP: 'Yes', inMongo: 'No', groups: ['user']
    });
    this.state.allItems.push({
      id: '234234', firstName: 'Mark', lastName: 'Simons', inLDAP: 'Yes', inMongo: 'Yes', groups: ['user']
    });
    this.state.allItems.push({
      id: '124124124', firstName: 'David', lastName: 'de Hea', inLDAP: 'No', inMongo: 'Yes', groups: ['user', 'admin']
    });
    this.state.allItems.push({
      id: '12312', firstName: 'Andriy', lastName: 'Shevchenko', inLDAP: 'Yes', inMongo: 'Yes', groups: ['user']
    });
    this.applyFilters(true);
  }
  
  applyFilters(init) {
    let that = this;
    // temporary (demo only)
    let filteredFirstItems = _.filter(this.state.allItems, (item) => {
      var query = item.firstName.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1
          || item.lastName.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1;
      if (query) {
        var state = true;
        _.each(that.state.filters, (el) => {
          console.log('el: ', el)
          state && (state = 'Yes' === item[el]);
        });
        return state;
      }
      return false;
    });
    let filteredItems = _.map(filteredFirstItems, (item) => {
      let obj = {};
      for (var key in item) {
        if (key && that.state.columns.indexOf(key) !== -1) {
          obj[key] = item[key];
        }
      }
      return obj;
    });
    // apply user model
    let userModel = {};
    _.each(this.state.columns, (column) => {
      userModel[column] = that.state.defaultModel[column];
    });
    if (!init) {
      this.setState({filteredItems, userModel});
    }
    else {
      this.state.filteredItems = filteredItems;
      this.state.userModel = userModel;
    }
  }

  setGridData(allItems) {
    return this.setState({allItems});
  }
  setFilters(filters) {
    this.setState({filters});
    this.applyFilters();
  }
  setQuery(query) {
    this.setState({query});
    this.applyFilters();
  }
  setColumns(columns) {
    this.setState({columns});
    this.applyFilters();
    
  }
}

export default AltInstance.createStore(AppStore, 'AppStore');