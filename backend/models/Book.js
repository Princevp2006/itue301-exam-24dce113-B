const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  isbn: {
    type: String,
    unique: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Book', BookSchema);
