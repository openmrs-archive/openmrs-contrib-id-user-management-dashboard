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
        firstName: 'First Name',
        lastName: 'Last Name',
        id: 'ID',
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
        inLDAP: {type: String}
      }
    };
    // temporary data
    this.state.allItems.push({
      name: 'Javi Jimenez', inLDAP: 'Yes', inMongo: 'No'
    });
    this.state.allItems.push({
      name: 'Mark Simons', inLDAP: 'Yes', inMongo: 'Yes'
    });
    this.state.allItems.push({
      name: 'David de Hea', inLDAP: 'No', inMongo: 'Yes'
    });
    this.state.allItems.push({
      name: 'Andriy Shevchenko', inLDAP: 'Yes', inMongo: 'Yes'
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