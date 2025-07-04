const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add a new product
router.post('/', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Edit product
router.put('/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Seed (optional)
router.post('/seed', async (req, res) => {
  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: "Wireless Headphones",
      image: "https://via.placeholder.com/150",
      description: "Comfortable, wireless, noise-cancelling",
      price: 199.99
    },
    {
      name: "Smart Watch",
      image: "https://via.placeholder.com/150",
      description: "Track fitness, sleep and health metrics",
      price: 149.99
    }
  ]);
  res.send("Seeded!");
});

module.exports = router;