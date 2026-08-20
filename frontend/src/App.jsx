import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BorrowPage from './pages/BorrowPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <NavLink to="/" className="logo" style={{ textDecoration: 'none' }}>
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">LibSystem</span>
          </NavLink>
          <nav className="nav-menu">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/books" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Books
            </NavLink>
            <NavLink 
              to="/borrow" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Borrowings
            </NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/borrow" element={<BorrowPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Library Book Management System | Built for ITUE301 Exam</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
