import {
  Middleware,
  PayloadAction,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { ApiException } from "../../api/products-api";

export const API_CALL_ERROR = "API_CALL_ERROR";
export const apiCallError = (error: string) => ({
  type: API_CALL_ERROR,
  payload: error,
});

export const errorHandlingMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload;
      if (ApiException.isApiException(payload)) {
        if (payload.status === 401) {
          store.dispatch(setTokenError(true));
        } else if (payload.status === 502) {
          // This means that this endpoint has been taken offline
          store.dispatch(setNetworkingError(true));
        }
      } else {
        store.dispatch(setNetworkingError(true)); // Dispatch the error to the store
      }
    }

    return next(action);
  };

const initialState: {
  networkingError: boolean;
  tokenError: boolean;
} = {
  networkingError: false,
  tokenError: false,
};

const apiSlice = createSlice({
  name: "errorHandling",
  initialState: initialState,
  reducers: {
    setNetworkingError: (state, action: PayloadAction<boolean>) => {
      state.networkingError = action.payload; // Set the error message in the state
    },
    setTokenError: (state, action: PayloadAction<boolean>) => {
      state.tokenError = action.payload;
    },
  },
});

export const { setNetworkingError, setTokenError } = apiSlice.actions;

export default apiSlice.reducer;
