import React from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';

import { Box } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

// primary 3 color : 757575
// accent (secondary) 2 color: f50057
const darkPalette: PaletteOptions = {
  primary: { main: '#0097a7' },
  secondary: { main: '#ff4081' },
  background: { default: 'rgb(48, 48, 48)' },
  text: { primary: '#fff' },
  error: { main: '#CF6679' },
  warning: { main: '#ff9800' },
  info: { main: '#2196f3' },
  success: { main: '#4caf50' },
}

// const light: PaletteOptions = {

// }

const getTheme = (p: PaletteOptions) => {
  let overwrites = {};
  return createMuiTheme({
    palette: p,
    overrides: {
      
    }
  }, overwrites);
}

function App() {
  const theme = getTheme(darkPalette);
  const [useBase, /* useSetBase */] = React.useState<CSSProperties>({
    fontFamily: 'roboto',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default
  });

  return (
    <ThemeProvider theme={theme}>
      <Box style={useBase}>
        <Header />
        <Main />
      </Box>
    </ThemeProvider>
  );
}

export default App;
