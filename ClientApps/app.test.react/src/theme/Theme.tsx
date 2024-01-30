import { createTheme, Typography } from "@mui/material";
import {} from "@mui/material/styles";
import { Colors } from "../layouts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
      styleOverrides: { root: { borderRadius: 4 } },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
        fullWidth: true,
      },
    },
    MuiInputBase: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
      },
      styleOverrides: {
        root: {},
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 16,
        },
      },
    },
  },
});

export default darkTheme;
