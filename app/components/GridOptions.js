import React from 'react';
import {IconButton} from 'react-toolbox/lib/button';

import AppActions from '../actions/AppActions';

class GridOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: props.filters
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({filters: newProps.filters})
  }

  handleClearFilter() {
    AppActions.setFilters([]);
  };

  render() {
    let filters = this.state.filters || [];
    let filterText = !filters.length ? 'None' : filters.join(',');
    let clear = filters.length ?
      <IconButton icon='clear' onClick={this.handleClearFilter} style={{marginTop: '-7px', marginLeft: '-5px', paddingBottom: '5px'}}/> : '';
    return <div>
      Filter: <b>{filterText}</b> {clear}
    </div>
  }
}

export default GridOptions;