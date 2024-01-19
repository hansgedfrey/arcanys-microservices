import { Button, Grid as MuiGrid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

function Products() {
  const classes = useStyles();

  return (
    <Box pt={4} pb={4}>
      <MuiGrid container pl={2} pr={2}>
        <MuiGrid item xs={10}>
          <Typography variant="h4">Arcanys E-Commerce App</Typography>
          <Typography variant="caption" pt={1}>
            A ReactJS client application for the .NET Microservices training.
          </Typography>
        </MuiGrid>
        <MuiGrid item textAlign="center">
          <Button>Login</Button>
        </MuiGrid>
        <MuiGrid item textAlign="center">
          <Button>Signup</Button>
        </MuiGrid>
      </MuiGrid>
    </Box>
  );
}

const useStyles = makeStyles({
  banner: {},
});

export default Products;
