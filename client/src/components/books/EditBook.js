// client/src/components/books/EditBook.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const EditBook = () => {
  const { id } = useParams();
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    isbn: '',
    publisher: '',
    publishedDate: '',
    description: '',
    pageCount: '',
    categories: '',
    thumbnail: '',
    condition: 'Good',
    status: 'Available',
    notes: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Destructure form data
  const {
    title,
    authors,
    isbn,
    publisher,
    publishedDate,
    description,
    pageCount,
    categories,
    thumbnail,
    condition,
    status,
    notes
  } = formData;
  
  // Load book data
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
              title: 'To Kill a Mockingbird',
              authors: ['Harper Lee'],
              isbn: '9780061120084',
              publisher: 'HarperCollins',
              publishedDate: '1960',
              description: 'The story of Scout Finch, her brother Jem, and their father Atticus, during the Great Depression.',
              pageCount: 324,
              categories: ['Fiction', 'Classics', 'Historical Fiction'],
              condition: 'Good',
              status: 'Available',
              notes: 'Bought at the used bookstore downtown',
              imageLinks: {
                thumbnail: 'https://via.placeholder.com/150'
              }
            },
            '2': {
              title: '1984',
              authors: ['George Orwell'],
              isbn: '9780451524935',
              publisher: 'Signet Classics',
              publishedDate: '1949',
              description: 'A dystopian novel about the dangers of totalitarianism.',
              pageCount: 328,
              categories: ['Fiction', 'Classics', 'Dystopian'],
              condition: 'Very Good',
              status: 'Available',
              notes: 'College reading assignment',
              imageLinks: {
                thumbnail: 'https://via.placeholder.com/150'
              }
            }
          };
          
          const foundBook = mockBooks[id];
          
          if (foundBook) {
            setFormData({
              title: foundBook.title,
              authors: foundBook.authors.join(', '),
              isbn: foundBook.isbn || '',
              publisher: foundBook.publisher || '',
              publishedDate: foundBook.publishedDate || '',
              description: foundBook.description || '',
              pageCount: foundBook.pageCount || '',
              categories: foundBook.categories ? foundBook.categories.join(', ') : '',
              thumbnail: foundBook.imageLinks?.thumbnail || '',
              condition: foundBook.condition,
              status: foundBook.status,
              notes: foundBook.notes || ''
            });
          } else {
            setError('Book not found');
          }
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error loading book:', err);
        setError('Failed to load book data. Please try again.');
        setLoading(false);
      }
    };
    
    loadBook();
  }, [id, api]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    // Validate required fields
    if (!title) {
      setError('Title is required');
      return;
    }
    
    if (!authors) {
      setError('At least one author is required');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    // Prepare book data
    const bookData = {
      title,
      authors: authors.split(',').map(author => author.trim()),
      isbn: isbn || undefined,
      publisher: publisher || undefined,
      publishedDate: publishedDate || undefined,
      description: description || undefined,
      pageCount: pageCount ? parseInt(pageCount, 10) : undefined,
      categories: categories ? categories.split(',').map(cat => cat.trim()) : [],
      imageLinks: {
        thumbnail: thumbnail || undefined
      },
      condition,
      status,
      notes: notes || undefined
    };
    
    try {
      // This is where you'd make the actual API call: await api.put(`/api/books/${id}`, bookData);
      
      // Simulate API call
      setTimeout(() => {
        setMessage('Book updated successfully!');
        setSubmitting(false);
        
        // Redirect to book details after short delay
        setTimeout(() => {
          navigate(`/books/${id}`);
        }, 1500);
      }, 1000);
    } catch (err) {
      console.error('Update book error:', err);
      setError(
        err.response?.data?.msg || 
        'Failed to update book. Please try again.'
      );
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="edit-book-loading">Loading book data...</div>;
  }
  
  return (
    <div className="edit-book-container">
      <div className="edit-book-header">
        <h1>Edit Book</h1>
        <Link to={`/books/${id}`} className="btn btn-light">
          Cancel
        </Link>
      </div>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="authors">Author(s) *</label>
          <input
            type="text"
            id="authors"
            name="authors"
            value={authors}
            onChange={onChange}
            placeholder="Separate multiple authors with commas"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="isbn">ISBN</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={isbn}
            onChange={onChange}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={publisher}
              onChange={onChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="publishedDate">Publication Year</label>
            <input
              type="text"
              id="publishedDate"
              name="publishedDate"
              value={publishedDate}
              onChange={onChange}
              placeholder="YYYY"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pageCount">Page Count</label>
            <input
              type="number"
              id="pageCount"
              name="pageCount"
              value={pageCount}
              onChange={onChange}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="categories">Categories</label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={categories}
              onChange={onChange}
              placeholder="Separate with commas"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="thumbnail">Cover Image URL</label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={thumbnail}
            onChange={onChange}
            placeholder="https://example.com/cover.jpg"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="condition">Condition *</label>
            <select
              id="condition"
              name="condition"
              value={condition}
              onChange={onChange}
              required
            >
              <option value="Like New">Like New</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={onChange}
              required
            >
              <option value="Available">Available</option>
              <option value="Lent Out">Lent Out</option>
              <option value="Borrowed">Borrowed</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Personal Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={onChange}
            rows="3"
            placeholder="Add any personal notes about this book (not visible to other users)"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Book'}
        </button>
      </form>
    </div>
  );
};

export default EditBook;