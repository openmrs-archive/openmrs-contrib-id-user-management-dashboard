import Table from 'react-toolbox/lib/table';
import {Grid, Col, Row} from 'react-flexbox-grid';
import {Link} from 'react-router';
import Dropdown from 'react-toolbox/lib/dropdown';
import React from 'react';
import Button from 'react-toolbox/lib/button';
import Switch from 'react-toolbox/lib/switch';
import _ from 'lodash';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

import theme from './dropdown.scss';

import EditUser from './EditUser';

class DataGrid extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      all: props.all,
      model: props.model,
      current: props.currentPage,
      last: props.lastPage,
      size: props.size,
      pages: props.pages,
      selected: [],
      source: props.source
    };

    this.handleRemove = this.handleRemove.bind(this);
    this.handleUserStatusChange = this.handleUserStatusChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.handleSelect([]);
    this.setState({
      source: newProps.source,
      model: newProps.model,
      pages: newProps.pages,
      size: newProps.size,
      current: newProps.currentPage,
      last: newProps.lastPage,
      all: newProps.all
    });
  }

  handleSelect = (newSelected) => {
    let selected = this.state.selected;
    let diffNew = _.difference(newSelected, selected);
    if (diffNew.length) {
      _.each(diffNew, (el) => {
        selected.push(el);
      });
    }
    else if (!newSelected.length) {
      selected = [];
    }
    else {
      selected.splice(selected.indexOf(newSelected[newSelected.length - 1]), 1);
    }
    this.setState({selected});
  };

  handleRemove() {
    let that = this;
    let users = _.map(this.state.selected, (index) => {
      let user = that.state.source[index];
      return _.find(AppStore.getState().allItems, (globalUser) => {
        return globalUser.username === user.username;
      });
    });
    AppActions.deleteUsers({users: users});
  }

  handleUserStatusChange(field, value) {
    let userIndexes = this.state.selected;
    let toResave = false;
    let users = _.map(userIndexes, (index) => {
      let user = this.state.source[index];
      let userGlobal = _.find(AppStore.getState().allItems, (globalUser) => {
        return globalUser.username === user.username;
      });
      if (!userGlobal[field] && value) {
        toResave = true;
      }
      return userGlobal;
    });
    if (toResave) {
      AppActions.updateUsers({
        users: users,
        resave: true
      });
    }
    else {
      if (field === 'inMongo') {
        AppActions.deleteUsers({users: users, onlyMongo: true});
      }
      else {
        AppActions.deleteUsers({users: users, onlyLDAP: true});
      }
    }
  };

  render () {
    let editUserBlock;
    if (this.state.selected && this.state.selected.length) {
      let usersSource = this.state.source;
      let allUsersInMongoFlag = true;
      let allUsersInLDAPFlag = true;
      let allItems = AppStore.getState().allItems;
      let first = this.state.selected[0];
      let selectedUsers = _.map(this.state.selected, (index) => {
        let user = usersSource[index];
        if (allUsersInLDAPFlag) {
          allUsersInLDAPFlag = user.inLDAP === usersSource[first].inLDAP;
        }
        if (allUsersInMongoFlag) {
          allUsersInMongoFlag = user.inMongo === usersSource[first].inMongo;
        }
        return _.find(allItems, (item) => {
          return item.primaryEmail === user.primaryEmail;
        });
      });
      let editUserSwitches = [];
      if (allUsersInLDAPFlag) {
        editUserSwitches.push(
          <Switch
            checked={usersSource[first].inLDAP}
            label={'OpenLDAP'}
            onChange={this.handleUserStatusChange.bind(this, 'inLDAP')}/>
        )
      }
      if (allUsersInMongoFlag) {
        editUserSwitches.push(
          <Switch
            checked={usersSource[first].inMongo}
            label={'MongoDb'}
            onChange={this.handleUserStatusChange.bind(this, 'inMongo')}/>
        )
      }
      editUserBlock =
        <Row style={{marginTop: '15px'}} >
          <Col md={3}>
            <EditUser mini users={selectedUsers}/>
          </Col>
          <Col md={2} mdOffset={1}>
            <Button label='Remove' accent onClick={this.handleRemove}/>
          </Col>
          {editUserSwitches.map((el, index) => {
            return <Col md={2} style={{marginTop: '5px'}} key={index}>
              {el}
            </Col>
          })}
        </Row>;
    }
    else {
      editUserBlock = '';
    }
    let pages = this.state.pages;
    let current = this.state.current;
    let last = this.state.last;
    let len = this.state.source.length;
    let offset = this.state.size * (current-1);
    let infoText;
    if (len < 2) {
      infoText = offset + len;
    }
    else {
      infoText = (offset + 1) + '-' + (offset + len);
    }
    let paginationInfo = <div style={{marginTop: '25px'}}>{infoText + ' of ' + this.state.all.length + ' shown'}</div>;
    let paginationBlock = !this.state.selected.length ?
      <Row>
        <Col md={3} mdOffset={4}>
          {paginationInfo}
        </Col>
        <Col md={2} mdOffset={1}>
          <Row>
            <Dropdown
              auto
              theme={theme}
              onChange={AppActions.setSize}
              source={AppStore.getState().sizes}
              value={AppStore.getState().size}
            />
          </Row>
        </Col>
        <Col md={2}>
          <Row style={{marginTop: '25px'}}>
            <Link to={{pathname: 'user-dashboard', query: {page: 1}}} style={{margin: '5px', marginLeft: '15px', color: '#000000'}}>
              &#171;
            </Link>
            {pages.map(function(page, index) {
              if (current == page) {
                return <Link key={index} style={{margin: '5px', color: '#FF9800'}} to={{pathname: 'user-dashboard', query: {page: page}}}>
                  {page}
                </Link>
              }
              else {
                return <Link key={index} style={{margin: '5px', color: '#000000'}} to={{pathname: 'user-dashboard', query: {page: page}}}>
                  {page}
                </Link>
              }
            })}
            <Link to={{pathname: 'user-dashboard', query: {page: last}}} style={{margin: '5px', color: '#000000'}}>
              &#187;
            </Link>
          </Row>
        </Col>
      </Row> : '';
    return (
      <Grid>
        <Row>
          <Table
            model={this.state.model}
            onSelect={this.handleSelect}
            selectable
            multiSelectable
            onChange={() => {}}
            selected={this.state.selected}
            source={this.state.source}
          />
        </Row>
        {editUserBlock}
        {paginationBlock}
      </Grid>
    );
  }
}

export default DataGrid;