import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CartsClient,
  UsersClient,
  ProductsClient,
  CategoriesClient,
  InventoryItemsClient,
} from "../../api/products-api";

interface ApiState {
  cartsClient: CartsClient;
  usersClient: UsersClient;
  productsClient: ProductsClient;
  categoriesClient: CategoriesClient;
  inventoryItemsClient: InventoryItemsClient;
}

const initialState: ApiState = {
  cartsClient: new CartsClient(process.env.PRODUCTS_ENDPOINT_URL),
  usersClient: new UsersClient(process.env.PRODUCTS_ENDPOINT_URL),
  productsClient: new ProductsClient(process.env.PRODUCTS_ENDPOINT_URL),
  categoriesClient: new CategoriesClient(process.env.PRODUCTS_ENDPOINT_URL),
  inventoryItemsClient: new InventoryItemsClient(
    process.env.PRODUCTS_ENDPOINT_URL
  ),
};
