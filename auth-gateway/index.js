require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4003;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware pour vérifier le token
app.use((req, res, next) => {
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }

  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
});

// Proxies vers les autres services
app.use('/api/users', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));
app.use('/api/auctions', createProxyMiddleware({ target: 'http://localhost:4001', changeOrigin: true }));
app.use('/api/bids', createProxyMiddleware({ target: 'http://localhost:4002', changeOrigin: true }));

app.listen(PORT, () => {
  console.log(`Auth Gateway running on port ${PORT}`);
});
