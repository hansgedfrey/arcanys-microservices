import { Grid as MuiGrid, Typography } from "@mui/material";

function Products() {
  return (
    <MuiGrid container style={{ margin: 20 }}>
      <MuiGrid item xs={12}>
        <Typography variant="h4">Arcanys E-Commerce App</Typography>
      </MuiGrid>
    </MuiGrid>
  );
}

export default Products;
