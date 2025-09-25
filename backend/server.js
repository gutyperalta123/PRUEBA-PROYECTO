import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import tenantRoutes from './routes/tenant.js';
import usersRoutes from './routes/users.js'; // ← NUEVO

const app = express();

const allow = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allow.length ? allow : true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tenants', tenantRoutes);
app.use('/users', usersRoutes); // ← NUEVO

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = Number(process.env.PORT || 3001);

async function boot() {
  if (!MONGODB_URI) {
    console.error('Falta MONGODB_URI en .env');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 6000,
    directConnection: true
  });
  console.log('Mongo conectado');

  app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
  });
}

boot().catch(err => {
  console.error('Error al iniciar:', err);
  process.exit(1);
});
