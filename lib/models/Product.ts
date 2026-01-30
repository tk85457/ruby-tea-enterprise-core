import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  weight: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stock: 1 });

// Prevent re-compilation of model in development
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
