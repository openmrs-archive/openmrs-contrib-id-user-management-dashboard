'use strict';

import axios from 'axios';

import AppActions from '../actions/AppActions';

const AppSource = {
  getData: () => {
    axios.get(`/admin/user-dashboard/api/users`).then((response) => {
      AppActions.setGridData(response.data);
    });
  }
};

export default AppSource;