import AltInstance from '../lib/AltInstance';

class AppActions {
  setGridData(data) {
    return {data};
  }
  setQuery(name, value) {
    return value;
  }
  setFilter(filter) {
    return {filter}
  }
  setColumns(columns) {
    return {columns};
  }
}

export default AltInstance.createActions(AppActions);