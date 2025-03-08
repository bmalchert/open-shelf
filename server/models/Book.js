const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  authors: [{
    type: String,
    required: true
  }],
  isbn: {
    type: String,
    trim: true
  },
  publisher: {
    type: String
  },
  publishedDate: {
    type: String
  },
  description: {
    type: String
  },
  pageCount: {
    type: Number
  },
  categories: [{
    type: String
  }],
  imageLinks: {
    thumbnail: { type: String },
    smallThumbnail: { type: String }
  },
  condition: {
    type: String,
    enum: ['Like New', 'Very Good', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  status: {
    type: String,
    enum: ['Available', 'Lent Out', 'Borrowed'],
    default: 'Available'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema);