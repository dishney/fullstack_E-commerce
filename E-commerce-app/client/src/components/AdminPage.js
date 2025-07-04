import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '' });
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/products/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/products', form);
    }
    setForm({ name: '', price: '', image: '', description: '' });
    setEditId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  return (
    <div className="container">
      <h2>Admin Product Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button type="submit">{editId ? 'Update Product' : 'Add Product'}</button>
      </form>

      <h3>Existing Products</h3>
      {products.map(p => (
        <div key={p._id} className="product-card">
          <strong>{p.name}</strong> - ${p.price}/-
          <br />
          <img src={p.image} alt={p.name} width={100} />
          <p>{p.description}</p>
          <button onClick={() => handleEdit(p)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default AdminPage;