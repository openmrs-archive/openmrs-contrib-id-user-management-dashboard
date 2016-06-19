import ImmutableStore from 'alt/utils/ImmutableUtil';
import { List }       from 'immutable';

import AltInstance    from 'lib/AltInstance';
import Actions        from 'actions/AppActions';

class AppStore {
  constructor() {
    let {addGridData} = Actions;

    this.bindListeners({
      addGridData: addGridData
    });
    this.state = List();
  }

  addGridData(data) {
    return this.setState(data);
  }
}

export default AltInstance.createStore(ImmutableStore(AppStore));