const Auction = require('../models/auctionModel');

// Create auction
exports.createAuction = async (req, res) => {
  try {
    const { title, description, starting_price, ends_at } = req.body;
    const owner_id = req.user.id;

    const auction = new Auction({ title, description, starting_price, current_price: starting_price, ends_at, owner_id });
    await auction.save();

    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all auctions
exports.getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get auction by ID
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete auction
exports.deleteAuction = async (req, res) => {
  try {
    await Auction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Auction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
