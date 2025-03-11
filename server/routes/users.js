// server/routes/users.js
const express = require('express');
const User = require('../models/User');
const { auth } = require('./auth');
const router = express.Router();

// @route   GET api/users
// @desc    Get all users (limited info for public directory)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name avatar location privacySettings');
    
    // Filter out information based on privacy settings
    const filteredUsers = users.map(user => {
      const userObj = {
        id: user._id,
        name: user.name,
        avatar: user.avatar
      };
      
      // Only include location if the user has made it public
      if (user.privacySettings.showLocation) {
        userObj.location = user.location;
      }
      
      return userObj;
    });
    
    res.json(filteredUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID (limited info for public profile)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Create a filtered user object based on privacy settings
    const filteredUser = {
      id: user._id,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt
    };
    
    if (user.privacySettings.showLocation) {
      filteredUser.location = user.location;
    }
    
    if (user.privacySettings.showEmail) {
      filteredUser.email = user.email;
    }
    
    res.json(filteredUser);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, location, avatar, privacySettings } = req.body;
  
  // Build user profile object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (location) profileFields.location = location;
  if (avatar) profileFields.avatar = avatar;
  
  // Handle privacy settings if provided
  if (privacySettings) {
    profileFields.privacySettings = {};
    if (privacySettings.showEmail !== undefined) {
      profileFields.privacySettings.showEmail = privacySettings.showEmail;
    }
    if (privacySettings.showLocation !== undefined) {
      profileFields.privacySettings.showLocation = privacySettings.showLocation;
    }
    if (privacySettings.showLibrary !== undefined) {
      profileFields.privacySettings.showLibrary = privacySettings.showLibrary;
    }
  }
  
  try {
    // Update the user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    // Get the user
    const user = await User.findById(req.user.id);
    
    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;