import express from "express";
import Auction from "../models/Auction.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const newAuction = new Auction(req.body);
  const savedAuction = await newAuction.save();
  res.status(201).json(savedAuction);
});

router.get("/", async (req, res) => {
  const auctions = await Auction.find();
  res.json(auctions);
});

export default router;
