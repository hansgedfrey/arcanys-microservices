import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  HttpValidationProblemDetails,
  ProductDto,
  SearchProductsResponse,
} from "../api/products-api";
import { getApis } from "./apiSelector";

const initialState: {
  isSubmitting: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  products?: SearchProductsResponse;
  selectedProduct?: ProductDto;
  problem?: HttpValidationProblemDetails;
} = {
  isSubmitting: false,
  isSuccess: false,
  isFailure: false,
};

export const getProductsAsync = createAsyncThunk<
  SearchProductsResponse,
  { page?: number; query?: string; categoryId?: string },
  { state: RootState }
>(
  "products",
  (
    payload: { page?: number; query?: string; categoryId?: string },
    { getState, rejectWithValue }
  ) =>
    getApis(getState())
      .productsClient.products(payload.query, payload.categoryId, payload.page)
      .catch(rejectWithValue)
);

export const getProductinfoAsync = createAsyncThunk<
  ProductDto,
  { productId: string },
  { state: RootState }
>(
  "product/{productId}",
  (payload: { productId: string }, { getState, rejectWithValue }) =>
    getApis(getState())
      .productsClient.getProductInfo(payload.productId)
      .catch(rejectWithValue)
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductsAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProductsAsync.rejected, (state) => {
        state.isSubmitting = false;
        state.isFailure = false;
      })
      .addCase(getProductinfoAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(getProductinfoAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductinfoAsync.rejected, (state) => {
        state.isSubmitting = false;
        state.isFailure = false;
      });
  },
});

export default productsSlice.reducer;
