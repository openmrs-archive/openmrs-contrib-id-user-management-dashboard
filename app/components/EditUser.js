import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import {IconButton} from 'react-toolbox/lib/button';
import {Col, Row} from 'react-flexbox-grid';
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
    this.addEmptyEmail = this.addEmptyEmail.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.removeEmail = this.removeEmail.bind(this);
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
      if (!user[field] && value) {
        user[field] = true;
        updated = true;
      }
    });
    if (updated) {
      AppActions.updateUsers({
        users: users,
        resave: true
      });
      this.setState({snackbar: true, users});
    }
  };

  handleUserPropsChange(key, value) {
    let users = this.state.users;
    if (key === 'primaryEmail') {
      let prev = users[0].primaryEmail;
      let index = users[0].emailList.indexOf(prev);
      if (index !== -1) {
        users[0].emailList[index] = value;
      }
    }
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

  addEmptyEmail() {
    let users = this.state.users;
    users[0].emailList.push('');
    this.setState({users});
  }

  removeEmail(index) {
    let users = this.state.users;
    users[0].emailList.splice(index, 1);
    this.setState({users});
  }

  changeEmail(index, value) {
    let users = this.state.users;
    if (index == 0) {
      users[0].primaryEmail = value;
    }
    users[0].emailList[index] = value;
    this.setState({users});
  }

  submitForm = () => {
    AppActions.updateUsers({
      users: this.state.users
    });
    // TODO: make it async
    this.setState({active: !this.state.active, snackbar: true});
  };

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Save", onClick: this.submitForm }
  ];

  render () {
    let label, groups, allInMongo, allInLDAP, allLocked, sucessLabel, editUser;
    let user, emails = [];
    if (this.state.users.length === 1) {
      user = this.state.users[0];
      label = `Edit User "${user.username}"`;
      groups = user.groups;
      sucessLabel =  `User was successfully updated`;
      for (var index in user.emailList) {
        if (user.emailList[index] === user.primaryEmail) {
          emails.push(
            <Row key={'email' + index}>
              <Col md={12}>
                <Input type='email'
                       label={'Primary Email'}
                       value={user.emailList[index]}
                       onChange={this.changeEmail.bind(this, index)}
                       name={index}
                       disabled={user.locked}/>
              </Col>
            </Row>
          )
        }
        else {
          emails.push(
            <Row key={'email' + index}>
              <Col md={11} sm={10}>
                <Input type='email'
                       label={'Email'}
                       value={user.emailList[index]}
                       onChange={this.changeEmail.bind(this, index)}
                       name={index}
                       disabled={user.locked}/>
              </Col>
              <Col md={1} sm={2}>
                <IconButton icon='clear'
                            style={{marginTop: '25px', marginLeft: '-10px'}}
                            onClick={() => {this.removeEmail(index)}}
                            disabled={user.locled}/>
              </Col>
            </Row>
          )
        }
      }
      let emailBlock =
        user.inMongo ? <div style={{marginTop: '20px', marginBottom: '20px'}}>
          Email List:
          {emails.map((item, index) => {
            return <div key={index}>
              {item}
            </div>
          })}
          <Button label={'Add email'}
                  icon={'email'}
                  onClick={this.addEmptyEmail}
                  disabled={user.locked}/>
        </div> : '';
      editUser =
        <div>
          <Input type='text'
                 label={'Username'}
                 value={user.username}
                 onChange={this.handleUserPropsChange.bind(this, 'username')}
                 name='username'
                 disabled={true}/>
          <Input type='text'
                 label={'Primary Email'}
                 value={user.primaryEmail}
                 onChange={this.handleUserPropsChange.bind(this, 'primaryEmail')}
                 name='primaryEmail'
                 disabled={user.locked}/>
          <Input type='text'
                 label={'First Name'}
                 value={user.firstName}
                 onChange={this.handleUserPropsChange.bind(this, 'firstName')}
                 name='firstName'
                 disabled={user.locked}/>
          <Input type='text'
                 label={'Last Name'}
                 value={user.lastName}
                 onChange={this.handleUserPropsChange.bind(this, 'lastName')}
                 name='lastName'
                 disabled={user.locked}/>
          {emailBlock}
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
    allLocked = true;
    _.each(this.state.users, (user) => {
      if (allInLDAP) {
        allInLDAP = user.inLDAP;
      }
      if (allInMongo) {
        allInMongo = user.inMongo;
      }
      if (allLocked) {
        allLocked = user.locked;
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
          <MultiComboBox action={this.updateGroups} source={this.state.allGroups} value={groups} dialogLabel={'Select groups'} disabled={!user.inMongo}/>
          {editUser}
          <Switch
            checked={allInLDAP}
            label={'LDAP'}
            onChange={this.handleUserStatusChange.bind(this, 'inLDAP')}
          />
          <Switch
            checked={allInMongo}
            label={'Mongo'}
            onChange={this.handleUserStatusChange.bind(this, 'inMongo')}
          />
          <Switch
            checked={allLocked}
            label={'Locked'}
            onChange={this.handleUserPropsChange.bind(this, 'locked')}
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

