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
  cartsClient: new CartsClient("http://localhost:5237"),
  usersClient: new UsersClient("http://localhost:5237"),
  productsClient: new ProductsClient("http://localhost:5237"),
  categoriesClient: new CategoriesClient("http://localhost:5237"),
  inventoryItemsClient: new InventoryItemsClient("http://localhost:5237"),
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
      state.cartsClient = new CartsClient("http://localhost:5237", {
        fetch: action.payload,
      });
      state.usersClient = new UsersClient("http://localhost:5237", {
        fetch: action.payload,
      });
      state.productsClient = new ProductsClient("http://localhost:5237", {
        fetch: action.payload,
      });
      state.categoriesClient = new CategoriesClient("http://localhost:5237", {
        fetch: action.payload,
      });
      state.inventoryItemsClient = new InventoryItemsClient(
        "http://localhost:5237",
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
