import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

export default class Search extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: []
    };
  }

  handleUpdateInput(value) {
    this.setState({
      dataSource: [
        value
      ]
    }); 
  };

  render() {
    return (
      <div>
        <AutoComplete
          hintText="Search user..."
          dataSource={this.state.dataSource}
          onUpdateInput={this.handleUpdateInput}
        />
      </div>
    );
  }
}