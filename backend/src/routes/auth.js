const express = require('express');
const router = express.Router();
const config = require('../config');
const { authenticate } = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { role = 'user', userId = 'demo-user', password } = req.body ?? {};

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role must be user or admin' });
  }

  if (role === 'admin') {
    const expected = config.ADMIN_PASSWORD || 'admin123';
    if (!password || password !== expected) {
      return res.status(401).json({ message: 'Invalid admin password' });
    }
  }

  return res.json({ token: `Bearer ${role}:${userId}`, user: { id: userId, role } });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
