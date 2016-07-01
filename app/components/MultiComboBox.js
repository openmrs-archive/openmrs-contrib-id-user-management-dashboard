import React from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import theme from './multicombobox.scss';

class MultiComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      source: props.source,
      label: props.dialogLabel
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.value, source: newProps.source});
  }

  handleMultipleChange = (value) => {
    this.setState({value});
    this.props.action(value);
  };

  render () {
    return (
      <div>
        <Autocomplete
          direction="down"
          label={this.state.label}
          multiple={true}
          onChange={this.handleMultipleChange}
          source={this.state.source}
          theme={theme}
          value={this.state.value}/>
      </div>
    );
  }
}

export default MultiComboBox;