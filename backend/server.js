const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Database connection
const cors = require('cors'); // To handle cross-origin requests

dotenv.config(); // Initialize environment variables

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*', 
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Routes
const bookingRoute = require('./routes/bookingRoutes'); 
const feedbackRoute = require('./routes/feedbackRoutes'); 
const userRoutes = require('./routes/userRoutes'); 

app.use('/api/bookings', bookingRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
