// client/src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Open Shelf</h3>
          <p>A community for book sharing and lending</p>
        </div>
        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-links">
            <a href="#!"><i className="fab fa-twitter"></i></a>
            <a href="#!"><i className="fab fa-facebook"></i></a>
            <a href="#!"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Open Shelf. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;