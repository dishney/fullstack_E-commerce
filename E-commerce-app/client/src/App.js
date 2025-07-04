import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList.js';
import Cart from './components/Cart.js';
import Navbar from './components/Navbar.js';
import AdminPage from './components/AdminPage.js';
import './App.css';
import axios from 'axios';

function App() {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
      const res = await axios.get('http://localhost:5000/api/cart');
      setCart(res.data);
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
  await axios.post('http://localhost:5000/api/cart', {
    productId: product._id,
    qty: 1
  });
  alert("Product added to cart!");
};
  

  const updateQty = (id, qty) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, qty } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <Router>
      <Navbar cart={cart} />
      <Routes>
        <Route path="/" element={<ProductList fetchCart={fetchCart} addToCart={addToCart}/>} />
        <Route path="/cart" element={
          <Cart
            cart={cart}
            fetchCart={fetchCart}
            updateQty={updateQty}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        } />
        <Route path="/admin" element={<AdminPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;