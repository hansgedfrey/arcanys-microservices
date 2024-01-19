import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store";
import { getCategoriesAsync, getCategoryInfoAsync } from "../store/categories";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";

function Categories() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const [selected, setSelected] = useState<string | undefined>();
  const classes = useStyles();

  useEffect(() => {
    dispatch(getCategoriesAsync({ page: 1 }));
  }, [dispatch]);

  return (
    <>
      <Box pr={2} pl={2}>
        <Typography variant="h6">Categories</Typography>
        <List>
          {categories &&
            categories.results?.map((item, index) => {
              return (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={selected === item.categoryId}
                      onClick={async () => {
                        setSelected(item.categoryId);
                        await dispatch(
                          getCategoryInfoAsync({
                            categoryId: item.categoryId!,
                          })
                        );
                      }}
                    >
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                  <Divider component="li" />
                </>
              );
            })}
        </List>
      </Box>
    </>
  );
}
const useStyles = makeStyles({
  list: {
    backgroundColor: "lightgrey",
  },
});
export default Categories;
