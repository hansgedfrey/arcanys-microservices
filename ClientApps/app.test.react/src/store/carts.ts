import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  CreateCartCommand,
  HttpValidationProblemDetails,
} from "../../api/products-api";

const cartState: {
  isSubmitting: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  problem?: HttpValidationProblemDetails;
} = {
  isSubmitting: false,
  isSuccess: false,
  isFailure: false,
};

export const createCartAsync = createAsyncThunk<
  string,
  void,
  { state: RootState; rejectValue: HttpValidationProblemDetails }
>("cart/create-cart", (_, { getState, rejectWithValue, signal }) =>
  getState().apis.cartsClient.createCart(signal).catch(rejectWithValue)
);
