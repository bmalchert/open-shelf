// client/src/components/layout/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li className="dropdown">
        <span className="dropdown-trigger">Books <i className="fas fa-caret-down"></i></span>
        <div className="dropdown-menu">
          <Link to="/books">My Library</Link>
          <Link to="/books/add">Add Book</Link>
        </div>
      </li>
      <li>
        <Link to="/messages">Messages</Link>
      </li>
      <li>
        <Link to="/profile">
          {user && user.name ? 
            <span>
              <i className="fas fa-user"></i> {user.name.split(' ')[0]}
            </span> : 
            'Profile'
          }
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">
          <i className="fas fa-book"></i> Open Shelf
        </Link>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;