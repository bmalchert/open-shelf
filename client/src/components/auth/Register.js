// client/src/components/auth/Register.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    location: ''
  });
  const [formError, setFormError] = useState('');
  
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Set form error from context if exists
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [isAuthenticated, error, clearError, navigate]);
  
  const { name, email, password, password2, location } = formData;
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    if (password !== password2) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    // Clear previous errors
    setFormError('');
    
    // Attempt registration
    const userData = {
      name,
      email,
      password,
      location
    };
    
    const success = await register(userData);
    if (success) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="register-container">
      <h1>Sign Up</h1>
      <p>Create your Open Shelf account</p>
      
      {formError && <div className="alert alert-danger">{formError}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter a password (min 6 characters)"
            minLength="6"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            placeholder="Confirm your password"
            minLength="6"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location (City, Country)</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            placeholder="e.g. New York, USA (optional)"
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
      
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;