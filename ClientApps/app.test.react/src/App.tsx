import "./App.css";
import Products from "./pages/Client/Products";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./layouts";
import Categories from "./pages/Client/Categories";
import Admin from "./pages/Admin";
import ErrorBoundary from "./ErrorBoundary";
import { createContext, useCallback, useState } from "react";
import SnackBar, { SnackBarProps } from "./components/SnackBar";

export const SnackbarContext = createContext<(props: SnackBarProps) => void>(
  () => ({
    open: false,
  })
);

function App() {
  const [snackbarProps, setSnackbarProps] = useState<SnackBarProps>({
    open: false,
  });
  const handleSetSnackbarProps = useCallback((props: SnackBarProps) => {
    setSnackbarProps({
      ...props,
      open: props?.open === undefined ? !!props?.message : props.open,
    });
  }, []);

  return (
    <ErrorBoundary>
      <SnackbarContext.Provider value={handleSetSnackbarProps}>
        <SnackBar
          {...snackbarProps}
          onClose={() => {
            setSnackbarProps({ ...snackbarProps, open: false });
            snackbarProps?.onClose && snackbarProps.onClose();
          }}
        />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="products/*" element={<Products />} />
              <Route path="categories/*" element={<Categories />} />
              <Route path="admin/*" element={<Admin />} />
              <Route path="*" element={<Navigate to="products" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </SnackbarContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
