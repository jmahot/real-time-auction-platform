require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password_hash: String,
});

const User = mongoose.model('User', userSchema);

// Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'User exists' });

  const password_hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password_hash });
  await user.save();
  res.status(201).json({ message: 'User created' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
