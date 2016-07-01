import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import {Snackbar} from 'react-toolbox';
import Switch from 'react-toolbox/lib/switch';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

import MultiComboBox from './MultiComboBox';

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allGroups: AppStore.state.allGroups,
      user: props.user,
      active: false,
      snackbar: false
    };
    
    this.updateGroups = this.updateGroups.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({user: newProps.user});
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  };

  handleChange = (field, value) => {
    let user = this.state.user;
    if (user[field] == 'No' && value) {
      user[field] = 'Yes';
      this.setState({user});
      this.setState({snackbar:true});
    }
  };
  handleSnackbarClick = () => {
    this.setState({snackbar: false});
  };

  handleSnackbarTimeout = () => {
    this.setState({snackbar: false});
  };
  
  updateGroups(value) {
    let user = this.state.user;
    user.groups = value;
    this.setState({user});
  }
  
  submitForm = () => {
    AppActions.updateUser(this.state.user);
    this.setState({active: !this.state.active});
  };

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Save", onClick: this.submitForm }
  ];

  render () {
    return (
      <div>
        <Button label={'Edit User "' + this.state.user.firstName + '"'} icon={'mode_edit'} onClick={this.handleToggle} />
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={'Edit User "' + this.state.user.firstName + ' ' + this.state.user.lastName + '"'}>
          <MultiComboBox action={this.updateGroups} source={this.state.allGroups} value={this.state.user.groups} dialogLabel={'Select groups'}/>
          <Switch
            checked={this.state.user.inLDAP === 'Yes'}
            label="LDAP"
            onChange={this.handleChange.bind(this, 'inLDAP')}
          />
          <Switch
            checked={this.state.user.inMongo === 'Yes'}
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

