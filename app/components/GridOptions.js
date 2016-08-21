import React from 'react';
import {IconButton} from 'react-toolbox/lib/button';

import AppActions from '../actions/AppActions';

class GridOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: props.filters,
      sorters: props.sorters
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({filters: newProps.filters, sorters: newProps.sorters});
  }

  handleClearFilter() {
    AppActions.setFilters([]);
  };

  handleClearSort() {
    AppActions.setSort([]);
  }

  render() {
    let filters = this.state.filters || [];
    let sorters = this.state.sorters || [];
    let filterText = !filters.length ? 'None' : filters.join(', ');
    let sortText = !sorters.length ? 'None' : sorters.join(', ');
    let clearFilter = filters.length ?
      <IconButton icon='clear' onClick={this.handleClearFilter} style={{marginTop: '-7px', marginLeft: '-5px', paddingBottom: '5px'}}/> : '';
    let clearSort = sorters.length ?
      <IconButton icon='clear' onClick={this.handleClearSort} style={{marginTop: '-7px', marginLeft: '-5px', paddingBottom: '5px'}}/> : '';
    return <div>
      Filter: <b>{filterText}</b> {clearFilter}
      Sort By: <b>{sortText}</b> {clearSort}
    </div>
  }
}

export default GridOptions;