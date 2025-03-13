// server/routes/messages.js
const express = require('express');
const Message = require('../models/Message');
const { auth } = require('./auth');
const router = express.Router();

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { recipient, content, relatedBook, relatedLoan } = req.body;
    
    // Create new message
    const newMessage = new Message({
      sender: req.user.id,
      recipient,
      content,
      relatedBook,
      relatedLoan
    });
    
    // Save message
    const message = await newMessage.save();
    
    // Return populated message
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('relatedBook', 'title')
      .populate('relatedLoan');
    
    res.json(populatedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages
// @desc    Get messages for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get all messages where user is either sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('relatedBook', 'title')
      .populate('relatedLoan')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages/conversation/:userId
// @desc    Get conversation with another user
// @access  Private
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    
    // Get all messages between the current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id }
      ]
    })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('relatedBook', 'title')
      .populate('relatedLoan')
      .sort({ createdAt: 1 }); // Sort by oldest first for conversation view
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/messages/read
// @desc    Mark messages as read
// @access  Private
router.put('/read', auth, async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    // Ensure the user only marks messages addressed to them as read
    const result = await Message.updateMany(
      {
        _id: { $in: messageIds },
        recipient: req.user.id, // Only messages where the user is the recipient
        read: false // Only unread messages
      },
      { $set: { read: true } }
    );
    
    res.json({ count: result.modifiedCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages/unread
// @desc    Get unread message count
// @access  Private
router.get('/unread', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      read: false
    });
    
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;