require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)

// Auction schema
const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  starting_price: Number,
  current_price: Number,
  status: { type: String, enum: ['pending', 'live', 'ended'], default: 'pending' },
  ends_at: Date,
  owner_id: String,
});

const Auction = mongoose.model('Auction', auctionSchema);

// Middleware to verify JWT token
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Create auction
app.post('/auctions', authenticate, async (req, res) => {
  const { title, description, starting_price, ends_at } = req.body;
  const auction = new Auction({
    title,
    description,
    starting_price,
    current_price: starting_price,
    ends_at,
    owner_id: req.user.userId,
  });
  await auction.save();
  res.status(201).json(auction);
});

// Get all auctions
app.get('/auctions', async (req, res) => {
  const auctions = await Auction.find();
  res.json(auctions);
});

// Get auction by id
app.get('/auctions/:id', async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) return res.status(404).json({ error: 'Auction not found' });
  res.json(auction);
});

// Delete auction by id
app.delete('/auctions/:id', authenticate, async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) return res.status(404).json({ error: 'Auction not found' });
  if (auction.owner_id !== req.user.userId) return res.status(403).json({ error: 'Not allowed' });

  await Auction.deleteOne({ _id: req.params.id });
  res.json({ message: 'Auction deleted' });
});

app.listen(PORT, () => {
  console.log(`Auction Service running on port ${PORT}`);
});
