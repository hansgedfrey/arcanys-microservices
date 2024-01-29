import { ChangeEvent, useEffect, useState } from "react";
import {
  Grid as MuiGrid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Button,
  Stack,
  tableCellClasses,
  styled,
  Box,
  Pagination,
  debounce,
  TextField,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getCategoriesAsync,
  getCategoryInfoAsync,
} from "../../../store/categories";
import AdminScreen from "../../../layouts/AdminScreen";
import { Colors } from "../../../layouts";
import { ProgressSpinner } from "../../../components";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";

interface CategorySearchParams {
  page: number;
  query: string;
}

const initialSearchState: CategorySearchParams = {
  page: 1,
  query: "",
};

function Categories() {
  const dispatch = useAppDispatch();
  const { categories, isLoadingCategories } = useAppSelector(
    (state) => state.categories
  );
  const [openEditCategory, setOpenEditCategory] = useState<boolean>(false);
  const [openDeleteCategory, setOpenDeleteCategory] = useState<boolean>(false);
  const [categorySearchParams, setCategorySearchParams] =
    useState<CategorySearchParams>(initialSearchState);

  const searchClients = debounce((query: string) => {
    setCategorySearchParams({ ...categorySearchParams, query });
  }, 999);

  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setCategorySearchParams({ ...categorySearchParams, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(getCategoriesAsync(categorySearchParams));
  }, [categorySearchParams]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: Colors.Primary,
      color: theme.palette.common.white,
    },
  }));

  return (
    <AdminScreen>
      <MuiGrid container spacing={2}>
        <MuiGrid item xs={12}>
          <TextField
            label="Search"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              searchClients(evt.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isLoadingCategories ? (
                    <ProgressSpinner small />
                  ) : (
                    <SearchIcon />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </MuiGrid>
        <MuiGrid item xs={12}>
          {categories && !isLoadingCategories ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell component="th" scope="col" align="left">
                        Name
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Description
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        scope="col"
                        align="left"
                        width="10%"
                      >
                        Actions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.results?.map((item, index) => {
                      return (
                        <TableRow
                          hover
                          key={`${item.categoryId} - ${item.name}`}
                        >
                          <TableCell component="th" scope="row">
                            {item.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.description}
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => {
                                  dispatch(
                                    getCategoryInfoAsync({
                                      categoryId: item.categoryId!,
                                    })
                                  ).then(() => {
                                    setOpenEditCategory(true);
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <IconButton
                                aria-label="delete"
                                size="small"
                                color="error"
                                onClick={async () => {
                                  await dispatch(
                                    getCategoryInfoAsync({
                                      categoryId: item.categoryId!,
                                    })
                                  ).then(() => {
                                    setOpenDeleteCategory(true);
                                  });
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="flex-end" pt={1.5} pr={7}>
                <Pagination
                  count={categories?.pageCount || 0}
                  page={categories?.currentPage}
                  onChange={handlePageChange}
                  size="small"
                  color="primary"
                  shape="rounded"
                />
              </Box>
            </>
          ) : (
            <Box textAlign="center" pt={4}>
              <ProgressSpinner />
            </Box>
          )}
        </MuiGrid>
      </MuiGrid>
      <EditCategory
        open={openEditCategory === true}
        ok={() => setOpenEditCategory(false)}
        cancel={() => setOpenEditCategory(false)}
      />
      <DeleteCategory
        open={openDeleteCategory === true}
        ok={() => setOpenDeleteCategory(false)}
        cancel={() => setOpenDeleteCategory(false)}
      />
    </AdminScreen>
  );
}

export default Categories;