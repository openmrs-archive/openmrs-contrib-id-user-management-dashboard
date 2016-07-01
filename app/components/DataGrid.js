import Table from 'react-toolbox/lib/table';
import {Grid, Col, Row} from 'react-flexbox-grid';
import Link from 'react-toolbox/lib/link';
import React from 'react';

import EditUser from './EditUser';

class DataGrid extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = { 
      model: props.model,
      selected: [],
      source: props.source,
      prevSelected: []
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({source: newProps.source, model: newProps.model});
  }

  handleSelect = (selected) => {
    const prevSelected = this.state.selected;
    if (prevSelected.length && selected.length && selected[0] === prevSelected[0]) {
      selected = [];
    }
    this.setState({prevSelected});
    this.setState({selected});
  };

  render () {
    var editUser;
    if (this.state.selected && this.state.selected.length) {
      editUser = <EditUser mini user={this.state.source[this.state.selected[0]]}/>;
    }
    else {
      editUser = <div></div>;
    }
    return (
      <Grid>
        <Row>
          <Table
            model={this.state.model}
            onSelect={this.handleSelect}
            selectable
            multiSelectable
            selected={this.state.selected}
            source={this.state.source}
          />
        </Row>
        <Row style={{marginTop: '10px'}}>
          <Col md={2}>
            {editUser}
          </Col>
          <Col md={2} mdOffset={8}>
            <Row>
              <Link style={{margin: '5px', marginLeft: '15px'}} label={'First'} />
              <Link style={{margin: '5px'}} active label={'1'} />
              <Link style={{margin: '5px'}} label={'Last'} />
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default DataGrid;