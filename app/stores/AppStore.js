import ImmutableStore from 'alt-utils/lib/ImmutableUtil';
import { List }       from 'immutable';
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
      key: '',
      allColumns: [],
      filteredItems: [],
      selectedColumns: []
    };
    // temporary
    this.state.allItems.push({
      name: 'Javi Jimenez', inLdap: true, inMongo: false
    });
    this.state.allItems.push({
      name: 'Dmytro Trifonov', inLdap: true, inMongo: true
    });
    this.enableFilters();
  }
  
  enableFilters() {
    this.state.filteredItems = this.state.allItems;
  }

  setGridData(allItems) {
    return this.setState({allItems});
  }
  setFilter(filters) {
    return this.setState({filters});
  }
  setQuery(key) {
    return this.setState({key});
  }
  setColumns(selectedColumns) {
    return this.setState({selectedColumns});
  }
}

export default AltInstance.createStore(ImmutableStore(AppStore));