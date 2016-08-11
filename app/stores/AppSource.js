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
  }
};

export default AppSource;