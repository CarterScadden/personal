import React from 'react';
import {AppBar} from '@material-ui/core';

import './Header.scss';

function Header() {
  return (
    <AppBar id="appbar-header">
      <span>Hello</span>
    </AppBar>
  );
}

export default Header