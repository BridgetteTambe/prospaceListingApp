import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protects routes: requires a valid, non-expired Bearer token.
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // jwt.verify throws if the token is invalid OR expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); // password excluded by schema (select: false)
    if (!req.user) {
      return res.status(401).json({ message: 'Token valid but user no longer exists' });
    }
    next();
  } catch (error) {
    const expired = error.name === 'TokenExpiredError';
    return res
      .status(401)
      .json({ message: expired ? 'Session expired, please log in again' : 'Not authorized, token failed' });
  }
};

// Optional role gate, e.g. router.delete('/:id', protect, authorize('admin'), handler)
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};
