import {
  Grid as MuiGrid,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  Typography,
  ListItem,
  ListItemButton,
  List,
  ListItemText,
  Divider,
} from "@mui/material";
import Categories from "./Categories";
import { useAppDispatch, useAppSelector } from "../../store";
import { useEffect } from "react";
import { getCategoryInfoAsync } from "../../store/categories";
import { getProductsAsync } from "../../store/products";

function Products() {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory } = useAppSelector(
    (state) => state.categories
  );
  const { products, isSubmitting } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (categories && !selectedCategory) {
      dispatch(
        getCategoryInfoAsync({ categoryId: categories.results![0].categoryId! })
      );
    }
  }, [dispatch, selectedCategory, categories]);

  useEffect(() => {
    dispatch(getProductsAsync({ categoryId: selectedCategory?.categoryId }));
  }, [dispatch, selectedCategory]);

  return (
    <MuiGrid container pl={2} pr={2}>
      <MuiGrid item xs={2}>
        <Categories />
      </MuiGrid>
      <MuiGrid item xs={10}>
        <Typography variant="h6">Products</Typography>
        <MuiGrid container>
          <MuiGrid item xs={12}>
            <List>
              {!isSubmitting &&
                products &&
                products.results?.map((item, index) => {
                  return (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText primary={item.productName} />
                        </ListItemButton>
                      </ListItem>
                      <Divider component="li" />
                    </>
                  );
                })}
            </List>
          </MuiGrid>
        </MuiGrid>
      </MuiGrid>
    </MuiGrid>
  );
}

export default Products;
