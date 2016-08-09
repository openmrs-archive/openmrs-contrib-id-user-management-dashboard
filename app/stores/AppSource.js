'use strict';

import axios from 'axios';

import AppActions from '../actions/AppActions';

const AppSource = {
  getUsers: () => {
    return axios.get(`/admin/user-dashboard/api/users`).then((response) => {
      AppActions.setGridData(response.data);
    });
  },
  getGroups: () => {
    return axios.get(`/admin/user-dashboard/api/groups`).then((response) => {
      AppActions.initGroupList(response.data);
    });
  }
};

export default AppSource;