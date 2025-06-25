import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  auctionId: String,
  bidder: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Bid", BidSchema);
