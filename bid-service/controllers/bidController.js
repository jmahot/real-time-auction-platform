const Bid = require('../models/bidModel');

// POST /bids
exports.createBid = async (req, res) => {
  try {
    const { auction_id, amount } = req.body;
    const user_id = req.user.id;

    const bid = new Bid({ user_id, auction_id, amount });
    await bid.save();

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /bids/auction/:auction_id
exports.getBidsByAuction = async (req, res) => {
  try {
    const bids = await Bid.find({ auction_id: req.params.auction_id }).sort({ amount: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /bids/user/:user_id
exports.getBidsByUser = async (req, res) => {
  try {
    const bids = await Bid.find({ user_id: req.params.user_id });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
