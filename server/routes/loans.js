// server/routes/loans.js
const express = require('express');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const { auth } = require('./auth');
const router = express.Router();

// @route   POST api/loans
// @desc    Request to borrow a book
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, notes } = req.body;
    
    // Find the book
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    // Check if book is available
    if (book.status !== 'Available') {
      return res.status(400).json({ msg: 'Book is not available for borrowing' });
    }
    
    // Prevent user from borrowing their own book
    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({ msg: 'You cannot borrow your own book' });
    }
    
    // Check if there's already an active loan request
    const existingLoan = await Loan.findOne({
      book: bookId,
      borrower: req.user.id,
      status: { $in: ['Requested', 'Approved'] }
    });
    
    if (existingLoan) {
      return res.status(400).json({ msg: 'You already have an active request for this book' });
    }
    
    // Create a new loan request
    const newLoan = new Loan({
      book: bookId,
      lender: book.owner,
      borrower: req.user.id,
      notes
    });
    
    // Save the loan
    const loan = await newLoan.save();
    
    // Return the created loan with populated references
    const populatedLoan = await Loan.findById(loan._id)
      .populate('book', 'title authors imageLinks')
      .populate('lender', 'name avatar')
      .populate('borrower', 'name avatar');
    
    res.json(populatedLoan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/loans
// @desc    Get loans for current user (as lender or borrower)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { role, status } = req.query;
    
    let query = {};
    
    // Filter by role
    if (role === 'lender') {
      query.lender = req.user.id;
    } else if (role === 'borrower') {
      query.borrower = req.user.id;
    } else {
      // Default: get all loans where user is either lender or borrower
      query.$or = [{ lender: req.user.id }, { borrower: req.user.id }];
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    const loans = await Loan.find(query)
      .populate('book', 'title authors imageLinks')
      .populate('lender', 'name avatar')
      .populate('borrower', 'name avatar')
      .sort({ requestDate: -1 });
    
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/loans/:id
// @desc    Get loan by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('book')
      .populate('lender', 'name avatar location')
      .populate('borrower', 'name avatar location');
    
    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }
    
    // Check if user is authorized to view this loan
    if (loan.lender._id.toString() !== req.user.id && loan.borrower._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to view this loan' });
    }
    
    res.json(loan);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Loan not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/loans/:id/status
// @desc    Update loan status (approve, deny, lend, return, etc.)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, dueDate, notes } = req.body;
    
    const loan = await Loan.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }
    
    // Different actions based on the requested status change
    switch (status) {
      case 'Approved':
        // Only lender can approve
        if (loan.lender.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'Only the book owner can approve requests' });
        }
        if (loan.status !== 'Requested') {
          return res.status(400).json({ msg: 'Can only approve loans in Requested status' });
        }
        loan.status = 'Approved';
        loan.approvalDate = Date.now();
        break;
        
      case 'Denied':
        // Only lender can deny
        if (loan.lender.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'Only the book owner can deny requests' });
        }
        if (loan.status !== 'Requested') {
          return res.status(400).json({ msg: 'Can only deny loans in Requested status' });
        }
        loan.status = 'Denied';
        break;
        
      case 'Lent':
        // Only lender can mark as lent
        if (loan.lender.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'Only the book owner can mark as lent' });
        }
        if (loan.status !== 'Approved') {
          return res.status(400).json({ msg: 'Can only mark approved loans as lent' });
        }
        if (!dueDate) {
          return res.status(400).json({ msg: 'Due date is required' });
        }
        loan.status = 'Lent';
        loan.lendDate = Date.now();
        loan.dueDate = new Date(dueDate);
        
        // Update book status
        await Book.findByIdAndUpdate(loan.book, { status: 'Lent Out' });
        break;
        
      case 'Returned':
        // Only lender can mark as returned
        if (loan.lender.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'Only the book owner can mark as returned' });
        }
        if (loan.status !== 'Lent' && loan.status !== 'Overdue') {
          return res.status(400).json({ msg: 'Can only mark lent or overdue loans as returned' });
        }
        loan.status = 'Returned';
        loan.returnDate = Date.now();
        
        // Update book status
        await Book.findByIdAndUpdate(loan.book, { status: 'Available' });
        break;
        
      case 'Overdue':
        // System should handle this automatically, but allow admin or lender to mark as overdue
        if (loan.lender.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'Only the book owner can mark as overdue' });
        }
        if (loan.status !== 'Lent') {
          return res.status(400).json({ msg: 'Can only mark lent loans as overdue' });
        }
        loan.status = 'Overdue';
        break;
        
      default:
        return res.status(400).json({ msg: 'Invalid status update' });
    }
    
    // Update notes if provided
    if (notes) {
      loan.notes = notes;
    }
    
    // Save the updated loan
    await loan.save();
    
    // Return the updated loan with populated references
    const updatedLoan = await Loan.findById(loan._id)
      .populate('book', 'title authors imageLinks')
      .populate('lender', 'name avatar')
      .populate('borrower', 'name avatar');
    
    res.json(updatedLoan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/loans/:id
// @desc    Cancel a loan request
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }
    
    // Only the borrower can cancel a request, and only if it's in Requested or Approved status
    if (loan.borrower.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to cancel this request' });
    }
    
    if (loan.status !== 'Requested' && loan.status !== 'Approved') {
      return res.status(400).json({ msg: 'Cannot cancel a loan that is already active or completed' });
    }
    
    // Delete the loan
    await loan.deleteOne();
    
    res.json({ msg: 'Loan request cancelled' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Loan not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;