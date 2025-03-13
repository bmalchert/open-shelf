// client/src/components/books/BookDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const BookDetail = () => {
  const { id } = useParams();
  const { api, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  
  // Load book details
  useEffect(() => {
    const loadBook = async () => {
      try {
        // For now, we'll use mock data until the backend is implemented
        // This is where you'd make the actual API call: const res = await api.get(`/api/books/${id}`);
        
        // Mock data based on the ID
        setTimeout(() => {
          // Mock different books based on ID
          const mockBooks = {
            '1': {
              _id: '1',
              title: 'To Kill a Mockingbird',
              authors: ['Harper Lee'],
              isbn: '9780061120084',
              publisher: 'HarperCollins',
              publishedDate: '1960',
              description: 'The story of Scout Finch, her brother Jem, and their father Atticus, during the Great Depression. Set in the small Southern town of Maycomb, Alabama, the story centers on the Finch family and the town\'s prejudices through the eyes of Scout Finch.',
              pageCount: 324,
              categories: ['Fiction', 'Classics', 'Historical Fiction'],
              condition: 'Good',
              status: 'Available',
              notes: 'Bought at the used bookstore downtown',
              createdAt: '2024-01-15T12:00:00.000Z',
              imageLinks: {
                thumbnail: 'https://via.placeholder.com/150'
              },
              owner: {
                _id: user._id,
                name: user.name
              }
            },
            '2': {
              _id: '2',
              title: '1984',
              authors: ['George Orwell'],
              isbn: '9780451524935',
              publisher: 'Signet Classics',
              publishedDate: '1949',
              description: 'A dystopian novel about the dangers of totalitarianism. The novel is set in Airstrip One, formerly Great Britain, a province of the superstate Oceania, whose residents are victims of perpetual war, omnipresent government surveillance, and public manipulation.',
              pageCount: 328,
              categories: ['Fiction', 'Classics', 'Dystopian'],
              condition: 'Very Good',
              status: 'Available',
              notes: 'College reading assignment',
              createdAt: '2024-02-10T12:00:00.000Z',
              imageLinks: {
                thumbnail: 'https://via.placeholder.com/150'
              },
              owner: {
                _id: user._id,
                name: user.name
              }
            }
          };
          
          const foundBook = mockBooks[id];
          
          if (foundBook) {
            setBook(foundBook);
          } else {
            setError('Book not found');
          }
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error loading book details:', err);
        setError('Failed to load book details. Please try again.');
        setLoading(false);
      }
    };
    
    loadBook();
  }, [id, api, user._id]);
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      // This is where you'd make the actual API call: await api.delete(`/api/books/${id}`);
      
      // Simulate API call
      setTimeout(() => {
        // Redirect to books page after deletion
        navigate('/books');
      }, 1000);
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again.');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="book-detail-loading">Loading book details...</div>;
  }
  
  if (error) {
    return (
      <div className="book-detail-error">
        <p>{error}</p>
        <Link to="/books" className="btn btn-primary">
          Back to Library
        </Link>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="book-detail-not-found">
        <h2>Book Not Found</h2>
        <p>The book you're looking for doesn't exist or has been removed.</p>
        <Link to="/books" className="btn btn-primary">
          Back to Library
        </Link>
      </div>
    );
  }
  
  return (
    <div className="book-detail-container">
      <div className="book-detail-header">
        <Link to="/books" className="btn btn-light">
          <i className="fas fa-arrow-left"></i> Back to Library
        </Link>
        <div className="book-actions">
          <Link to={`/books/${id}/edit`} className="btn btn-primary">
            <i className="fas fa-edit"></i> Edit
          </Link>
          <button 
            className="btn btn-danger"
            onClick={() => setDeleteModal(true)}
          >
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
      
      <div className="book-detail-content">
        <div className="book-detail-image">
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
            <div className="default-cover large">
              <span>{book.title.substring(0, 1)}</span>
            </div>
          )}
          <div className={`status-badge status-${book.status.toLowerCase()}`}>
            {book.status}
          </div>
        </div>
        
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <h2>by {book.authors.join(', ')}</h2>
          
          <div className="book-meta">
            {book.publishedDate && <span>{book.publishedDate}</span>}
            {book.publisher && <span>{book.publisher}</span>}
            {book.pageCount && <span>{book.pageCount} pages</span>}
          </div>
          
          <div className="book-categories">
            {book.categories && book.categories.map((category, index) => (
              <span key={index} className="category-tag">{category}</span>
            ))}
          </div>
          
          <div className="book-attributes">
            <div className="attribute">
              <strong>Condition:</strong> {book.condition}
            </div>
            {book.isbn && (
              <div className="attribute">
                <strong>ISBN:</strong> {book.isbn}
              </div>
            )}
            <div className="attribute">
              <strong>Added:</strong> {new Date(book.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {book.description && (
            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}
          
          {book.notes && (
            <div className="book-notes">
              <h3>Personal Notes</h3>
              <p>{book.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to remove "{book.title}" from your library?</p>
            <div className="modal-actions">
              <button 
                className="btn btn-light"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;