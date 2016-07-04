import Table from 'react-toolbox/lib/table';
import {Grid, Col, Row} from 'react-flexbox-grid';
import {Link} from 'react-router';
import Input from 'react-toolbox/lib/input';
import React from 'react';
import _ from 'lodash';

import AppStore from '../stores/AppStore';

import EditUser from './EditUser';

class DataGrid extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = { 
      model: props.model,
      current: props.currentPage || 1,
      size: props.size,
      pages: props.pages,
      selected: [],
      source: props.source,
      prevSelected: []
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      source: newProps.source, 
      model: newProps.model, 
      pages: newProps.pages,
      size: newProps.size,
      current: newProps.currentPage
    });
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
      let user = this.state.source[this.state.selected[0]];
      let allItems = AppStore.getState().allItems;
      let userGlobal = _.find(allItems, (item) => {
        return item.id === user.id;
      });
      editUser = <EditUser mini user={userGlobal}/>;
    }
    else {
      editUser = <div></div>;
    }
    var pages = this.state.pages;
    var current = this.state.current;
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
          <Col md={1} mdOffset={7}>
            <Input type='text' value={this.state.size}/>
          </Col>
          <Col md={2}>
            <Row style={{marginTop: '20px'}}>
              <Link to={{pathname: 'user-dashboard', query: {page: 1}}} style={{margin: '5px', marginLeft: '15px'}} >
                &#171;
              </Link>
              {pages.map(function(page) {
                if (current == page) {
                  return <Link style={{margin: '5px', color: 'red'}} to={{pathname: 'user-dashboard', query: {page: page}}}>
                    {page}
                  </Link>
                }
                else {
                  return <Link style={{margin: '5px'}} to={{pathname: 'user-dashboard', query: {page: page}}}>
                    {page}
                  </Link>
                }
              })}
              <Link to={{pathname: 'user-dashboard', query: {page: 1}}} style={{margin: '5px'}}>
                &#187;
              </Link>  
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default DataGrid;