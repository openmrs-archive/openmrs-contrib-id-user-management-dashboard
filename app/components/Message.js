import React from 'react';
import {Snackbar} from 'react-toolbox';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      text: props.text
    };
  }

  handleSnackbarClose() {
    this.setState({active: false});
  };

  render() {
    return <Snackbar
      action='Hide'
      active={this.state.active}
      icon='question_answer'
      label={this.state.text}
      timeout={2000}
      onClick={this.handleSnackbarClose}
      onTimeout={this.handleSnackbarClose}
      type='accept'
    />
  }
}

export default Message;