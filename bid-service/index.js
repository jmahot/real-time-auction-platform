require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const bidRoutes = require('./routes/bidRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use('/', bidRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Bid Service running on port ${PORT}`));