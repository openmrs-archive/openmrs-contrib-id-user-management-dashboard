import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import {Snackbar} from 'react-toolbox';
import Switch from 'react-toolbox/lib/switch';

import MultiComboBox from './MultiComboBox';

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      snackbar: false
    };
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  };

  handleChange = (field, value) => {
    var current = this.state[field];
    if (current == 'No' && value) {
      this.setState({...this.state, [field]: 'Yes'});
      this.setState({snackbar:true});
    }
  };
  handleSnackbarClick = () => {
    this.setState({ snackbar: false });
  };

  handleSnackbarTimeout = () => {
    this.setState({ snackbar: false });
  };

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Save", onClick: this.handleToggle }
  ];

  render () {
    return (
      <div>
        <Button label={'Configure'} icon={'mode_edit'} onClick={this.handleToggle} disabled={this.props.disabled} />
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={'Edit User "' + this.props.user.name + '"'}>
          
          <Switch
            checked={this.props.user.inLDAP === 'Yes'}
            label="LDAP"
            onChange={this.handleChange.bind(this, 'inLDAP')}
          />
          <Switch
            checked={this.props.user.inMongo === 'Yes'}
            label="Mongo"
            onChange={this.handleChange.bind(this, 'inMongo')}
          />
        </Dialog>
        <Snackbar
          action='Hide'
          active={this.state.snackbar}
          icon='question_answer'
          label='User was successfully updated'
          timeout={2000}
          onClick={this.handleSnackbarClick}
          onTimeout={this.handleSnackbarTimeout}
          type='accept'
        />
      </div>
    );
  }
}

export default EditUser;

