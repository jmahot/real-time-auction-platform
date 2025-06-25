import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is not defined in .env");
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Bid Service");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
