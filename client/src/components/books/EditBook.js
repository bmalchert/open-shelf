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
  // Loading book data in EditBook.js
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/books/${id}`);

        // Extract data from response
        const bookData = res.data;

        // Update form state with real data
        setFormData({
          title: bookData.title,
          authors: bookData.authors.join(', '),
          isbn: bookData.isbn || '',
          publisher: bookData.publisher || '',
          publishedDate: bookData.publishedDate || '',
          description: bookData.description || '',
          pageCount: bookData.pageCount || '',
          categories: bookData.categories ? bookData.categories.join(', ') : '',
          thumbnail: bookData.imageLinks?.thumbnail || '',
          condition: bookData.condition,
          status: bookData.status,
          notes: bookData.notes || ''
        });

        setLoading(false);
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
      // Make the real API call to update the book
      await api.put(`/api/books/${id}`, bookData);

      setMessage('Book updated successfully!');
      setSubmitting(false);

      // Redirect to book details after short delay
      setTimeout(() => {
        navigate(`/books/${id}`);
      }, 1500);
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