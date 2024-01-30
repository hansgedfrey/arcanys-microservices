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
  Stack,
  tableCellClasses,
  styled,
  Box,
  Pagination,
  debounce,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { AdminScreen, Colors } from "../../../layouts";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getProductinfoAsync, getProductsAsync } from "../../../store/products";
import { Button, ProgressSpinner } from "../../../components";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";
import { MoneyFormat } from "../../../utils";
import { format } from "date-fns";
import { getCategoriesAsync } from "../../../store/categories";

interface ProductSearchParams {
  page: number;
  query: string;
}

const initialSearchState: ProductSearchParams = {
  page: 1,
  query: "",
};

function Products() {
  const dispatch = useAppDispatch();
  const { products, isLoadingProducts } = useAppSelector(
    (state) => state.products
  );
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"));
  const [openEditProduct, setOpenEditProduct] = useState<boolean>(false);
  const [openDeleteProduct, setOpenDeleteProduct] = useState<boolean>(false);
  const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const [productSearchParams, setProductSearchParams] =
    useState<ProductSearchParams>(initialSearchState);

  const searchProducts = debounce((query: string) => {
    setProductSearchParams({ ...productSearchParams, query });
  }, 999);

  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setProductSearchParams({ ...productSearchParams, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(getProductsAsync(productSearchParams));
  }, [productSearchParams]);

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
          <Stack direction="row" spacing={2}>
            <TextField
              label="Search"
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                searchProducts(evt.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoadingProducts ? (
                      <ProgressSpinner small />
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                dispatch(getCategoriesAsync({ page: 1 })).then((result) => {
                  setOpenAddProduct(true);
                });
              }}
            >
              {!isSmallScreen ? "Add new Product" : <AddIcon />}
            </Button>
          </Stack>
        </MuiGrid>
        <MuiGrid item xs={12}>
          {products && !isLoadingProducts ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell component="th" scope="col" align="left">
                        Added
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Name
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Description
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        SKU
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Price
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        scope="col"
                        align="center"
                        width="10%"
                      >
                        Actions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.results?.map((item, index) => {
                      return (
                        <TableRow
                          hover
                          key={`${item.productId} - ${item.productName}`}
                        >
                          <TableCell component="th" scope="row">
                            {format(item.created!, "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.productName}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.description}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.sku}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {MoneyFormat(item.price)}
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => {
                                  dispatch(
                                    getProductinfoAsync({
                                      productId: item.productId!,
                                    })
                                  ).then(() => {
                                    setOpenEditProduct(true);
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
                                    getProductinfoAsync({
                                      productId: item.productId!,
                                    })
                                  ).then(() => {
                                    setOpenDeleteProduct(true);
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
                  count={products?.pageCount || 0}
                  page={products?.currentPage}
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
      <AddProduct
        open={openAddProduct === true}
        ok={() => setOpenAddProduct(false)}
        cancel={() => setOpenAddProduct(false)}
      />
      <EditProduct
        open={openEditProduct === true}
        ok={() => setOpenEditProduct(false)}
        cancel={() => setOpenEditProduct(false)}
      />
      <DeleteProduct
        open={openDeleteProduct === true}
        ok={() => setOpenDeleteProduct(false)}
        cancel={() => setOpenDeleteProduct(false)}
      />
    </AdminScreen>
  );
}

export default Products;
