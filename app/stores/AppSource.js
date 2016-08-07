import axios from 'axios';

import AppActions from '../actions/AppActions';

const AppSource = {
  getUsersList: {
    remote(state) {
      return axios.get(`/admin/user-dashboard/api/users`);
    },
    
    success: AppActions.setGridData,
    error: () => {},
  }
};