// client/src/components/books/Books.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Books = () => {
  const { api, user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user's books
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        // Replace the mock data with this actual API call
        const res = await api.get('/api/books');
        setBooks(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading books:', err);
        setError('Failed to load books. Please try again.');
        setLoading(false);
      }
    };

    loadBooks();
  }, [api]);

  if (loading) {
    return <div className="books-loading">Loading your library...</div>;
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <h1>My Library</h1>
        <Link to="/books/add" className="btn btn-primary">
          <i className="fas fa-plus"></i> Add Book
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {books.length === 0 ? (
        <div className="no-books">
          <p>You haven't added any books to your library yet.</p>
          <Link to="/books/add" className="btn btn-primary">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <div key={book._id} className="book-card">
              <div className="book-cover">
                {book.imageLinks?.thumbnail ? (
                  <img
                    src={book.imageLinks.thumbnail}
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-book-cover.png';
                    }}
                  />
                ) : (
                  <div className="default-cover">
                    <span>{book.title.substring(0, 1)}</span>
                  </div>
                )}
                <div className={`status-badge status-${book.status.toLowerCase()}`}>
                  {book.status}
                </div>
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="authors">{book.authors.join(', ')}</p>
                <p className="year">{book.publishedDate}</p>
                <p className="condition">Condition: {book.condition}</p>
              </div>
              <div className="book-actions">
                <Link to={`/books/${book._id}`} className="btn btn-light">
                  Details
                </Link>
                <div className="book-status-circle"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;