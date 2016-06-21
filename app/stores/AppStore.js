import ImmutableStore from 'alt-utils/lib/ImmutableUtil';
import { List }       from 'immutable';

import AltInstance    from '../lib/AltInstance';
import Actions        from '../actions/AppActions';

class AppStore {
  constructor() {
    let {setGridData} = Actions;

    this.bindListeners({
      setGridData: setGridData
    });
    this.state = [];
    // temporary
    this.state.push({
      name: 'Javi Jimenez', inLdap: true, inMongo: false
    });
    this.state.push({
      name: 'Dmytro Trifonov', inLdap: true, inMongo: true
    });
  }

  setGridData(data) {
    return this.setState(data);
  }
}

export default AltInstance.createStore(ImmutableStore(AppStore));