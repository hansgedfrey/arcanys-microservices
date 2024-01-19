import {
  Box,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store";
import { getCategoriesAsync } from "../store/categories";

function Categories() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  console.log(process.env.PRODUCTS_ENDPOINT_URL);
  return (
    <>
      <Box>
        <MuiButton
          onClick={() => {
            var categories = dispatch(getCategoriesAsync({ page: 1 })).unwrap();
            console.log(categories);
          }}
        >
          Categories
        </MuiButton>
      </Box>
    </>
  );
}

export default Categories;
