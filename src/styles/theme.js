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
           
      },
    },
  },
});

export default theme;