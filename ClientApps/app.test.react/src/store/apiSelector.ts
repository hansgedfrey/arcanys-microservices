import { createDraftSafeSelector } from "@reduxjs/toolkit";
import {
  CartsClient,
  UsersClient,
  ProductsClient,
  CategoriesClient,
  InventoryItemsClient,
} from "../api/products-api";

const getAccessToken = (state: any) => state.oidc.user;

export const getApis = createDraftSafeSelector(
  (state: any) => {},
  (user) => {
    const http = (url: RequestInfo, init?: RequestInit) => {
      // const token = user?.access_token;
      // if (token && init)
      //   init.headers = { ...init.headers, Authorization: `Bearer ${token}` };
      return fetch(url, init);
    };

    return {
      cartsClient: new CartsClient(process.env.PRODUCTS_ENDPOINT_URL, {
        fetch: http,
      }),
      usersClient: new UsersClient(process.env.PRODUCTS_ENDPOINT_URL, {
        fetch: http,
      }),
      productsClient: new ProductsClient(process.env.PRODUCTS_ENDPOINT_URL, {
        fetch: http,
      }),
      categoriesClient: new CategoriesClient("http://localhost:5237", {
        fetch: http,
      }),
      inventoryClient: new InventoryItemsClient(
        process.env.PRODUCTS_ENDPOINT_URL,
        {
          fetch: http,
        }
      ),
    };
  }
);
