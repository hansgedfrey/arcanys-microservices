import { Navigate, Route, Routes } from "react-router-dom";
import Inventory from "./Inventory";
import Products from "./Products";
import Categories from "./Categories";
import EditCategory from "./EditCategory";

export default function Admin() {
  return (
    <Routes>
      <Route path="inventory/*" element={<Inventory />} />
      <Route path="categories/*" element={<Categories />} />
      <Route path="category/:categoryId" element={<EditCategory />} />
      <Route path="products/*" element={<Products />} />
      <Route path="*" element={<Navigate to="inventory" replace />} />
    </Routes>
  );
}
