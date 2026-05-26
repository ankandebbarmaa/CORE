const { app, initializeDatabase } = require('./mongo-app');

const PORT = process.env.PORT || 4000;

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
