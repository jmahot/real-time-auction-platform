import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bidRoutes from "./routes/bidRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Bid-Service"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/bids", bidRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Bid Service running on port ${PORT}`));
