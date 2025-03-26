const jwt = require("jsonwebtoken");
const { RegistrationUser } = require("../models/index");

const auth = async (req, res, next) => {
  try {
    // Extract token from multiple possible sources
    let token;
    
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Fallback to body token
    else if (req.body.token) {
      token = req.body.token;
    }
    
    // If no token found, return unauthorized
    if (!token) {
      return res.status(401).send({ error: "No authentication token provided" });
    }

    // Verify token
    const verifyUser = jwt.verify(token, process.env.JWT_SECRET, {
      // Optional: Add token expiration check
      maxAge: '24h' // Token expires in 24 hours
    });

    // Find user and verify
    const user = await RegistrationUser.findOne({ 
      _id: verifyUser._id 
    });

    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    // Attach user and token to request
    req.token = token;
    req.user = user;

    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    // Different error handling based on error type
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: "Invalid authentication token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: "Authentication token expired" });
    }

    // Log the error for debugging
    console.error('Authentication middleware error:', error);
    
    // Generic error response
    res.status(401).send({ error: "Authentication failed" });
  }
};

module.exports = auth;