require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { initializeDatabase } = require('./db');
const { isCloudinaryConfigured } = require('./cloudinary');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '12mb' }));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'backend',
    database: 'mongodb',
    cloudinary: isCloudinaryConfigured
  });
});

// Error handling middleware
app.use((error, _req, res, _next) => {
  console.error('Unhandled backend error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;

// Start server locally if file is executed directly
if (require.main === module) {
  const startServer = async () => {
    try {
      await initializeDatabase();
      app.listen(PORT, () => {
        console.log(`Backend API listening on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start backend server:', error);
      process.exit(1);
    }
  };
  startServer();
}

module.exports = app;
