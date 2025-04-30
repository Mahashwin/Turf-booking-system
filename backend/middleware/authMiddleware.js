const jwt = require('jsonwebtoken');

// Middleware to protect routes and verify JWT token
const protect = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user information to request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid' });
  }
};

const generateAuthToken = (user) => {
  const token = jwt.sign({ email: user.email }, "your_jwt_secret", { expiresIn: "1h" });
  return token;
};

module.exports = { protect };
