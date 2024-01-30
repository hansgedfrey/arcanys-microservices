import { Box, Tabs, Tab } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Primary } from "../theme/Colors";

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
  const [value, setValue] = useState<number>(0);
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
        <Tab label="Inventory" />
        <Tab label="Products" />
        <Tab label="Categories" />
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
      borderBottom: `1px solid ${Primary}`,
    },
    "& .MuiButtonBase-root": {},
  },
});
