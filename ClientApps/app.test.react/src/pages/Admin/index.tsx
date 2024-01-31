import { Navigate, Route, Routes } from "react-router-dom";
import InventoryItem from "./InventoryItem/InventoryItems";
import Products from "./Product/Products";
import Categories from "./Category/Categories";

export default function Admin() {
  return (
    <Routes>
      <Route path="categories/*" element={<Categories />} />
      <Route path="products/*" element={<Products />} />
      <Route path="inventoryItems/*" element={<InventoryItem />} />
      <Route path="*" element={<Navigate to="inventoryItems" replace />} />
    </Routes>
  );
}
