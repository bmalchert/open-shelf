// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import NotFound from './components/layout/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';

// Book Components
import Books from './components/books/Books';
import AddBook from './components/books/AddBook';
import BookDetail from './components/books/BookDetail';
import EditBook from './components/books/EditBook';

// CSS
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Book Routes */}
                <Route path="/books" element={<Books />} />
                <Route path="/books/add" element={<AddBook />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/books/:id/edit" element={<EditBook />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;