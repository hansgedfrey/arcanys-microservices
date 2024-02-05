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
  MenuItem,
  InputLabel,
  FormControl,
  Select as MuiSelect,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Backspace";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { AdminScreen, Colors } from "../../../layouts";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getProductsAsync } from "../../../store/products";
import { Button, ProgressSpinner } from "../../../components";
// import AddProductInventory from "./AddInventoryItem";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";
import { MoneyFormat } from "../../../utils";
import { format } from "date-fns";
import { getCategoriesAsync } from "../../../store/categories";
import {
  getInventoryItemAsync,
  getInventoryItemsAsync,
} from "../../../store/inventoryItems";
import { InventoryItemSortOptions } from "../../../api/products-api";

interface InventoryItemSearchParams {
  page: number;
  query: string;
  sortOption: InventoryItemSortOptions;
}

const initialSearchState: InventoryItemSearchParams = {
  page: 1,
  query: "",
  sortOption: InventoryItemSortOptions.Created,
};

export default function InventoryItem() {
  const dispatch = useAppDispatch();
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"));
  const { inventoryItems, isLoadingInventoryItems } = useAppSelector(
    (state) => state.inventoryItems
  );
  const { categories } = useAppSelector((state) => state.categories);
  const [openEditProduct, setOpenEditProduct] = useState<boolean>(false);
  const [openDeleteProduct, setOpenDeleteProduct] = useState<boolean>(false);
  const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const [inventoryItemSearchParams, setInventoryItemSearchParams] =
    useState<InventoryItemSearchParams>(initialSearchState);

  const searchProducts = debounce((query: string) => {
    setInventoryItemSearchParams({ ...inventoryItemSearchParams, query });
  }, 999);

  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setInventoryItemSearchParams({ ...inventoryItemSearchParams, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(getInventoryItemsAsync(inventoryItemSearchParams));
  }, [inventoryItemSearchParams]);

  useEffect(() => {
    dispatch(getCategoriesAsync({ page: 1 }));
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: Colors.Primary,
      color: theme.palette.common.white,
    },
  }));

  return (
    <AdminScreen>
      <MuiGrid container spacing={2}>
        <MuiGrid item md={8} xs={12}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Search"
              fullWidth
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                searchProducts(evt.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoadingInventoryItems ? (
                      <ProgressSpinner small />
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </MuiGrid>
        <MuiGrid item md={4} xs={12}>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <MuiSelect label="Select Category">
                {categories?.results?.map((item) => {
                  return (
                    <MenuItem value={item.categoryId} key={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </MuiSelect>
            </FormControl>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                dispatch(getCategoriesAsync({ page: 1 })).then((result) => {
                  setOpenAddProduct(true);
                });
                Promise.all([
                  dispatch(getCategoriesAsync({ page: 1 })),
                  dispatch(getProductsAsync({ page: 1 })),
                ]).then(() => {
                  setOpenAddProduct(true);
                });
              }}
            >
              {!isSmallScreen ? "Add new" : <AddIcon />}
            </Button>
          </Stack>
        </MuiGrid>
        <MuiGrid item md={2} xs={12}></MuiGrid>
        <MuiGrid item xs={12}>
          {inventoryItems && !isLoadingInventoryItems ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell component="th" scope="col" align="left">
                        Created
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Name
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Details
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        SKU
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Category
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Unit Price
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Quantity
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Total
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        scope="col"
                        align="right"
                        width="10%"
                      >
                        Actions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryItems.results?.map((item, index) => {
                      return (
                        <TableRow
                          hover
                          key={`${item.inventoryItemId} - ${item.product?.productName}`}
                        >
                          <TableCell component="th" scope="row">
                            {format(item.created!, "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.product?.productName}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.details}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.product?.sku}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.product?.category?.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {MoneyFormat(item.product?.price)}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.quantity} item(s)
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {MoneyFormat(item.quantity! * item.product?.price!)}
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="right"
                            >
                              <Tooltip title="Edit">
                                <IconButton
                                  aria-label="edit"
                                  onClick={() => {
                                    dispatch(
                                      getInventoryItemAsync({
                                        inventoryItemId: item.inventoryItemId!,
                                      })
                                    ).then(() => {
                                      dispatch(
                                        getCategoriesAsync({ page: 1 })
                                      ).then((result) => {
                                        setOpenEditProduct(true);
                                      });
                                    });
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove">
                                <IconButton
                                  aria-label="delete"
                                  color="error"
                                  onClick={async () => {
                                    await dispatch(
                                      getInventoryItemAsync({
                                        inventoryItemId: item.inventoryItemId!,
                                      })
                                    ).then(() => {
                                      setOpenDeleteProduct(true);
                                    });
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
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
                  count={inventoryItems?.pageCount || 0}
                  page={inventoryItems?.currentPage}
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
      {/* <AddProductInventory
        open={openAddProduct === true}
        ok={() => setOpenAddProduct(false)}
        cancel={() => setOpenAddProduct(false)}
      /> */}
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
