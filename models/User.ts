import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'CUSTOMER'],
    default: 'CUSTOMER'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'BLOCKED'],
    default: 'ACTIVE'
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
