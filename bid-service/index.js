require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

mongoose.connect(process.env.MONGO_URI)

// Bid schema
const bidSchema = new mongoose.Schema({
  user_id: String,
  auction_id: String,
  amount: Number,
  timestamp: { type: Date, default: Date.now },
});

const Bid = mongoose.model('Bid', bidSchema);

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Place a bid
app.post('/bids', authenticate, async (req, res) => {
  const { auction_id, amount } = req.body;
  if (!auction_id || !amount) return res.status(400).json({ error: 'Missing auction_id or amount' });

  // Here you would add validation logic to check if bid is higher than current_price, etc.
  // For demo, just save the bid

  const bid = new Bid({
    user_id: req.user.userId,
    auction_id,
    amount,
  });

  await bid.save();
  res.status(201).json(bid);
});

// Get bids for auction
app.get('/bids/auction/:auction_id', async (req, res) => {
  const bids = await Bid.find({ auction_id: req.params.auction_id }).sort({ amount: -1 });
  res.json(bids);
});

// Get bids for user
app.get('/bids/user/:user_id', authenticate, async (req, res) => {
  if (req.user.userId !== req.params.user_id) return res.status(403).json({ error: 'Forbidden' });

  const bids = await Bid.find({ user_id: req.params.user_id });
  res.json(bids);
});

app.listen(PORT, () => {
  console.log(`Bid Service running on port ${PORT}`);
});
