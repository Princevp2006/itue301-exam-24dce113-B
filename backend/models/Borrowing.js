const mongoose = require('mongoose');

const BorrowingSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'memberId reference is required'],
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'bookId reference is required'],
  },
  borrowDate: {
    type: Date,
    required: [true, 'Borrow date is required'],
  },
  returnDate: {
    type: Date,
    required: [true, 'Return date is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['borrowed', 'returned', 'overdue'],
      message: '{VALUE} is not a valid borrowing status. Must be: borrowed, returned, or overdue.',
    },
    default: 'borrowed',
  },
});

module.exports = mongoose.model('Borrowing', BorrowingSchema);
