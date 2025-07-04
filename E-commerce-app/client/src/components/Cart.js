import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [localQtys, setLocalQtys] = useState({});

  // Fetch cart from backend
 const fetchCart = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/cart');
    const data = res.data;
    setCartItems(data);

    const qtyMap = {};
    data.forEach(item => {
      qtyMap[item._id] = item.quantity
    });
    setLocalQtys(qtyMap);

    // Ensure it's always an array
    if (Array.isArray(data)) {
      setCartItems(data);
    } else if (data.items && Array.isArray(data.items)) {
      setCartItems(data.items);
    } else {
      setCartItems([]); // fallback
      console.warn("Unexpected cart data structure:", data);
    }
  } catch (err) {
    console.error('Error fetching cart:', err);
    setCartItems([]); // prevent crash
  }
};
  useEffect(() => {
    console.log("cartItems =>", cartItems);
  }, [cartItems]);

  useEffect(() => {
    fetchCart(); // Fetch cart when component mounts
  }, [location]);

  const updateQty = async (id, quantity) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/${id}`, { quantity });
      fetchCart(); // Refresh
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart`);
      fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const navigateToShop = () => {
    navigate('/');
  };

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>SHOPPING CART</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td><img src={item.image} alt={item.name} /></td>
                  <td>{item.name}</td>
                  <td>${item.price}/-</td>
                  <td>
                    <input
                      type="number"
                      value={localQtys[item._id] || item.quantity}
                      onChange={(e) => setLocalQtys({ ...localQtys, [item._id]: parseInt(e.target.value)})}
                    />
                    <button
                      className='update-btn'
                      onClick={() => updateQty(item._id, localQtys[item._id])}
                      >Update</button>
                  </td>
                  <td>${item.price * item.quantity}/-</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeItem(item._id)}>
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <button className="left-btn" onClick={navigateToShop}>
              ⬅ Continue Shopping
            </button>
            <strong>Grand Total: ${getTotal()}/-</strong>
            <button className="delete-all-btn" onClick={clearCart}>
              🗑 Delete All
            </button>
          </div>

          <button className="checkout-btn">Proceed To Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;