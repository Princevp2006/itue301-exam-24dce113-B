import React from 'react';

/**
 * BookCard Component
 * Displays individual book details.
 * 
 * Props:
 * - title: string
 * - author: string
 * - category: string
 * - available: boolean
 */
const BookCard = ({ title, author, category, available }) => {
  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3 className="book-title">{title}</h3>
        <span className={`badge ${available ? 'badge-available' : 'badge-unavailable'}`}>
          {available ? 'Available' : 'Not Available'}
        </span>
      </div>
      <div className="book-card-body">
        <p className="book-info"><strong>Author:</strong> {author}</p>
        <p className="book-info"><strong>Category:</strong> {category}</p>
      </div>
    </div>
  );
};

export default BookCard;
