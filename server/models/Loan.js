const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date
  },
  lendDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Requested', 'Approved', 'Denied', 'Lent', 'Returned', 'Overdue'],
    default: 'Requested'
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Loan', LoanSchema);