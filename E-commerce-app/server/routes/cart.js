const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const USER_ID = "guest123"; // For demo, later replace with JWT-authenticated user

// GET cart
router.get('/', async (req, res) => {
  const cart = await Cart.findOne({ userId: USER_ID }).populate('items.productId');
  if (!cart) return res.json([]); // no cart yet

  const formattedItems = cart.items.map(item => ({
    _id: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    image: item.productId.image,
    quantity: item.qty
  }));

  res.json(formattedItems);
});

// ADD item to cart
router.post('/', async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ userId: USER_ID });

  if (!cart) {
    cart = new Cart({ userId: USER_ID, items: [] });
  }

  const existing = cart.items.find(i => i.productId.toString() === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ productId, qty });
  }

  await cart.save();
  res.json({ message: "Item added to cart" });
});

// UPDATE item quantity
router.put('/:id', async (req, res) => {
  const cart = await Cart.findOne({ userId: USER_ID });
  if (!cart) return res.status(404).send("Cart not found");

  const item = cart.items.find(i => i.productId.toString() === req.params.id);
  if (item) item.qty = req.body.quantity;

  await cart.save();
  res.json({ message: "Cart updated" });
});

// DELETE item from cart
router.delete('/:id', async (req, res) => {
  const cart = await Cart.findOne({ userId: USER_ID });
  if (!cart) return res.status(404).send("Cart not found");

  cart.items = cart.items.filter(i => i.productId.toString() !== req.params.id);
  await cart.save();
  res.json({ message: "Item removed" });
});

// DELETE all items
router.delete('/', async (req, res) => {
  const cart = await Cart.findOne({ userId: USER_ID });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: "Cart cleared" });
});

module.exports = router;