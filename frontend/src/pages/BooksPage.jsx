import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';

const BooksPage = () => {
  // Required states: data, loading, error
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    available: true,
  });

  // Fetch books from Express API on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/v1/books');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch books: Server returned status ${response.status}`);
        }
        
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.message || 'An error occurred while loading books.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setNewBook(prev => ({
      ...prev,
      available: value === 'true'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      alert('Please fill out Title, Author, and ISBN fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error?.message || 'Failed to save the book.');
      }

      const savedBook = await response.json();
      setData([savedBook, ...data]);
      setNewBook({
        title: '',
        author: '',
        category: '',
        isbn: '',
        available: true,
      });
      setShowAddForm(false);
    } catch (err) {
      alert(`Error saving book: ${err.message}`);
    }
  };


  return (
    <div className="page-content books-page">
      <div className="page-header">
        <h2>Books Catalogue</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading}
        >
          {showAddForm ? 'Cancel' : 'Add New Book'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <h3>Add a New Book</h3>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              placeholder="e.g. Introduction to Algorithms"
              required
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              placeholder="e.g. Thomas H. Cormen"
              required
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={newBook.category}
                onChange={handleInputChange}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input
                type="text"
                name="isbn"
                value={newBook.isbn}
                onChange={handleInputChange}
                placeholder="e.g. 978-0262033848"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Availability</label>
            <select value={newBook.available} onChange={handleSelectChange}>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
          <button type="submit" className="btn btn-submit">Save Book</button>
        </form>
      )}

      {/* Conditionally render Loading state */}
      {loading && (
        <div className="loading-state" style={{
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '1.2rem',
          fontWeight: 600
        }}>
          <div className="spinner" style={{
            border: '4px solid rgba(0,0,0,0.1)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            borderLeftColor: 'var(--primary)',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          Loading books catalogue...
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Conditionally render Error state */}
      {error && (
        <div className="error-state" style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚠️</span>
          {error}
        </div>
      )}

      {/* Render book data after successful request */}
      {!loading && !error && (
        <div className="books-grid">
          {data.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>No books found in the library catalog.</p>
          ) : (
            data.map((book) => (
              <BookCard
                key={book.isbn}
                title={book.title}
                author={book.author}
                category={book.category}
                available={book.available}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
