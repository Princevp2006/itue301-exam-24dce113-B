import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="page-content home-page">
      <div className="hero-section">
        <h1>Welcome to college library system</h1>
        <p>Digitize and manage books, members, and borrowing records seamlessly.</p>
      </div>

      <div className="stats-grid">
        <Link to="/books" className="stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Books Directory</h3>
            <p>Browse, add, and manage cataloged books.</p>
          </div>
        </Link>

        <Link to="/borrow" className="stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h3>Borrowing Ledger</h3>
            <p>Track borrowings, return dates, and overdue status.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
