import _ from 'lodash';

import AltInstance    from '../lib/AltInstance';
import Actions        from '../actions/AppActions';

class AppStore {
  constructor() {
    let {setGridData, setFilter, setQuery, setColumns} = Actions;

    this.bindListeners({
      setGridData: setGridData,
      setFilter: setFilter,
      setQuery: setQuery,
      setColumns: setColumns
    });
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
      allFilters: ['inLDAP', 'inMongo'],
      filters: [],
      query: '',
      allGroups: ['admin', 'user', 'writer'],
      userModel: {
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
    this.state.filteredItems = this.state.allItems;
  }

  setGridData(allItems) {
    return this.setState({allItems});
  }
  setFilter(filters) {
    return this.setState({filters});
  }
  setQuery(query) {
    let filteredItems = _.filter(this.state.allItems, function(item) {
      return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    this.setState({query, filteredItems});
  }
  setColumns(columns) {
    let currentColumns = this.state.columns;
    let diffAdd = _.difference(columns, currentColumns);
    let diffRemove = _.difference(currentColumns, columns);
    if (diffAdd.length) {
      let filteredItems = _.map(this.state.filteredItems, function (item) {
        item[diffAdd[0]] = this.state.allItems[diffAdd[0]];
        return item;
      });
      return this.setState({columns, filteredItems});
    }
    else if (diffRemove.length) {
      let filteredItems = _.map(this.state.filteredItems, function (item) {
        item[diffRemove[0]] = undefined;
        return item;
      });
      return this.setState({columns, filteredItems});
    }
    return this.setState({columns});
  }
}

export default AltInstance.createStore(AppStore, 'AppStore');