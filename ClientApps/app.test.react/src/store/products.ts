import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  HttpValidationProblemDetails,
  ProductDto,
  ProductSortOptions,
  RemoveProductCommand,
  SearchProductsResponse,
  UpsertProductCommand,
} from "../api/products-api";

const initialState: {
  isSubmitting: boolean;
  isLoadingProducts: boolean;
  isLoadingProductInfo: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  products?: SearchProductsResponse;
  selectedProduct?: ProductDto;
  errors?: HttpValidationProblemDetails;
} = {
  isSubmitting: false,
  isLoadingProducts: false,
  isLoadingProductInfo: false,
  isSuccess: false,
  isFailure: false,
};

export const getProductsAsync = createAsyncThunk<
  SearchProductsResponse,
  {
    page?: number;
    query?: string;
    categoryId?: string;
    sortOption: ProductSortOptions;
  },
  { state: RootState }
>(
  "products",
  (
    payload: {
      page?: number;
      query?: string;
      categoryId?: string;
      sortOption: ProductSortOptions;
    },
    { getState, rejectWithValue }
  ) =>
    getState()
      .apis.productsClient.products(
        payload.query,
        payload.categoryId,
        payload.page,
        payload.sortOption
      )
      .catch(rejectWithValue)
);

export const getProductinfoAsync = createAsyncThunk<
  ProductDto,
  { productId: string },
  { state: RootState }
>(
  "product/{productId}",
  (payload: { productId: string }, { getState, rejectWithValue }) =>
    getState()
      .apis.productsClient.getProductInfo(payload.productId)
      .catch(rejectWithValue)
);

export const upsertProductAsync = createAsyncThunk<
  string,
  UpsertProductCommand,
  { state: RootState; rejectValue: HttpValidationProblemDetails }
>("product/upsertProduct", (payload, { getState, rejectWithValue, signal }) =>
  getState().apis.productsClient.upsertProduct(payload).catch(rejectWithValue)
);

export const removeProductAsync = createAsyncThunk<
  void,
  RemoveProductCommand,
  { state: RootState; rejectValue: HttpValidationProblemDetails }
>("product/removeProduct", (payload, { getState, rejectWithValue, signal }) =>
  getState().apis.productsClient.removeProduct(payload).catch(rejectWithValue)
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductsAsync.pending, (state) => {
        state.isLoadingProducts = true;
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.isLoadingProducts = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProductsAsync.rejected, (state, action) => {
        state.isLoadingProducts = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(getProductinfoAsync.pending, (state) => {
        state.isLoadingProductInfo = true;
      })
      .addCase(getProductinfoAsync.fulfilled, (state, action) => {
        state.isLoadingProductInfo = false;
        state.isSuccess = true;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductinfoAsync.rejected, (state, action) => {
        state.isLoadingProductInfo = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(upsertProductAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(upsertProductAsync.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(upsertProductAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(removeProductAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(removeProductAsync.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(removeProductAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      });
  },
});

export default productsSlice.reducer;
