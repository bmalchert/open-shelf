// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const { router: authRouter } = require('./routes/auth');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const loansRouter = require('./routes/loans');
const messagesRouter = require('./routes/messages');

// Use routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/books', booksRouter);
app.use('/api/loans', loansRouter);
app.use('/api/messages', messagesRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Open Shelf Library API is running');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  // Set up real-time messaging
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on('sendMessage', async (messageData) => {
    try {
      const { sender, recipient, content, relatedBook, relatedLoan } = messageData;
      
      // Create and save the message
      const Message = mongoose.model('Message');
      const newMessage = new Message({
        sender,
        recipient,
        content,
        relatedBook,
        relatedLoan
      });
      
      const savedMessage = await newMessage.save();
      
      // Populate the message with sender and recipient info
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate('sender', 'name avatar')
        .populate('recipient', 'name avatar')
        .populate('relatedBook', 'title')
        .populate('relatedLoan');
      
      // Emit the message to both sender and recipient rooms
      io.to(recipient).emit('newMessage', populatedMessage);
      io.to(sender).emit('messageSent', populatedMessage);
      
    } catch (error) {
      console.error('Socket message error:', error.message);
    }
  });
  
  // Handle loan notifications
  socket.on('loanUpdate', ({ loanId, status, userId }) => {
    // Emit loan update to the user
    io.to(userId).emit('loanStatusChanged', { loanId, status });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});