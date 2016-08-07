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
      // temporary - need to fix groups API
      // AppActions.setGroupList(response.data);
    });
  }
};

export default AppSource;