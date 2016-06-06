import Input from 'react-toolbox/lib/input';
import Table from 'react-toolbox/lib/table';
import React from 'react';

const UserModel = {
  name: {type: String},
  inMongo: {type: Boolean},
  inLDAP: {type: Boolean}
};

const users = [
  {name: 'Javi Jimenez', inLdap: true, inMongo: false},
  {name: 'Dmytro Trifonov', inLdap: true, inMongo: true}
];

class TableWIdget extends React.Component {
  
  state = { selected: [], source: users };

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
      <Table
        model={UserModel}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        selectable
        multiSelectable
        selected={this.state.selected}
        source={this.state.source}
      />
    );
  }
}

const DataGrid = () => (
  <section>
    <Input type='text' label='Search' name='search' maxLength={16 } />
    <TableWIdget />
  </section>
);

export default DataGrid;