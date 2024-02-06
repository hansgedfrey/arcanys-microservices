import { ChangeEvent, useCallback, useEffect, useState } from "react";
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
  Tooltip,
  TableSortLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Backspace";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
import AddInventoryItem from "./AddInventoryItem";
import {
  CategorySortOptions,
  ProductSortOptions,
} from "../../../api/products-api";

interface ProductSearchParams {
  page: number;
  query: string;
  sortOption: ProductSortOptions;
}

const initialSearchState: ProductSearchParams = {
  page: 1,
  query: "",
  sortOption: ProductSortOptions.Created,
};

export default function Products() {
  const dispatch = useAppDispatch();
  const { products, isLoadingProducts } = useAppSelector(
    (state) => state.products
  );
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"));
  const [openEditProduct, setOpenEditProduct] = useState<boolean>(false);
  const [openDeleteProduct, setOpenDeleteProduct] = useState<boolean>(false);
  const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const [openAddInventoryItem, setOpenAddInventoryItem] =
    useState<boolean>(false);
  const [productSearchParams, setProductSearchParams] =
    useState<ProductSearchParams>(initialSearchState);

  const searchProducts = debounce((query: string) => {
    setProductSearchParams({ ...productSearchParams, query });
  }, 999);

  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setProductSearchParams({ ...productSearchParams, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sort = useCallback(
    (sortOption: ProductSortOptions) => {
      setProductSearchParams({
        ...productSearchParams,
        sortOption,
      });
    },
    [productSearchParams]
  );

  const getSortOption = useCallback(
    (sortOption: ProductSortOptions) => {
      switch (sortOption) {
        case ProductSortOptions.Created:
          return productSearchParams.sortOption === ProductSortOptions.Created
            ? ProductSortOptions.CreatedDesc
            : ProductSortOptions.Created;
          break;
        case ProductSortOptions.ProductName:
          return productSearchParams.sortOption ===
            ProductSortOptions.ProductName
            ? ProductSortOptions.ProductNameDesc
            : ProductSortOptions.ProductName;
          break;
        case ProductSortOptions.CategoryName:
          return productSearchParams.sortOption ===
            ProductSortOptions.CategoryName
            ? ProductSortOptions.CategoryNameDesc
            : ProductSortOptions.CategoryName;
          break;
        case ProductSortOptions.UnitPrice:
          return productSearchParams.sortOption === ProductSortOptions.UnitPrice
            ? ProductSortOptions.UnitPriceDesc
            : ProductSortOptions.UnitPrice;
          break;
      }
    },
    [productSearchParams]
  );

  const getSortDirection = useCallback(() => {
    return productSearchParams.sortOption.endsWith("Desc") ? "desc" : "asc";
  }, [productSearchParams]);

  const getActiveState = useCallback(
    (sortOption: ProductSortOptions) => {
      switch (sortOption) {
        case ProductSortOptions.Created:
          return (
            productSearchParams.sortOption === ProductSortOptions.Created ||
            productSearchParams.sortOption === ProductSortOptions.CreatedDesc
          );
          break;
        case ProductSortOptions.ProductName:
          return (
            productSearchParams.sortOption === ProductSortOptions.ProductName ||
            productSearchParams.sortOption ===
              ProductSortOptions.ProductNameDesc
          );
          break;
        case ProductSortOptions.CategoryName:
          return (
            productSearchParams.sortOption ===
              ProductSortOptions.CategoryName ||
            productSearchParams.sortOption ===
              ProductSortOptions.CategoryNameDesc
          );
          break;
        case ProductSortOptions.UnitPrice:
          return (
            productSearchParams.sortOption === ProductSortOptions.UnitPrice ||
            productSearchParams.sortOption === ProductSortOptions.UnitPriceDesc
          );
          break;
      }
    },
    [productSearchParams]
  );

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
                dispatch(
                  getCategoriesAsync({
                    page: 1,
                    sortOption: CategorySortOptions.CategoryName,
                  })
                ).then((result) => {
                  setOpenAddProduct(true);
                });
              }}
            >
              {!isSmallScreen ? "Add new Product" : <AddIcon />}
            </Button>
          </Stack>
        </MuiGrid>
        <MuiGrid item xs={12}>
          {products ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        component="th"
                        scope="col"
                        align="left"
                        onClick={() =>
                          sort(getSortOption(ProductSortOptions.Created)!)
                        }
                      >
                        <TableSortLabel
                          active={getActiveState(ProductSortOptions.Created)}
                          IconComponent={ArrowDropDownIcon}
                          direction={getSortDirection()}
                        >
                          Created
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        scope="col"
                        align="left"
                        onClick={() =>
                          sort(getSortOption(ProductSortOptions.CategoryName)!)
                        }
                      >
                        <TableSortLabel
                          active={getActiveState(
                            ProductSortOptions.CategoryName
                          )}
                          IconComponent={ArrowDropDownIcon}
                          direction={getSortDirection()}
                        >
                          Category
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        scope="col"
                        align="left"
                        onClick={() =>
                          sort(getSortOption(ProductSortOptions.ProductName)!)
                        }
                      >
                        <TableSortLabel
                          active={getActiveState(
                            ProductSortOptions.ProductName
                          )}
                          IconComponent={ArrowDropDownIcon}
                          direction={getSortDirection()}
                        >
                          Product Name
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        Description
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="col" align="left">
                        SKU
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        scope="col"
                        align="left"
                        onClick={() =>
                          sort(getSortOption(ProductSortOptions.UnitPrice)!)
                        }
                      >
                        <TableSortLabel
                          active={getActiveState(ProductSortOptions.UnitPrice)}
                          IconComponent={ArrowDropDownIcon}
                          direction={getSortDirection()}
                        >
                          Unit Price
                        </TableSortLabel>
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
                            {item.category?.name}
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
                              <Tooltip title="Add to inventory">
                                <IconButton
                                  aria-label="add to inventory"
                                  color="success"
                                  onClick={async () => {
                                    await dispatch(
                                      getProductinfoAsync({
                                        productId: item.productId!,
                                      })
                                    ).then(() => {
                                      setOpenAddInventoryItem(true);
                                    });
                                  }}
                                >
                                  <InventoryIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    dispatch(
                                      getProductinfoAsync({
                                        productId: item.productId!,
                                      })
                                    ).then(() => {
                                      dispatch(
                                        getCategoriesAsync({
                                          page: 1,
                                          sortOption:
                                            CategorySortOptions.CategoryName,
                                        })
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
                                  aria-label="remove"
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
      <AddInventoryItem
        open={openAddInventoryItem === true}
        ok={() => setOpenAddInventoryItem(false)}
        cancel={() => setOpenAddInventoryItem(false)}
      />
    </AdminScreen>
  );
}
