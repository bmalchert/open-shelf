// client/src/components/dashboard/Dashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  
  // Placeholder for loading books and loans data
  useEffect(() => {
    // This will be replaced with actual API calls when those routes are implemented
    setBooks([]);
    setLoans([]);
  }, []);

  return loading || !user ? (
    <div>Loading...</div>
  ) : (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="lead">Welcome, {user.name}</p>
      
      <div className="dashboard-grid">
        {/* My Library Section */}
        <div className="dashboard-section">
          <h2>My Library</h2>
          {books.length > 0 ? (
            <div className="book-list">
              {/* Book list items would go here */}
              <p>You have {books.length} books in your library</p>
            </div>
          ) : (
            <div className="no-items">
              <p>You haven't added any books to your library yet.</p>
              <Link to="/books/add" className="btn btn-primary">
                Add a Book
              </Link>
            </div>
          )}
        </div>
        
        {/* Loans Section */}
        <div className="dashboard-section">
          <h2>My Loans</h2>
          {loans.length > 0 ? (
            <div className="loan-list">
              {/* Loan list items would go here */}
              <p>You have {loans.length} active loans</p>
            </div>
          ) : (
            <div className="no-items">
              <p>You don't have any active loans.</p>
              <Link to="/browse" className="btn btn-primary">
                Browse Books
              </Link>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/books/add" className="btn">
              <i className="fas fa-plus"></i> Add Book
            </Link>
            <Link to="/browse" className="btn">
              <i className="fas fa-search"></i> Browse Books
            </Link>
            <Link to="/profile" className="btn">
              <i className="fas fa-user"></i> Edit Profile
            </Link>
            <Link to="/messages" className="btn">
              <i className="fas fa-envelope"></i> Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;