import "./App.css";
import Products from "./pages/Products";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Categories from "./pages/Categories";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="products/*" element={<Products />} />
          <Route path="categories/*" element={<Categories />} />
          <Route path="*" element={<Navigate to="products" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
