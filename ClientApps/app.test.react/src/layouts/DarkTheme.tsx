import { createTheme, Typography } from "@mui/material";
import {} from "@mui/material/styles";
import { Colors } from ".";

const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: Colors.Primary,
    },
    secondary: {
      main: Colors.LightGrey,
    },
  },
  typography: {
    fontFamily: ["Sons", "Helvetica", "Arial", "sans-serif"].join(","),
    allVariants: {
      lineHeight: 1.5,
    },
    h1: {
      fontWeight: 500,
      fontSize: "4.5rem",
      "@media(min-width: 768px)": {
        fontSize: "5.00rem",
      },
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.75rem",
      "@media(min-width: 768px)": {
        fontSize: "2rem",
      },
    },
    fontWeightBold: 500,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    fontWeightLight: 300,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiFilledInput: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
        fullWidth: true,
      },
    },
  },
});

export default darkTheme;
