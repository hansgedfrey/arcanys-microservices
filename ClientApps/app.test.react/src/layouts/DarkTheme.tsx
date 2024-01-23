import { createTheme } from "@mui/material";
import { Colors } from ".";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: Colors.Primary,
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
});

export default darkTheme;
