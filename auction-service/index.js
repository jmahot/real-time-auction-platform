import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import auctionRoutes from "./routes/auctionRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Auction-Service"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/auctions", auctionRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Auction Service running on port ${PORT}`));
