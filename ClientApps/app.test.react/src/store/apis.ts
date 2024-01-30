import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CartsClient,
  UsersClient,
  ProductsClient,
  CategoriesClient,
  InventoryItemsClient,
} from "../api/products-api";

interface AuthenticationState {
  cartsClient: CartsClient;
  usersClient: UsersClient;
  productsClient: ProductsClient;
  categoriesClient: CategoriesClient;
  inventoryItemsClient: InventoryItemsClient;
}

const initialState: AuthenticationState = {
  cartsClient: new CartsClient(process.env.REACT_APP_API_URL),
  usersClient: new UsersClient(process.env.REACT_APP_API_URL),
  productsClient: new ProductsClient(process.env.REACT_APP_API_URL),
  categoriesClient: new CategoriesClient(process.env.REACT_APP_API_URL),
  inventoryItemsClient: new InventoryItemsClient(process.env.REACT_APP_API_URL),
};

export const apiSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setFetch(
      state,
      action: PayloadAction<
        (url: RequestInfo, options?: RequestInit) => Promise<Response>
      >
    ) {
      state.cartsClient = new CartsClient(process.env.REACT_APP_API_URL, {
        fetch: action.payload,
      });
      state.usersClient = new UsersClient(process.env.REACT_APP_API_URL, {
        fetch: action.payload,
      });
      state.productsClient = new ProductsClient(process.env.REACT_APP_API_URL, {
        fetch: action.payload,
      });
      state.categoriesClient = new CategoriesClient(
        process.env.REACT_APP_API_URL,
        {
          fetch: action.payload,
        }
      );
      state.inventoryItemsClient = new InventoryItemsClient(
        process.env.REACT_APP_API_URL,
        {
          fetch: action.payload,
        }
      );
    },
  },
  extraReducers: {},
});

export const { setFetch } = apiSlice.actions;
export default apiSlice.reducer;
