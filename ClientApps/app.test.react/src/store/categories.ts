import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  CategoryDto,
  HttpValidationProblemDetails,
  RemoveCategoryCommand,
  SearchCategoriesResponse,
  UpsertCategoryCommand,
} from "../api/products-api";

const initialState: {
  isSubmitting: boolean;
  isLoadingCategories: boolean;
  isLoadingCategoryInfo: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  categories?: SearchCategoriesResponse;
  selectedCategory?: CategoryDto;
  errors?: HttpValidationProblemDetails;
} = {
  isSubmitting: false,
  isLoadingCategories: false,
  isLoadingCategoryInfo: false,
  isSuccess: false,
  isFailure: false,
};

export const getCategoriesAsync = createAsyncThunk<
  SearchCategoriesResponse,
  { page: number; query?: string },
  { state: RootState; rejectValue: HttpValidationProblemDetails }
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
  { state: RootState; rejectValue: HttpValidationProblemDetails }
>(
  "category/{categoryId}",
  (payload: { categoryId: string }, { getState, rejectWithValue, signal }) =>
    getState()
      .apis.categoriesClient.getCategoryInfo(payload.categoryId)
      .catch(rejectWithValue)
);

export const upsertCategoryAsync = createAsyncThunk<
  string,
  UpsertCategoryCommand,
  { state: RootState; rejectValue: HttpValidationProblemDetails }
>("category/upsertCategory", (payload, { getState, rejectWithValue, signal }) =>
  getState()
    .apis.categoriesClient.upsertCategory(payload)
    .catch(rejectWithValue)
);

export const removeCategoryAsync = createAsyncThunk<
  void,
  UpsertCategoryCommand,
  { state: RootState; rejectValue: HttpValidationProblemDetails }
>("category/removeCategory", (payload, { getState, rejectWithValue, signal }) =>
  getState()
    .apis.categoriesClient.removeCategory(payload)
    .catch(rejectWithValue)
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoriesAsync.pending, (state) => {
        state.isLoadingCategories = true;
      })
      .addCase(getCategoriesAsync.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getCategoriesAsync.rejected, (state, action) => {
        state.isLoadingCategories = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(getCategoryInfoAsync.pending, (state) => {
        state.isLoadingCategoryInfo = true;
      })
      .addCase(getCategoryInfoAsync.fulfilled, (state, action) => {
        state.isLoadingCategoryInfo = false;
        state.isSuccess = true;
        state.selectedCategory = action.payload;
      })
      .addCase(getCategoryInfoAsync.rejected, (state, action) => {
        state.isLoadingCategoryInfo = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(upsertCategoryAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(upsertCategoryAsync.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(upsertCategoryAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(removeCategoryAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(removeCategoryAsync.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(removeCategoryAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      });
  },
});

export default categoriesSlice.reducer;
