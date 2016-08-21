import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import {IconButton} from 'react-toolbox/lib/button';
import {Col, Row} from 'react-flexbox-grid';
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
    };

    this.updateGroups = this.updateGroups.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
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

  setAsPrimary(index) {
    let users = this.state.users;
    let email = users[0].emailList[index];
    users[0].emailList.splice(index, 1);
    users[0].emailList.unshift(email);
    users[0].primaryEmail = email;
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
    this.setState({active: !this.state.active});
  };

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Save", onClick: this.submitForm }
  ];

  render () {
    let editButtonLabel, groups, allUsersLockedFlag, editUserFieldsBlock;
    let selectedUser, emailsList = [];
    if (this.state.users.length === 1) {
      selectedUser = this.state.users[0];
      editButtonLabel = `Edit User "${selectedUser.username}"`;
      groups = selectedUser.groups;
      for (var index in selectedUser.emailList) {
        if (selectedUser.emailList[index] === selectedUser.primaryEmail) {
          emailsList.push(
            <Row key={'email' + index}>
              <Col md={12}>
                <Input type='email'
                       label={'Primary Email'}
                       value={selectedUser.emailList[index]}
                       onChange={this.changeEmail.bind(this, index)}
                       name={index}
                       disabled={selectedUser.locked}/>
              </Col>
            </Row>
          )
        }
        else {
          emailsList.push(
            <Row key={'email' + index}>
              <Col md={10} sm={8}>
                <Input type='email'
                       label={'Email'}
                       value={selectedUser.emailList[index]}
                       onChange={this.changeEmail.bind(this, index)}
                       name={index}
                       disabled={selectedUser.locked}/>
              </Col>
              <Col md={1} sm={2}>
                <IconButton icon='done'
                            style={{marginTop: '25px', marginLeft: '-10px'}}
                            onClick={() => {this.setAsPrimary(index)}}
                            disabled={selectedUser.locked}/>
              </Col>
              <Col md={1} sm={2}>
                <IconButton icon='clear'
                            style={{marginTop: '25px', marginLeft: '-10px'}}
                            onClick={() => {this.removeEmail(index)}}
                            disabled={selectedUser.locked}/>
              </Col>
            </Row>
          )
        }
      }
      let emailsBlock =
        selectedUser.inMongo ? <div style={{marginTop: '20px', marginBottom: '20px'}}>
          Email List:
          {emailsList.map((item, index) => {
            return <div key={index}>
              {item}
            </div>
          })}
          <Button label={'Add email'}
                  icon={'email'}
                  onClick={this.addEmptyEmail}
                  disabled={selectedUser.locked}/>
        </div> : '';
      editUserFieldsBlock =
        <div>
          <Input type='text'
                 label={'Username'}
                 value={selectedUser.username}
                 onChange={this.handleUserPropsChange.bind(this, 'username')}
                 name='username'
                 disabled={true}/>
          <Input type='text'
                 label={'Primary Email'}
                 value={selectedUser.primaryEmail}
                 onChange={this.handleUserPropsChange.bind(this, 'primaryEmail')}
                 name='primaryEmail'
                 disabled={selectedUser.locked}/>
          <Input type='text'
                 label={'First Name'}
                 value={selectedUser.firstName}
                 onChange={this.handleUserPropsChange.bind(this, 'firstName')}
                 name='firstName'
                 disabled={selectedUser.locked}/>
          <Input type='text'
                 label={'Last Name'}
                 value={selectedUser.lastName}
                 onChange={this.handleUserPropsChange.bind(this, 'lastName')}
                 name='lastName'
                 disabled={selectedUser.locked}/>
          {emailsBlock}
        </div>
    }
    else {
      editButtonLabel = `Edit ${this.state.users.length} users`;
      groups = [];
      editUserFieldsBlock = '';
    }
    allUsersLockedFlag = true;
    _.each(this.state.users, (user) => {
      if (allUsersLockedFlag) {
        allUsersLockedFlag = user.locked;
      }
    });
    return (
      <div>
        <Button label={editButtonLabel} icon={'mode_edit'} onClick={this.handleToggle} />
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={editButtonLabel}>
          <MultiComboBox action={this.updateGroups}
                         source={this.state.allGroups}
                         value={groups}
                         dialogLabel={'Select groups'}/>
          {editUserFieldsBlock}
          <Switch
            checked={allUsersLockedFlag}
            label={'Locked'}
            onChange={this.handleUserPropsChange.bind(this, 'locked')}/>
        </Dialog>
      </div>
    );
  }
}

export default EditUser;

