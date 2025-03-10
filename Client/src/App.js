// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/Login"
import RawMaterialList from './components/RawMaterialList';
import ProductCategories from './components/ProductCategories';
import ProductList from './components/ProductList';

import Inventory from './components/Inventory';
import RawMaterials from './components/inventory/RawMaterials';
import SemiFinishedProducts from './components/inventory/SemiFinishedProducts';
import FinishedProducts from './components/inventory/FinishedProducts';

import Sales from './components/Sales';



import UserRegistration from './components/UserRegistration';
// import RawMaterialInventory from './components/inventory/RawMaterialInventory';
// import ProductsInStock from './components/inventory/ProductsInStock';
// import SoldProducts from './components/inventory/SoldProducts';
// import PlaceOrder from './components/inventory/PlaceOrder';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the root path */}
        <Route path="/" element={<Login/>} />
        <Route path="/raw-materials" element={<RawMaterialList />} />
        <Route path="/categories" element={<ProductCategories />} />
        <Route path="/products" element={<ProductList />} />

        <Route path="/inventory" element={<Inventory />} />

        {/* <Route path="/inventory-raw-materials" element={<RawMaterials />} />
          <Route path="/semi-finished-products" element={<SemiFinishedProducts />} />
          <Route path="/finished-products" element={<FinishedProducts />} /> */}


         <Route path="/sales" element={<Sales/>} /> 
          
        <Route path="/user-registration" element={<UserRegistration />} />
        {/* <Route path="/inventory/raw-materials" element={<RawMaterialInventory />} />
        <Route path="/inventory/products-in-stock" element={<ProductsInStock />} />
        <Route path="/inventory/sold-products" element={<SoldProducts />} />
        <Route path="/inventory/place-order" element={<PlaceOrder />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
