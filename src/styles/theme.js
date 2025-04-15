import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        p: {
          margin: 0,
        },
        h1: {
          margin: 0,
        },
        h2: {
          margin: 0,
        },
        h3: {
          margin: 0,
        },
        h4: {
          margin: 0,
        },
        '*': {
          boxSizing: 'border-box',
        },
        '*::before': {
          boxSizing: 'border-box',
        },
        '*::after': {
          boxSizing: 'border-box',
        },
        body: {
          height: '100%',
          margin: 0,
        },
        html: {
          height: '100%',
          margin: 0,
        },
        '.page-container': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        },
        '.content-wrap': {
          flex: 1,
        },
        hr: {
          margin: '0',
        },
        // '*': {
        //   outline: '1px dashed blue',
        // },
      },
    },
  },
});

export default theme;