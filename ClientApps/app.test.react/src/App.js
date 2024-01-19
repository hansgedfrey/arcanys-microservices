import "./App.css";
import Products from "./pages/Products";
import Component2 from "./pages/component2";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="products/*" element={<Products />} />
          <Route path="component2/*" element={<Component2 />} />
          <Route path="*" element={<Navigate to="products" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
