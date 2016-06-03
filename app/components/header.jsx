import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import style from './style';

const MainAppBar = () => (
  <AppBar className={style.appbar} flat>
    <h1 className={style.title}>User Management Dashboard</h1>
  </AppBar>
);

export default MainAppBar;
