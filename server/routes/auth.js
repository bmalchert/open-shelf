// server/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to protect routes
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = await User.findById(decoded.user.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, location } = req.body;
  
  try {
    console.log('Registration attempt with email:', email);
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists with this email');
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Log the data we're about to save
    console.log('Creating new user with data:', {
      name,
      email,
      location,
      passwordLength: password ? password.length : 0
    });
    
    // Create new user
    user = new User({
      name,
      email,
      password,
      location
    });
    
    // Save user to database
    console.log('Attempting to save user to database...');
    await user.save();
    console.log('User saved successfully with ID:', user.id);
    
    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };
    
    // Sign token
    console.log('Signing JWT token...');
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          throw err;
        }
        console.log('JWT token created successfully');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name
    });
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };
    
    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = { router, auth };