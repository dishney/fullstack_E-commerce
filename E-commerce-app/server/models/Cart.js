const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: String, // optional: can be sessionId or userId
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      qty: Number
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);