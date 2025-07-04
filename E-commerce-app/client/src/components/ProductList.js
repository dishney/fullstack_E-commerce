import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../ProductList.css'; // Assuming you have a CSS file for styling

function ProductList({ fetchCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const addToCart = async (product) => {
    await axios.post("http://localhost:5000/api/cart", {
      productId: product._id,
      qty: 1
    });
    fetchCart(); 
  };

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product._id} className="card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <h4>${product.price}/-</h4>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;