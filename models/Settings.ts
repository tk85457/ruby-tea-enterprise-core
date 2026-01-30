import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'RUBY TEA' },
  siteDescription: { type: String },
  contactEmail: { type: String },
  supportPhone: { type: String },
  currency: { type: String, default: 'INR' },
  taxRate: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 100 },
  freeShippingThreshold: { type: Number, default: 1000 },
  maintenanceMode: { type: Boolean, default: false },
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String
  },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
