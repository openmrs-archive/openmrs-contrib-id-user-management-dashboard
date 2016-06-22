import Table from 'react-toolbox/lib/table';
import {Grid, Col, Row} from 'react-flexbox-grid';
import Button from 'react-toolbox/lib/button';
import Link from 'react-toolbox/lib/link';
import React from 'react';

import Pager from './Pager';

class DataGrid extends React.Component {
  
  state = { selected: [], source: this.props.source, prevSelected: [] };

  handleChange = (row, key, value) => {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  };

  handleSelect = (selected) => {
    const prevSelected = this.state.selected;
    if (prevSelected.length && selected.length && selected[0] === prevSelected[0]) {
      selected = [];
    }
    this.setState({prevSelected});
    this.setState({selected});
  };

  render () {
    return (
      <Grid>
        <Row>
          <Table
            model={this.props.model}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            selectable
            multiSelectable
            selected={this.state.selected}
            source={this.state.source}
          />
        </Row>  
        <Row>
          <Col md={2}>
            <Button icon={'mode_edit'} label={'Configure'} mini disabled={!this.state.selected.length}/>
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