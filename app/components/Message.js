import React from 'react';
import {Snackbar} from 'react-toolbox';

import AppActions from '../actions/AppActions';
import AppStore from '../stores/AppStore';

class Message extends React.Component {

  handleSnackbarClose() {
    AppActions.showMessage();
  };

  render() {
    return <Snackbar
      action='Hide'
      active={AppStore.getState().message != null}
      icon='question_answer'
      label={AppStore.getState().message}
      timeout={3000}
      onClick={this.handleSnackbarClose}
      onTimeout={this.handleSnackbarClose}
      type='accept'
    />
  }
}

export default Message;