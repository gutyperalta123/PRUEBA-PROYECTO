import mongoose from 'mongoose';
const TenantSchema = new mongoose.Schema(
  { name: String, slug: { type: String, unique: true, index: true }, plan: { type: String, enum: ['free','pro'], default: 'free' } },
  { timestamps: true }
);
export default mongoose.model('Tenant', TenantSchema);
