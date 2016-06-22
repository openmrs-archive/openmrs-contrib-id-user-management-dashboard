import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';

import MultiComboBox from './MultiComboBox';

class EditUser extends React.Component {
  state = {
    active: false
  };

  handleToggle = () => {
    this.setState({active: !this.state.active});
  };

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Ok", onClick: this.handleToggle }
  ];

  render () {
    return (
      <div>
        <Button label={'Configure'} onClick={this.handleToggle} />
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={'Edit User Properties'}>

          <MultiComboBox source={this.props.source} dialogLabel={this.props.dialogLabel}/>
        </Dialog>
      </div>
    );
  }
}

export default EditUser;

