const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [{
    name: String,
    price: Number,
    size: String,
    color: String,
    productId: String,
    quantity: Number,
    image: String
  }],

  deliveryAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    country: String,
    state: String,
    city: String,
    zip: String
  },

  coupon: {
    type: String,
    default: null
  },

  discount: {
    type: Number,
    default: 0
  },

  shippingFee: {
    type: Number,
    default: 0
  },

  totalPrice: {
    type: Number,
    required: true
  },

  paymentRef: {
    type: String,
    default: ''
  },

  paymentMethod: {
    type: String,
    enum: ['pay-online', 'pay-on-delivery'],
    default: 'pay-online'  // ✨ added: track payment flow
  },

  isDeliveryFeePaid: {
    type: Boolean,
    default: false          // ✅ marks delivery fee payment success
  },

  isFullyPaid: {
    type: Boolean,
    default: false          // ✅ true only if total product price was paid
  },

  status: {
    type: String,
    enum: [
      'Pending',
      'Confirmed',
      'Ready for Shipping',
      'Shipped',
      'Delivered',
      'Cancelled'
    ],
    default: 'Pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
