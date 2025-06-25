require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());

// JWT middleware globally applied to all proxied services
const auth = require('./middlewares/authMiddleware');

// Routes
app.use('/bids', auth, createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
app.use('/auctions', auth, createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));

// Public routes
app.use('/users', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth Gateway running on port ${PORT}`));
