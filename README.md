# Open Shelf

A distributed library and book-exchange/book-lending platform that allows users to share their personal libraries with others in their community.

## Project Overview

Open Shelf enables users to:
- Create personal profiles and manage their book collections
- Browse books available from other users
- Request to borrow books from other users
- Manage lending and borrowing of books
- Message other users regarding book exchanges

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (local instance or MongoDB Atlas account)
- npm or yarn package manager

### Server Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/open-shelf
   JWT_SECRET=yoursecretkey_changethisforproduction
   CLIENT_URL=http://localhost:3000
   ```

   Note: For production, use a strong, unique JWT_SECRET.

4. Start the server in development mode:
   ```
   npm run dev
   ```

   This will start the server with nodemon, which automatically restarts on file changes.

### Client Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the client in development mode:
   ```
   npm start
   ```

   This will start the React app at http://localhost:3000.

## Current Functionality

The current implementation includes:

- User registration and authentication
- User profile management
- Privacy settings for user information
- Basic dashboard structure

## Next Steps

Future development will focus on:

1. Implementing the book catalog system
2. Adding Open Library API integration
3. Developing barcode scanning functionality
4. Creating the messaging system
5. Implementing the lending system

## Database Models

The application uses the following MongoDB models:

- **User**: Manages user accounts, profiles, and privacy settings
- **Book**: Tracks books in users' libraries
- **Loan**: Records lending transactions between users
- **Message**: Stores communications between users

## API Endpoints

### Authentication Routes

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate and get token
- `GET /api/auth/me`: Get current user (protected)

### User Routes

- `GET /api/users`: Get all users (limited public info)
- `GET /api/users/:id`: Get user by ID (limited public info)
- `PUT /api/users/profile`: Update user profile (protected)
- `PUT /api/users/password`: Update user password (protected)

## Contributing

This project is open for contributions. Please feel free to submit pull requests or report issues.

## License

[MIT License](LICENSE)