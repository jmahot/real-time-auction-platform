import express from "express";
import Bid from "../models/bid.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const newBid = new Bid(req.body);
  const savedBid = await newBid.save();
  res.status(201).json(savedBid);
});

router.get("/", async (req, res) => {
  const bids = await Bid.find();
  res.json(bids);
});

export default router;
