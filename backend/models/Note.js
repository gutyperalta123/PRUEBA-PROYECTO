import mongoose from 'mongoose';
const NoteSchema = new mongoose.Schema(
  { tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true }, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, title: String, content: String },
  { timestamps: true }
);
export default mongoose.model('Note', NoteSchema);
