const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cinematch_super_secret_jwt_key_2026';

const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies ? req.cookies.token : null;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please sign in.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please sign in again.' });
  }
};

module.exports = {
  authMiddleware,
  JWT_SECRET
};
