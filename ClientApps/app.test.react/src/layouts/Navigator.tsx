import { Box, Typography, Grid as MuiGrid, Tabs, Tab } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const screens = [
  { route: "inventory" },
  { route: "products" },
  { route: "categories" },
];

const lastPathSegment = (path: string) => {
  const segments = path.split("/");
  return segments[segments.length - 1];
};

export default function Navigator() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = lastPathSegment(location.pathname);
  const currentScreen = screens.find(({ route }) => route === currentRoute);
  const [value, setValue] = useState<number | undefined>(undefined);
  const classes = useStyles();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/admin/inventory");
        break;
      case 1:
        navigate("/admin/products");
        break;
      case 2:
        navigate("/admin/categories");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (currentScreen?.route) {
      case "inventory":
        setValue(0);
        break;
      case "products":
        setValue(1);
        break;
      case "categories":
        setValue(2);
        break;
      default:
        break;
    }
  }, [currentScreen, value]);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="nav tabs example"
        variant="standard"
        className={classes.tabs}
      >
        <Tab label="Inventory" disableRipple />
        <Tab label="Products" disableRipple />
        <Tab label="Categories" disableRipple />
      </Tabs>
    </Box>
  );
}

const useStyles = makeStyles({
  tabs: {
    "& .MuiTabs-indicator": {
      position: "absolute",
      height: "0",
      zIndex: 1,
      borderBottom: 0,
    },
    "& .Mui-selected": {
      // borderTop: `1px solid #BDBDBD`,
      // borderLeft: `1px solid #BDBDBD`,
      // borderRight: `1px solid #BDBDBD`,
      borderBottom: `1px solid #BDBDBD`,
    },
    "& .MuiButtonBase-root": {},
  },
});
