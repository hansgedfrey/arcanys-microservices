import {
  Grid as MuiGrid,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  Typography,
} from "@mui/material";
import Categories from "./Categories";
import { useAppSelector } from "../store";

function Products() {
  const { selectedCategory } = useAppSelector((state) => state.categories);

  return (
    <MuiGrid container pl={2} pr={2}>
      <MuiGrid item xs={2}>
        <Categories />
      </MuiGrid>
      <MuiGrid item xs={10}>
        <Typography variant="h6">{selectedCategory?.name}</Typography>
      </MuiGrid>
    </MuiGrid>
  );
}

export default Products;
