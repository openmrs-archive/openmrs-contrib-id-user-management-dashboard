import Immutable   from 'immutable';
import AltInstance from '../lib/AltInstance';

class AppActions {
  addGridData(data) {
    this.dispatch(Immutable.fromJS(data));
  }
}

export default AltInstance.createActions(AppActions);