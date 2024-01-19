import {
  Grid as MuiGrid,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  Typography,
} from "@mui/material";

function Products() {
  return (
    <MuiGrid container>
      <MuiGrid item xs={12}>
        <Typography variant="h4">Products</Typography>
        <MuiButton onClick={() => console.log("component 1")}>
          Add Product
        </MuiButton>
      </MuiGrid>
    </MuiGrid>
  );
}

export default Products;
