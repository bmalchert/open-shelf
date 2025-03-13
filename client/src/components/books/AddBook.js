// client/src/components/books/AddBook.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const AddBook = () => {
  const { api, user } = useContext(AuthContext);
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
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
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
    notes
  } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const resetForm = () => {
    setFormData({
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
      notes: ''
    });
  };
  
  const onSearchChange = e => {
    setSearchQuery(e.target.value);
  };
  
  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    setSearchResults([]);
    setSearchQuery('');
  };
  
  const searchBooks = async e => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setSearchLoading(true);
    setError('');
    
    try {
      // In a full implementation, this would call the Open Library API
      // For now, we'll simulate a search with a timeout
      setTimeout(() => {
        // Mock search results based on query
        const mockResults = [
          {
            id: '1',
            title: `${searchQuery} - A Novel`,
            authors: ['John Doe', 'Jane Smith'],
            isbn: '9781234567897',
            publisher: 'Mock Publisher',
            publishedDate: '2022',
            description: `A book about ${searchQuery}`,
            pageCount: 320,
            categories: ['Fiction', 'Drama'],
            thumbnail: 'https://via.placeholder.com/150'
          },
          {
            id: '2',
            title: `The History of ${searchQuery}`,
            authors: ['Historical Author'],
            isbn: '9789876543210',
            publisher: 'Academic Press',
            publishedDate: '2020',
            description: `Historical account of ${searchQuery}`,
            pageCount: 450,
            categories: ['Non-fiction', 'History'],
            thumbnail: 'https://via.placeholder.com/150'
          }
        ];
        
        setSearchResults(mockResults);
        setSearchLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error searching for books. Please try again.');
      setSearchLoading(false);
    }
  };
  
  const selectBookFromSearch = book => {
    setFormData({
      ...formData,
      title: book.title,
      authors: book.authors.join(', '),
      isbn: book.isbn,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      description: book.description,
      pageCount: book.pageCount,
      categories: book.categories.join(', '),
      thumbnail: book.thumbnail
    });
    
    setSearchMode(false);
    setSearchResults([]);
    setSearchQuery('');
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
    
    setLoading(true);
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
      notes: notes || undefined
    };
    
    try {
      // Send request to add book
      const res = await api.post('/api/books', bookData);
      
      setMessage('Book added successfully!');
      resetForm();
      
      // Redirect to book details after short delay
      setTimeout(() => {
        navigate(`/books/${res.data._id}`);
      }, 2000);
    } catch (err) {
      console.error('Add book error:', err);
      setError(
        err.response?.data?.msg || 
        'Failed to add book. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="add-book-container">
      <h1>Add a Book to Your Library</h1>
      
      <div className="search-toggle">
        <button 
          onClick={toggleSearchMode}
          className="btn btn-light"
        >
          {searchMode ? 'Enter Book Details Manually' : 'Search for a Book'}
        </button>
      </div>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {searchMode ? (
        <div className="search-section">
          <h2>Search for a Book</h2>
          <p>Find a book by title, author, or ISBN</p>
          
          <form onSubmit={searchBooks} className="search-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter title, author, or ISBN"
                value={searchQuery}
                onChange={onSearchChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={searchLoading}
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {searchLoading && <div>Searching...</div>}
          
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results</h3>
              {searchResults.map(book => (
                <div key={book.id} className="search-result-item">
                  <div className="search-result-content">
                    <h4>{book.title}</h4>
                    <p>By: {book.authors.join(', ')}</p>
                    <p>{book.publishedDate} • {book.pageCount} pages</p>
                    <p>{book.description.substring(0, 100)}...</p>
                  </div>
                  <div className="search-result-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => selectBookFromSearch(book)}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {searchResults.length === 0 && searchQuery && !searchLoading && (
            <div className="no-results">
              <p>No books found matching your search.</p>
            </div>
          )}
        </div>
      ) : (
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
            disabled={loading}
          >
            {loading ? 'Adding Book...' : 'Add to Library'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddBook;