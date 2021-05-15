import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#e84545",
      dark: "#903749",
    },
    secondary: {
      main: "#53354a",
    },
    background: {
      default: "#2b2e4a",
      paper: "#2b2e4a",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        h1: {
          borderBottom: "3px solid #e84545",
          marginBottom: "1rem",
          display: "block",
        },
        a: {
          color: "#e84545",
        },
        p: {
          margin: "8px",
        },
      },
    },
  },
});

export default theme;
