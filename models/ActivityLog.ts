import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  action: { type: String, required: true }, // e.g., 'CREATE_PRODUCT', 'UPDATE_ORDER'
  entity: { type: String, required: true }, // e.g., 'Product', 'Order'
  entityId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
