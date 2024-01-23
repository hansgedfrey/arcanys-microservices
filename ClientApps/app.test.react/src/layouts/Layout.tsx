import React, { FC, ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import Banner from "./Banner";

function Layout({ children }: { children?: ReactNode }) {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <Grid>
        <Row>
          <Banner />
        </Row>
        <Row>{children ?? ""}</Row>
      </Grid>
    </>
  );
}

interface RowProps {
  className?: string;
  classes?: Record<string, any>;
  children?: React.ReactNode;
}

const Grid: FC<{
  className?: string;
  classes?: Record<string, any>;
  children?: React.ReactNode;
}> = (props) => {
  const { children, className } = props;
  const classes = useStyles(props);
  return <Box className={clsx(classes.root, className)}>{children}</Box>;
};

const Row: FC<RowProps> = (props) => {
  const { children, className } = props;
  const classes = useStyles(props);
  return (
    <Box className={classes.row}>
      <Box className={clsx(className, classes.rowContent)}>{children}</Box>
    </Box>
  );
};

const useStyles = makeStyles(
  {
    root: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    row: {
      display: "flex",
      justifyContent: "center",
      paddingLeft: 20,
      paddingRight: 20,
      "@media(min-width: 768px)": {
        "&:last-child": {
          flex: "1 0 auto",
        },
      },
    },
    rowContent: {
      width: "100%",
      "@media(min-width: 768px)": {
        width: 1500,
      },
    },
  },
  { name: "Layout" }
);

export default Layout;
