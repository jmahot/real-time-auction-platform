const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  starting_price: { type: Number, required: true },
  current_price: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'live', 'ended'], default: 'pending' },
  ends_at: Date,
  owner_id: { type: String, required: true }
});

module.exports = mongoose.model('Auction', auctionSchema);
