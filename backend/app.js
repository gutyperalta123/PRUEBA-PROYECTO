// backend/app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ajusta estos paths si tus rutas tienen otro nombre
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import tenantRoutes from "./routes/tenant.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS solo en desarrollo local (netlify dev)
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:8888"],
      credentials: true,
    })
  );
}

// Conexión a Mongo (una sola vez)
if (!mongoose.connection.readyState) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Falta MONGODB_URI");
    process.exit(1);
  }
  mongoose
    .connect(uri)
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => {
      console.error("Error conectando a MongoDB:", err?.message || err);
      process.exit(1);
    });
}

// Rutas API
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use("/tenants", tenantRoutes);
app.use("/users", usersRoutes);

// Health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;
