import React, { PropTypes } from 'react';
import { AppBar } from 'react-toolbox/lib/app_bar';
import theme from './AppBar.scss';

const Header = ({ children, ...other }) => (
  <AppBar {...other} theme={theme}>
    App Example
    {children}
  </AppBar>
);

Header.propTypes = {
  children: PropTypes.node
};

export default Header;
