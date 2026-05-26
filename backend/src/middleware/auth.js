const config = require('../config');

const authenticate = (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing bearer token' });
  }

  const token = authorization.slice(7).trim();
  const [role, userId] = token.split(':');

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = {
    id: userId || 'demo-user',
    role,
  };

  return next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return next();
};

module.exports = {
  authenticate,
  authorize,
};
