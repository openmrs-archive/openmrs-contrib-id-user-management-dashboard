import _ from 'lodash';

import AltInstance    from '../lib/AltInstance';
import Actions        from '../actions/AppActions';
import Source         from './AppSource';

class AppStore {
  constructor() {
    let {
      setGridData,
      initGroupList,
      setFilters,
      setQuery,
      setSort,
      setColumns,
      updateUsers,
      deleteUsers,
      setCurrentPage,
      setSize,
      showMessage
    } = Actions;

    this.bindListeners({
      setGridData: setGridData,
      initGroupList: initGroupList,
      setFilters: setFilters,
      setQuery: setQuery,
      setSort: setSort,
      setColumns: setColumns,
      updateUsers: updateUsers,
      deleteUsers: deleteUsers,
      setCurrentPage: setCurrentPage,
      setSize: setSize,
      showMessage: showMessage
    });

    this.applyFilters = this.applyFilters.bind(this);

    this.state = {
      allItems: [],
      filteredItems: [],
      columnToFilter: [
        'username',
        'firstName',
        'lastName',
        'primaryEmail'
      ],
      allColumns: {
        firstName: 'First Name',
        lastName: 'Last Name',
        inLDAP: 'LDAP',
        inMongo: 'Mongo',
        username: 'Username',
        primaryEmail: 'Primary Email',
        displayName: 'Display Name',
        locked: 'Locked'
      },
      columns: ['username', 'primaryEmail', 'firstName', 'lastName', 'inLDAP', 'inMongo', 'locked'],
      allFilters: {
        inLDAP: 'In LDAP',
        inMongo: 'In Mongo',
        locked: 'Locked'
      },
      filters: [],
      sort: ['username'],
      query: '',
      allGroups: [],
      userModel: {},
      defaultModel: {
        username: {type: String},
        firstName: {type: String},
        lastName: {type: String},
        inMongo: {type: Boolean},
        inLDAP: {type: Boolean},
        groups: {type: [String]},
        primaryEmail: {type: String},
        displayName: {String},
        emailList: {type: [String]},
        locked: {type: Boolean}
      },
      // pagination
      pagedItems: [],
      size: 10,
      sizes: [
        {
          value: 10, label: '10/page'
        },
        {
          value: 50, label: '50/page'
        },
        {
          value: 100, label: '100/page'
        },
        {
          value: 200, label: '200/page'
        }
      ],
      currentPage: 1,
      lastPage: 1,
      pages: [],
      pageLinksOnScreen: 10
    };
    Source.getUsers();
    Source.getGroups();
  }

  applyFilters(init) {
    let that = this;
    let regExpCheck = (item) => {
      let regExp = new RegExp(this.state.query);
      let eq = false;
      _.each(this.state.columnToFilter, (column) => {
         if (regExp.test(item[column])) {
           eq = true;
         }
      });
      return eq;
    };

    let strictCheck = (item) => {
      let queryString = this.state.query.toLowerCase();
      let eq = false;
      _.each(this.state.columnToFilter, (column) => {
        if (item[column] && item[column].toLowerCase().indexOf(queryString) !== -1) {
          eq = true;
        }
      });
      return eq;
    };
    let filteredFirstItems = _.filter(this.state.allItems, (item) => {
      let query = strictCheck(item) || regExpCheck(item);
      if (query) {
        var state = true;
        _.each(that.state.filters, (el) => {
          state && (state = item[el]);
        });
        return state;
      }
      return false;
    });
    let filteredItems = _.sortBy(_.map(filteredFirstItems, (item) => {
      let obj = {};
      for (var key in item) {
        if (key && that.state.columns.indexOf(key) !== -1) {
          obj[key] = item[key];
        }
      }
      return obj;
    }), (i) => {
      return _.map(that.state.sort, (sorter) => {
        return i[sorter];
      }).join('_');
    });
    // apply user model
    let userModel = {};
    _.each(this.state.columns, (column) => {
      userModel[column] = that.state.defaultModel[column];
    });
    if (!init) {
      this.setState({filteredItems, userModel});
    }
    else {
      this.state.filteredItems = filteredItems;
      this.state.userModel = userModel;
    }
    this.setCurrentPage(1, init);
  }
  initGroupList(allGroups) {
    this.state.allGroups = allGroups;
  }
  setGridData(allItems) {
    this.setState({allItems});
    this.applyFilters(true);
  }
  setFilters(filters) {
    this.setState({filters});
    this.applyFilters();
  }
  setQuery(query) {
    this.setState({query});
    this.applyFilters();
  }
  setSort(sort) {
    this.setState({sort});
    this.applyFilters();
  }
  setColumns(columns) {
    this.setState({columns});
    this.applyFilters();
  }
  updateUsers(options) {
    let that = this;
    let users = options.users;
    let resave = options.resave;
    let updateEach = (updatedUsers) => {
      if (updatedUsers) {
        let allItems = that.state.allItems;
        _.each(updatedUsers, (user) => {
          let old = _.find(allItems, (item) => {
            return user._id === item._id;
          });
          let index = allItems.indexOf(old);
          if (index !== -1) {
            allItems[index] = user;
          }
        });
        that.setState({allItems});
        that.applyFilters();
      }
    };
    if (resave) {
      Source.resaveUsers(users, updateEach)
    }
    else {
      Source.updateUsers(users, updateEach);
    }
  }
  deleteUsers(users) {
    let that = this;
    Source.deleteUsers(users, (error) => {
      if (!error) {
        let allItems = _.difference(this.state.allItems, users);
        that.setState({allItems});
        that.applyFilters();
      }
    });
  }
  setCurrentPage(currentPage, init) {
    let count = Math.ceil(this.state.filteredItems.length / this.state.size);
    // if there no results
    if (!count) {
      ++count;
    }
    if (!currentPage || typeof currentPage !== 'number' || currentPage > count) {
      currentPage = 1;
    }
    let offset = (currentPage - 1) * this.state.size;
    let pagedItems = this.state.filteredItems.slice(offset, offset + this.state.size);
    let links = this.state.pageLinksOnScreen;
    let pages;
    if (currentPage <= links) {
      pages = _.range(1, count + 1, 1);
    }
    else {
      if (count - currentPage > links) {
        pages = _.range(currentPage - Math.ceil(links/2), currentPage + Math.ceil(links/2), 1);
      }
      else {
        pages = _.range(count - links, count, 1);
      }
    }
    let lastPage = count;
    if (!init) {
      this.setState({pagedItems, pages, currentPage, lastPage});
    }
    else {
      this.state.pagedItems = pagedItems;
      this.state.pages = pages;
      this.state.currentPage = currentPage;
      this.state.lastPage = lastPage;
    }
  }
  setSize(value) {
    let size = value[0];
    this.setState({size});
    this.setCurrentPage(this.state.currentPage);
  }
  showMessage(message) {
    this.setState({message});
  }
}

export default AltInstance.createStore(AppStore, 'AppStore');