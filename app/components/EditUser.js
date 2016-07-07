import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import {Snackbar} from 'react-toolbox';
import Switch from 'react-toolbox/lib/switch';
import _ from 'lodash';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

import MultiComboBox from './MultiComboBox';

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allGroups: AppStore.state.allGroups,
      users: props.users,
      active: false,
      snackbar: false
    };
    
    this.updateGroups = this.updateGroups.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({users: newProps.users});
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  };

  handleChange = (field, value) => {
    let users = this.state.users;
    let updated = false;
    _.each(users, (user) => {
      if (user[field] === 'No' && value) {
        user[field] = 'Yes';
        updated = true;
      }
    });
    if (updated) {
      this.setState({users});
      this.setState({snackbar: true});
    }
  };
  handleSnackbarClick = () => {
    this.setState({snackbar: false});
  };

  handleSnackbarTimeout = () => {
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
    AppActions.updateUser(this.state.user);
    this.setState({active: !this.state.active});
  };

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Save", onClick: this.submitForm }
  ];

  render () {
    let label, groups, allInMongo, allInLDAP, sucessLabel;
    if (this.state.users.length === 1) {
      label = `Edit User "${this.state.users[0].firstName}"`;
      groups = this.state.users[0].groups;
      sucessLabel =  `User was successfully updated`;
    }
    else {
      label = `Edit ${this.state.users.length} users`;
      groups = [];
      sucessLabel = `${this.state.users.length} users were successfully updated`;
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
          <Switch
            checked={allInLDAP}
            label="LDAP"
            onChange={this.handleChange.bind(this, 'inLDAP')}
          />
          <Switch
            checked={allInMongo}
            label="Mongo"
            onChange={this.handleChange.bind(this, 'inMongo')}
          />
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

