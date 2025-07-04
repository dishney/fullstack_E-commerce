import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ cart }) {
  return (
    <nav className="navbar">
      <h2>🛒 ShopNest</h2>
      <div>
        <Link to="/admin">Admin</Link>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
      </div>
    </nav>
  );
}

export default Navbar;