import Table from 'react-toolbox/lib/table';
import React from 'react';

import Pager from './Pager';

class DataGrid extends React.Component {
  
  state = { selected: [], source: this.props.source };

  handleChange = (row, key, value) => {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  };

  handleSelect = (selected) => {
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