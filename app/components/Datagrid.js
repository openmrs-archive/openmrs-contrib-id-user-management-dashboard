import Table from 'react-toolbox/lib/table';
import React from 'react';

import Pager from './Pager';

class DataGrid extends React.Component {
  
  state = { selected: [], source: this.props.source, prevSelected: [] };

  handleChange = (row, key, value) => {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  };

  handleSelect = (selected) => {
    const prevSelected = this.state.selected;
    if (prevSelected.length && selected.length && selected[0] === prevSelected[0]) {
      selected = [];
    }
    this.setState({prevSelected});
    this.setState({selected});
  };

  render () {
    return (
      <div>
        <Table
          model={this.props.model}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          selectable
          multiSelectable
          selected={this.state.selected}
          source={this.state.source}
        />
        <Pager />
      </div>
    );
  }
}

export default DataGrid;