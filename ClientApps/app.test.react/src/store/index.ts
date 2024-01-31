import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import categories from "./categories";
import products from "./products";
import inventoryItems from "./inventoryItems";
import apis from "./apis";
//export const history = createBrowserHistory();

const store = configureStore({
  devTools: process.env.PRODUCTS_ENDPOINT_URL !== "production",
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({ serializableCheck: false }).concat(
  //     routerMiddleware(history)
  //   ),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    categories,
    products,
    inventoryItems,
    apis,
    //router: connectRouter(history),
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
