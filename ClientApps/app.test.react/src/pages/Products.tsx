import {
  Grid as MuiGrid,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  Typography,
} from "@mui/material";
import Categories from "./Categories";

function Products() {
  return (
    <MuiGrid container pl={2} pr={2}>
      <MuiGrid item xs={2}>
        <Categories />
      </MuiGrid>
      <MuiGrid item xs={10}>
        <Typography variant="h4">Products</Typography>
        <MuiButton onClick={() => console.log("component 1")}>
          Add Product
        </MuiButton>
      </MuiGrid>
    </MuiGrid>
  );
}

export default Products;
