// server/routes/books.js
const express = require('express');
const Book = require('../models/Book');
const { auth } = require('./auth');
const router = express.Router();

// @route   POST api/books
// @desc    Create a new book
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      authors,
      isbn,
      publisher,
      publishedDate,
      description,
      pageCount,
      categories,
      imageLinks,
      condition,
      notes
    } = req.body;

    // Create new book object
    const newBook = new Book({
      owner: req.user.id,
      title,
      authors,
      isbn,
      publisher,
      publishedDate,
      description,
      pageCount,
      categories,
      imageLinks,
      condition,
      notes
    });

    // Save the book to database
    const book = await newBook.save();
    
    res.json(book);
  } catch (err) {
    console.error('Error creating book:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/books
// @desc    Get all books (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, owner, condition, category, search } = req.query;
    
    // Build query object
    const query = {};
    
    if (status) query.status = status;
    if (owner) query.owner = owner;
    if (condition) query.condition = condition;
    if (category) query.categories = { $in: [category] };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { authors: { $elemMatch: { $regex: search, $options: 'i' } } },
        { publisher: { $regex: search, $options: 'i' } }
      ];
    }
    
    const books = await Book.find(query)
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'name avatar location privacySettings');
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/books/:id
// @desc    Update a book
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    // Check if user owns the book
    if (book.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this book' });
    }
    
    // Fields that can be updated
    const {
      title,
      authors,
      isbn,
      publisher,
      publishedDate,
      description,
      pageCount,
      categories,
      imageLinks,
      condition,
      status,
      notes
    } = req.body;
    
    // Build update object with only provided fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (authors !== undefined) updateFields.authors = authors;
    if (isbn !== undefined) updateFields.isbn = isbn;
    if (publisher !== undefined) updateFields.publisher = publisher;
    if (publishedDate !== undefined) updateFields.publishedDate = publishedDate;
    if (description !== undefined) updateFields.description = description;
    if (pageCount !== undefined) updateFields.pageCount = pageCount;
    if (categories !== undefined) updateFields.categories = categories;
    if (imageLinks !== undefined) updateFields.imageLinks = imageLinks;
    if (condition !== undefined) updateFields.condition = condition;
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    
    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate('owner', 'name avatar');
    
    res.json(updatedBook);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/books/:id
// @desc    Delete a book
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    // Check if user owns the book
    if (book.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this book' });
    }
    
    // Check if book is currently lent out
    if (book.status === 'Lent Out') {
      return res.status(400).json({ msg: 'Cannot delete a book that is currently lent out' });
    }
    
    // Delete the book
    await book.deleteOne();
    
    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/books/user/:userId
// @desc    Get books by user ID (their library)
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const books = await Book.find({ owner: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;