import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  CategoryDto,
  HttpValidationProblemDetails,
  SearchCategoriesResponse,
} from "../api/products-api";

const initialState: {
  isSubmitting: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  categories?: SearchCategoriesResponse;
  selectedCategory?: CategoryDto;
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
  (
    payload: { page: number; query?: string },
    { getState, rejectWithValue, signal }
  ) =>
    getState()
      .apis.categoriesClient.categories(payload.query, payload.page)
      .catch(rejectWithValue)
);

export const getCategoryInfoAsync = createAsyncThunk<
  CategoryDto,
  { categoryId: string },
  { state: RootState }
>(
  "category/{categoryId}",
  (payload: { categoryId: string }, { getState, rejectWithValue, signal }) =>
    getState()
      .apis.categoriesClient.getCategoryInfo(payload.categoryId)
      .catch(rejectWithValue)
);

export const categoriesSlice = createSlice({
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
      })
      .addCase(getCategoryInfoAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(getCategoryInfoAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        state.selectedCategory = action.payload;
      })
      .addCase(getCategoryInfoAsync.rejected, (state) => {
        state.isSubmitting = false;
        state.isFailure = false;
      });
  },
});

export default categoriesSlice.reducer;
