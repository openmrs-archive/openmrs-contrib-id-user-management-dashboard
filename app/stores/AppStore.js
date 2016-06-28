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
      filters: ['inDLAP', 'inMongo'],
      query: '',
      allColumns: [],
      filteredItems: [],
      groups: ['admin', 'user', 'writer'],
      selectedColumns: []
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
    var filteredItems = _.filter(this.state.allItems, function(item) {
      return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    this.setState({query, filteredItems});
  }
  setColumns(selectedColumns) {
    return this.setState({selectedColumns});
  }
}

export default AltInstance.createStore(AppStore, 'AppStore');