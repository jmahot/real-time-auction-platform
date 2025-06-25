import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB Auth-Gateway"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth Gateway running on port ${PORT}`);
});
