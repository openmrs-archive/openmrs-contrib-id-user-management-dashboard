'use strict';

import axios from 'axios';

import AppActions from '../actions/AppActions';

const API_ROOT = '/admin/user-dashboard/api';

const AppSource = {
  getUsers: () => {
    return axios.get(`${API_ROOT}/users`).then((response) => {
      AppActions.setGridData(response.data);
    });
  },
  getGroups: () => {
    return axios.get(`${API_ROOT}/groups`).then((response) => {
      AppActions.initGroupList(response.data);
    });
  },
  updateUsers: (users, callback) => {
    return axios.post(`${API_ROOT}/users`, {users}).then(() => {
      if (callback) {
        callback();
      }
    });
  },
  deleteUsers: (users, callback) => {
    return axios.delete(`${API_ROOT}/users`, {data: {users}}).then(() => {
      if (callback) {
        callback();
      }
    });
  }           ,
  registerLDAP: (users, callback) => {
    return axios.post(`${API_ROOT}/users/ldap`, {data: {users}}).then(() => {
      if (callback) {
        callback();
      }
    });
  },
  registerMongo: (users, callback) => {
    return axios.post(`${API_ROOT}/users/mongo`, {data: {users}}).then(() => {
      if (callback) {
        callback();
      }
    });
  }
};

export default AppSource;