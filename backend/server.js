import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import tenantRoutes from './routes/tenant.js';
import usersRoutes from './routes/users.js';

const app = express();

// CORS: permite múltiples orígenes separados por coma
const allow = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allow.length ? allow : true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tenants', tenantRoutes);
app.use('/users', usersRoutes);

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = Number(process.env.PORT || 3001);

async function connectDB() {
  if (!MONGODB_URI) throw new Error('Falta MONGODB_URI');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 6000, directConnection: true });
  console.log('Mongo conectado');
}
await connectDB();

// LOCAL: usar app.listen
if (!process.env.VERCEL && !process.env.AWS_REGION) {
  app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
}

// VERCEL/AWS: exporta handler serverless
let handler = null;
if (process.env.VERCEL || process.env.AWS_REGION) {
  const { default: serverless } = await import('serverless-http');
  handler = serverless(app);
}
export default handler;
