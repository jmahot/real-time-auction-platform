const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password_hash: String
});

const User = mongoose.model('User', UserSchema);

// Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password_hash });
  await user.save();
  res.send({ message: 'User registered' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET);
  res.send({ token });
});

app.listen(3001, () => console.log('User Service on port 3001'));
