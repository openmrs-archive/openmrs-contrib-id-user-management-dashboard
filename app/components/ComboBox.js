import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import MultiComboBox from './MultiComboBox';

import AppActions from '../actions/AppActions';

class ComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      value: props.value,
      source: props.source,
      label: props.dialogLabel,
      title: props.dialogTitle
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.value});
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  };
  
  handleChange = AppActions.setColumns;

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Ok", onClick: this.handleToggle }
  ];

  render () {
    return (
      <div>
        <Button label={this.state.label} onClick={this.handleToggle} />
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={this.state.title}>
          <MultiComboBox source={this.state.source} value={this.state.value} dialogLabel={this.state.label}/>
        </Dialog>
      </div>
    );
  }
}

export default ComboBox;

