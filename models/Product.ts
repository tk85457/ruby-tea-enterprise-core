import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  comparePrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  weight: string;
  image: string;
  category: string;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  variants: Array<{
    name: string;
    options: string[];
    price: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  comparePrice: { type: Number },
  cost: { type: Number },
  sku: { type: String, unique: true, sparse: true },
  barcode: { type: String },
  weight: { type: String, required: true, default: '100g' },
  category: { type: String, required: true, default: 'Black Tea', index: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  featured: { type: Boolean, default: false },
  variants: [{
    name: String,
    options: [String],
    price: Number
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
