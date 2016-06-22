import React from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import theme from './combo.scss';

class MultiComboBox extends React.Component {
  state = {
    multiple: []
  };

  handleMultipleChange = (value) => {
    this.setState({multiple: value});
  };

  render () {
    return (
      <div>
        <Autocomplete
          direction="down"
          label={this.props.dialogLabel}
          multiple={true}
          onChange={this.handleMultipleChange}
          source={this.props.source}
          theme={theme}
          value={this.state.multiple}/>
      </div>
    );
  }
}

export default MultiComboBox;