import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import Switch from 'react-toolbox/lib/switch';

import MultiComboBox from './MultiComboBox';

class EditUser extends React.Component {
  state = {
    active: false,
    inLDAP: false,
    inMongo: true
  };

  handleToggle = () => {
    this.setState({active: !this.state.active});
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
          
          <MultiComboBox source={this.props.source} dialogLabel={'Select groups'}/>
          <Switch
            checked={this.state.inLDAP}
            label="LDAP"
          />
          <Switch
            checked={this.state.inMongo}
            label="Mongo"
          />
        </Dialog>
      </div>
    );
  }
}

export default EditUser;

