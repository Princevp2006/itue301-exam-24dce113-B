const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Mongoose Models
const Book = require('./models/Book');
const Member = require('./models/Member');
const Borrowing = require('./models/Borrowing');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Custom requestLogger middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.path} [${timestamp}]`);
  next();
};

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Database Seeder Function
const seedData = async () => {
  try {
    // Seed Books
    const bookCount = await Book.countDocuments();
    let seededBooks = [];
    if (bookCount === 0) {
      seededBooks = await Book.create([
        {
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          category: 'Computer Science',
          isbn: '978-0132350884',
          available: true,
        },
        {
          title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
          author: 'Erich Gamma',
          category: 'Software Engineering',
          isbn: '978-0201633610',
          available: false,
        },
        {
          title: 'The Pragmatic Programmer: Your Journey To Mastery',
          author: 'Andrew Hunt',
          category: 'Programming',
          isbn: '978-0135957059',
          available: true,
        },
      ]);
      console.log('Seeded initial books to MongoDB.');
    } else {
      seededBooks = await Book.find({});
    }

    // Seed Members
    const memberCount = await Member.countDocuments();
    let seededMembers = [];
    if (memberCount === 0) {
      seededMembers = await Member.create([
        {
          name: 'Prince Prajapati',
          email: 'prince@college.edu',
          phone: '1234567890',
          department: 'Computer Engineering',
        },
        {
          name: 'Dev Patel',
          email: 'dev@college.edu',
          phone: '0987654321',
          department: 'Information Technology',
        },
      ]);
      console.log('Seeded initial members to MongoDB.');
    } else {
      seededMembers = await Member.find({});
    }

    // Seed Borrowing Record
    const borrowingCount = await Borrowing.countDocuments();
    if (borrowingCount === 0 && seededBooks.length > 0 && seededMembers.length > 0) {
      await Borrowing.create({
        memberId: seededMembers[0]._id,
        bookId: seededBooks[0]._id,
        borrowDate: new Date('2026-08-10'),
        returnDate: new Date('2026-08-24'),
        status: 'borrowed',
      });
      console.log('Seeded initial borrowing record to MongoDB.');
    }
  } catch (err) {
    console.error('Error seeding MongoDB database:', err.message);
  }
};

// API Endpoints connecting to MongoDB

// GET /api/v1/books -> Return all books from MongoDB
app.get('/api/v1/books', async (req, res, next) => {
  try {
    const booksList = await Book.find({});
    res.status(200).json(booksList);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/books -> Create a new book in MongoDB
app.post('/api/v1/books', async (req, res, next) => {
  try {
    const { title, author, category, isbn, available } = req.body;
    const newBook = new Book({
      title,
      author,
      category,
      isbn,
      available: available !== undefined ? available : true,
    });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    next(err);
  }
});


// GET /api/v1/borrowings -> Return all borrowing records from MongoDB
app.get('/api/v1/borrowings', async (req, res, next) => {
  try {
    const borrowingsList = await Borrowing.find({})
      .populate('memberId')
      .populate('bookId');
    res.status(200).json(borrowingsList);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/members -> Return all members from MongoDB
app.get('/api/v1/members', async (req, res, next) => {
  try {
    const membersList = await Member.find({});
    res.status(200).json(membersList);
  } catch (err) {
    next(err);
  }
});


// POST /api/v1/borrowings -> Create a new borrowing record in MongoDB
app.post('/api/v1/borrowings', async (req, res, next) => {
  try {
    const { memberId, bookId, borrowDate, returnDate, status } = req.body;

    // Build the model instance; validations will be executed by Mongoose during save()
    const newBorrowing = new Borrowing({
      memberId,
      bookId,
      borrowDate,
      returnDate,
      status,
    });

    const savedBorrowing = await newBorrowing.save();
    
    // Return the newly created item
    res.status(201).json(savedBorrowing);
  } catch (err) {
    next(err);
  }
});

// Root status check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Library Book Management System API is running'
  });
});

// Global error-handling middleware (last middleware)
// Formats Mongoose Validation and casting errors returning clear JSON answers
app.use((err, req, res, next) => {
  console.error('API Error Stack:', err.stack);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = `Validation Error: ${Object.values(err.errors).map(val => val.message).join(', ')}`;
  } 
  // Handle Mongoose CastError (e.g., malformed ObjectID in references)
  else if (err.name === 'CastError') {
    status = 400;
    message = `Database Format Error: Invalid value "${err.value}" for field "${err.path}".`;
  }
  // Handle Mongoose Duplicate Key Error
  else if (err.code === 11000) {
    status = 400;
    message = `Database Integrity Error: Duplicate unique value entered: ${JSON.stringify(err.keyValue)}`;
  }

  res.status(status).json({
    error: {
      message: message,
      status: status
    }
  });
});

// MongoDB Connection and Server Startup
if (!MONGO_URI) {
  console.warn('WARNING: MONGO_URI is not defined. Connecting to localhost fallback database.');
}

const dbUri = MONGO_URI || 'mongodb://127.0.0.1:27017/library_exam';

mongoose.connect(dbUri)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    // Seed initial mock database elements
    await seedData();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Running server in fallback mode (MongoDB connection failed).');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (unconnected to DB)`);
    });
  });
