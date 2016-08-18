'use strict';

import axios from 'axios';

import AppActions from '../actions/AppActions';

const API_ROOT = '/admin/user-dashboard/api';

let handleResponse = (response, next) => {
  let json = response.data;
  if (json && 'OK' === json.status) {
    next(json.data);
  }
  else {
    // TODO: add error message on UI
    next()
  }
};

const AppSource = {
  getUsers: () => {
    return axios.get(`${API_ROOT}/users`).then((response) => {
      handleResponse(response, (data) => {
        AppActions.setGridData(data);
      });
    });
  },
  getGroups: () => {
    return axios.get(`${API_ROOT}/groups`).then((response) => {
      handleResponse(response, (data) => {
        AppActions.initGroupList(data);
      });
    });
  },
  updateUsers: (users, callback) => {
    return axios.post(`${API_ROOT}/users`, {users}).then((response) => {
      handleResponse(response, (data) => {
        if (callback) {
          callback(data);
        }
      });
    });
  },
  deleteUsers: (users, callback) => {
    return axios.delete(`${API_ROOT}/users`, {data: {users}}).then((response) => {
      handleResponse(response, () => {
        if (callback) {
          callback();
        }
      });
    });
  }           ,
  resaveUsers: (users, callback) => {
    return axios.post(`${API_ROOT}/users/resave`, {users}).then((response) => {
      handleResponse(response, (data) => {
        if (callback) {
          callback(data);
        }
      });
    });
  },
};

export default AppSource;