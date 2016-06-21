import Immutable   from 'immutable';
import AltInstance from '../lib/AltInstance';

class AppActions {
  setGridData(data) {
    this.dispatch(Immutable.fromJS(data));
  }
  setFilter(filter) {
    this.dispatch(Immutable.fromJS(filter));
  }
  setColumns(columns) {
    this.dispatch(Immutable.fromJS(columns));
  }
}

export default AltInstance.createActions(AppActions);