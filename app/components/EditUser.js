import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import {Snackbar} from 'react-toolbox';
import Switch from 'react-toolbox/lib/switch';
import Input from 'react-toolbox/lib/input';
import _ from 'lodash';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

import MultiComboBox from './MultiComboBox';

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allGroups: AppStore.getState().allGroups,
      users: props.users,
      active: false,
      snackbar: false
    };
    
    this.updateGroups = this.updateGroups.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.handleSnackbarTimeout = this.handleSnackbarTimeout.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({users: newProps.users});
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  };

  handleUserStatusChange(field, value) {
    let users = this.state.users;
    let updated = false;
    _.each(users, (user) => {
      if (user[field] === 'No' && value) {
        user[field] = 'Yes';
        updated = true;
      }
    });
    if (updated) {
      this.setState({snackbar: true, users});
    }
  };

  handleUserPropsChange(key, value) {
    let users = this.state.users;
    users[0][key] = value;
    this.setState({users});
  }

  handleResetPass() {
    // TODO: add logic for password reset
    this.setState({snackbar: true});
  };

  handleRemoveUser() {
    AppActions.deleteUsers(this.state.users);
  }

  handleSnackbarClick () {
    this.setState({snackbar: false});
  };

  handleSnackbarTimeout() {
    this.setState({snackbar: false});
  };
  
  updateGroups(value) {
    let users = this.state.users;
    _.each(users, (user) => {
      user.groups = value;
    });
    this.setState({users});
  }
  
  submitForm = () => {
    AppActions.updateUsers(this.state.users);
    // TODO: make it async
    this.setState({active: !this.state.active, snackbar: true});
  };

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Save", onClick: this.submitForm }
  ];

  render () {
    let label, groups, allInMongo, allInLDAP, sucessLabel, editUser;
    if (this.state.users.length === 1) {
      let user = this.state.users[0];
      label = `Edit User "${user.username}"`;
      groups = user.groups;
      sucessLabel =  `User was successfully updated`;
      editUser =
        <div>
          <Input type='text' label={'Username'} value={user.username} onChange={this.handleUserPropsChange.bind(this, 'username')} name='username'/>
          <Input type='text' label={'Primary Email'} value={user.primaryEmail} onChange={this.handleUserPropsChange.bind(this, 'primaryEmail')} name='primaryEmail'/>
          <Input type='text' label={'First Name'} value={user.firstName} onChange={this.handleUserPropsChange.bind(this, 'firstName')} name='firstName'/>
          <Input type='text' label={'Last Name'} value={user.lastName} onChange={this.handleUserPropsChange.bind(this, 'lastName')} name='lastName'/>
        </div>
    }
    else {
      label = `Edit ${this.state.users.length} users`;
      groups = [];
      sucessLabel = `${this.state.users.length} users were successfully updated`;
      editUser = '';
    }
    allInMongo = true;
    allInLDAP = true;
    _.each(this.state.users, (user) => {
      if (allInLDAP) {
        allInLDAP = user.inLDAP === 'Yes';
      }
      if (allInMongo) {
        allInMongo = user.inMongo === 'Yes';
      }
    });
    return (
      <div style={{marginTop: '15px'}} >
        <Button label={label} icon={'mode_edit'} onClick={this.handleToggle} />
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={label}>
          <MultiComboBox action={this.updateGroups} source={this.state.allGroups} value={groups} dialogLabel={'Select groups'}/>
          {editUser}
          <Switch
            checked={allInLDAP}
            label="LDAP"
            onChange={this.handleUserStatusChange.bind(this, 'inLDAP')}
          />
          <Switch
            checked={allInMongo}
            label="Mongo"
            onChange={this.handleUserStatusChange.bind(this, 'inMongo')}
          />
          <Button label='Remove User' accent onClick={this.handleRemoveUser}/>
          <Button label='Reset Password' accent onClick={this.handleResetPass}/>
        </Dialog>
        <Snackbar
          action='Hide'
          active={this.state.snackbar}
          icon='question_answer'
          label={sucessLabel}
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

