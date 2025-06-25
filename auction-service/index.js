const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Auction = require('./models/auctionModel');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for Auction Service'))
  .catch((err) => console.error(err));

// Route : créer une enchère
app.post('/auctions', async (req, res) => {
  try {
    const auction = new Auction(req.body);
    await auction.save();
    res.status(201).send(auction);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Route : récupérer toutes les enchères
app.get('/auctions', async (req, res) => {
  const auctions = await Auction.find();
  res.send(auctions);
});

// Route : récupérer une enchère par ID
app.get('/auctions/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).send({ message: 'Auction not found' });
    res.send(auction);
  } catch (err) {
    res.status(400).send({ error: 'Invalid ID format' });
  }
});

// Route : supprimer une enchère par ID
app.delete('/auctions/:id', async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) return res.status(404).send({ message: 'Auction not found' });
    res.send({ message: 'Auction deleted' });
  } catch (err) {
    res.status(400).send({ error: 'Invalid ID format' });
  }
});

// Démarrer le serveur
app.listen(3002, () => console.log('Auction Service running on port 3002'));
