import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  HttpValidationProblemDetails,
  InventoryItemDto,
  InventoryItemSortOptions,
  RemoveInventoryItemCommand,
  SearchInventoryResponse,
  UpsertInventoryItemCommand,
} from "../api/products-api";

const initialState: {
  isSubmitting: boolean;
  isLoadingInventoryItems: boolean;
  isLoadingInventoryItem: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  inventoryItems?: SearchInventoryResponse;
  selectedInventoryItem?: InventoryItemDto;
  errors?: HttpValidationProblemDetails;
} = {
  isSubmitting: false,
  isLoadingInventoryItems: false,
  isLoadingInventoryItem: false,
  isSuccess: false,
  isFailure: false,
};

export const getInventoryItemsAsync = createAsyncThunk<
  SearchInventoryResponse,
  { page?: number; query?: string; sortOption: InventoryItemSortOptions },
  { state: RootState }
>(
  "inventoryItems",
  (
    payload: {
      page?: number;
      query?: string;
      sortOption: InventoryItemSortOptions;
    },
    { getState, rejectWithValue }
  ) =>
    getState()
      .apis.inventoryItemsClient.inventoryItems(
        payload.query,
        payload.page,
        payload.sortOption
      )
      .catch(rejectWithValue)
);

export const getInventoryItemAsync = createAsyncThunk<
  InventoryItemDto,
  { inventoryItemId: string },
  { state: RootState }
>(
  "inventoryItem/{inventoryItemId}",
  (payload: { inventoryItemId: string }, { getState, rejectWithValue }) =>
    getState()
      .apis.inventoryItemsClient.getInventoryItem(payload.inventoryItemId)
      .catch(rejectWithValue)
);

export const upsertInventoryItemAsync = createAsyncThunk<
  string,
  UpsertInventoryItemCommand,
  { state: RootState; rejectValue: HttpValidationProblemDetails }
>(
  "inventoryItem/upsertInventoryItem",
  (payload, { getState, rejectWithValue, signal }) =>
    getState()
      .apis.inventoryItemsClient.upsertInventoryItem(payload)
      .catch(rejectWithValue)
);

export const removeInventoryItemAsync = createAsyncThunk<
  void,
  RemoveInventoryItemCommand,
  { state: RootState; rejectValue: HttpValidationProblemDetails }
>(
  "inventoryItem/removeInventoryItem",
  (payload, { getState, rejectWithValue, signal }) =>
    getState()
      .apis.inventoryItemsClient.removeInventoryItem(payload)
      .catch(rejectWithValue)
);

export const inventoryItemsSlice = createSlice({
  name: "inventoryItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInventoryItemsAsync.pending, (state) => {
        state.isLoadingInventoryItems = true;
      })
      .addCase(getInventoryItemsAsync.fulfilled, (state, action) => {
        state.isLoadingInventoryItems = false;
        state.isSuccess = true;
        state.inventoryItems = action.payload;
      })
      .addCase(getInventoryItemsAsync.rejected, (state, action) => {
        state.isLoadingInventoryItems = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(getInventoryItemAsync.pending, (state) => {
        state.isLoadingInventoryItem = true;
      })
      .addCase(getInventoryItemAsync.fulfilled, (state, action) => {
        state.isLoadingInventoryItem = false;
        state.isSuccess = true;
        state.selectedInventoryItem = action.payload;
      })
      .addCase(getInventoryItemAsync.rejected, (state, action) => {
        state.isLoadingInventoryItem = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(upsertInventoryItemAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(upsertInventoryItemAsync.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(upsertInventoryItemAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      })
      .addCase(removeInventoryItemAsync.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(removeInventoryItemAsync.fulfilled, (state) => {
        state.isSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(removeInventoryItemAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isFailure = false;
        state.errors = action.payload as HttpValidationProblemDetails;
      });
  },
});

export default inventoryItemsSlice.reducer;
