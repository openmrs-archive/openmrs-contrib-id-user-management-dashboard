import _ from 'lodash';

import AltInstance    from '../lib/AltInstance';
import Actions        from '../actions/AppActions';

import TempData       from './temp';

class AppStore {
  constructor() {
    let {setGridData, setFilters, setQuery, setColumns, updateUser, setCurrentPage} = Actions;

    this.bindListeners({
      setGridData: setGridData,
      setFilters: setFilters,
      setQuery: setQuery,
      setColumns: setColumns,
      updateUser: updateUser,
      setCurrentPage: setCurrentPage
    });

    this.applyFilters = this.applyFilters.bind(this);

    this.state = {
      allItems: [],
      filteredItems: [],
      allColumns: {
        id: 'ID',
        firstName: 'First Name',
        lastName: 'Last Name',
        inLDAP: 'LDAP',
        inMongo: 'Mongo',
        groups: 'Groups'
      },
      columns: ['id', 'lastName', 'inLDAP'],
      allFilters: {
        inLDAP: 'In LDAP',
        inMongo: 'In Mongo'
      },
      filters: [],
      query: '',
      allGroups: ['admin', 'user', 'writer'],
      userModel: {},
      defaultModel: {
        firstName: {type: String},
        lastName: {type: String},
        id: {type: String},
        inMongo: {type: String},
        inLDAP: {type: String},
        groups: {type: [String]}
      },
      // pagination
      pagedItems: [],
      size: 10,
      currentPage: 1,
      lastPage: 1,
      pages: [],
      pageLinksOnScreen: 10
    };
    // temporary data
    this.state.allItems = TempData;
    this.applyFilters(true);
  }
  
  applyFilters(init) {
    let that = this;
    // temporary (demo only)
    let filteredFirstItems = _.filter(this.state.allItems, (item) => {
      var query = item.firstName.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1
          || item.lastName.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1;
      if (query) {
        var state = true;
        _.each(that.state.filters, (el) => {
          state && (state = 'Yes' === item[el]);
        });
        return state;
      }
      return false;
    });
    let filteredItems = _.map(filteredFirstItems, (item) => {
      let obj = {};
      for (var key in item) {
        if (key && that.state.columns.indexOf(key) !== -1) {
          obj[key] = item[key];
        }
      }
      return obj;
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

  setGridData(allItems) {
    return this.setState({allItems});
  }
  setFilters(filters) {
    this.setState({filters});
    this.applyFilters();
  }
  setQuery(query) {
    this.setState({query});
    this.applyFilters();
  }
  setColumns(columns) {
    this.setState({columns});
    this.applyFilters();
  }
  updateUser(user) {
    let items = this.state.allItems;
    let old = _.find(items, (item) => {
      return user.id === item.id;
    });
    let index = items.indexOf(old);
    if (index !== -1) items[index] = user;
    this.setState({allItems: items});
    this.applyFilters();
  }
  setCurrentPage(currentPage, init) {
    let count = Math.ceil(this.state.filteredItems.length / this.state.size);
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
}

export default AltInstance.createStore(AppStore, 'AppStore');