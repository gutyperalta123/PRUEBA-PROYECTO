import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema(
  { email: { type: String, unique: true, index: true }, passwordHash: String, role: { type: String, enum: ['admin','member'] }, tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' } },
  { timestamps: true }
);
export default mongoose.model('User', UserSchema);
