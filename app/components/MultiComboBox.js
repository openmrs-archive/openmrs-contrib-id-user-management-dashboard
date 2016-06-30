import React from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import theme from './MultiComboBox.scss';

class MultiComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      multiple: []
    };
  }

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