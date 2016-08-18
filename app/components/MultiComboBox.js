import React from 'react';
import _ from 'lodash';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import theme from './multicombobox.scss';

class MultiComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      source: props.source,
      label: props.dialogLabel,
      disabled: props.disabled
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.value, source: newProps.source});
  }

  handleMultipleChange = (value) => {
    let current = this.state.value;
    let newItems = _.difference(value, current);
    let oldItems = _.difference(current, value);
    if (newItems.length) {
      current.push(newItems[0]);
    }
    else if (oldItems.length) {
      let index = current.indexOf(oldItems[0]);
      current.splice(index, 1);
    }
    this.setState({value: current});
    this.props.action(current);
  };

  render () {
    return (
      <div>
        <Autocomplete
          disabled={this.state.disabled}
          direction={'down'}
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