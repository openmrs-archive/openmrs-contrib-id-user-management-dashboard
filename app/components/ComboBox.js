import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import {IconButton} from 'react-toolbox/lib/button';
import MultiComboBox from './MultiComboBox';

class ComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: props.action || function() {},
      active: false,
      value: props.value,
      source: props.source,
      icon: props.icon,
      title: props.dialogTitle
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.value});
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  };

  handleChange = (value) => {
    this.setState({value});
  };

  submitForm = () => {
    this.props.action(this.state.value);
    this.handleToggle();
  };

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Ok", onClick: this.submitForm }
  ];

  render () {
    return (
      <div style={{display: 'inline'}}>
        <IconButton label={this.state.label} icon={this.state.icon} onClick={this.handleToggle} style={{display: 'inline-block'}}/>
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={this.state.title}>
          <MultiComboBox action={this.handleChange}
                         source={this.state.source}
                         value={this.state.value}
                         dialogLabel={this.state.label}/>
        </Dialog>
      </div>
    );
  }
}

export default ComboBox;

