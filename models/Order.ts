import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
    default: 'PENDING'
  },
  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'UNPAID'
  },
  paymentId: { type: String },
  razorpayOrderId: { type: String },
  shippingAddress: {
    line1: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
