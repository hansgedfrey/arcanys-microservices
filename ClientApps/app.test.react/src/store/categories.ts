import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  HttpValidationProblemDetails,
  SearchCategoriesResponse,
} from "../api/products-api";
import { getApis } from "./apiSelector";

const initialState: {
  isSubmitting: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  categories?: SearchCategoriesResponse;
  problem?: HttpValidationProblemDetails;
} = {
  isSubmitting: false,
  isSuccess: false,
  isFailure: false,
};

export const getCategoriesAsync = createAsyncThunk<
  SearchCategoriesResponse,
  { page: number; query?: string },
  { state: RootState }
>(
  "categories",
  (payload: { page: number; query?: string }, { getState, rejectWithValue }) =>
    getApis(getState())
      .categoriesClient.categories(payload.query, payload.page)
      .catch(rejectWithValue)
);

export const cartsSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoriesAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(getCategoriesAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getCategoriesAsync.rejected, (state) => {
        state.isSubmitting = false;
        state.isFailure = false;
      });
  },
});

export default cartsSlice.reducer;
