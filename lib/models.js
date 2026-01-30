import mongoose from 'mongoose';

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  weight: String,
  image: String,
  stock: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
});

// Order Schema
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending' }, // Pending, Paid, Failed
  orderStatus: { type: String, default: 'Processing' }, // Processing, Shipped, Delivered, Cancelled
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
