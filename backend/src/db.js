const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/Product');
const Order = require('./models/Order');
const Visit = require('./models/Visit');
const Category = require('./models/Category');
const Payment = require('./models/Payment');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/core';
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const VISITS_FILE = path.join(__dirname, 'data', 'visits.json');

let connectPromise;
let storageMode = 'mongo';

const readJsonFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return true;
};

const connectDatabase = async () => {
  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGODB_URI);
  }

  await connectPromise;
  return mongoose.connection;
};

const readSeedFile = async (fileName) => {
  const filePath = path.join(__dirname, 'data', fileName);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content || '[]');
};

const seedCollection = async (Model, fileName, force = false) => {
  if (force) {
    await Model.deleteMany({});
  } else {
    const count = await Model.countDocuments();
    if (count > 0) return;
  }

  const records = await readSeedFile(fileName);
  if (records.length > 0) {
    await Model.insertMany(records);
  }
};

const initializeDatabase = async () => {
  try {
    await connectDatabase();
    storageMode = 'mongo';
    await Promise.all([
      seedCollection(Product, 'products.json', true),
      seedCollection(Order, 'orders.json', false),
    ]);
  } catch (error) {
    storageMode = 'file';
    console.warn('MongoDB unavailable, using file storage fallback:', error.message);
  }
};

const readProducts = async () => {
  if (storageMode === 'mongo') {
    return Product.find().lean();
  }

  return readJsonFile(PRODUCTS_FILE);
};

const writeProducts = async (products) => {
  if (storageMode === 'mongo') {
    await Product.deleteMany({});

    if (products.length > 0) {
      await Product.insertMany(products);
    }

    return true;
  }

  await writeJsonFile(PRODUCTS_FILE, products);
  return true;
};

const readOrders = async () => {
  if (storageMode === 'mongo') {
    return Order.find().lean();
  }

  return readJsonFile(ORDERS_FILE);
};

const writeOrders = async (orders) => {
  if (storageMode === 'mongo') {
    await Order.deleteMany({});

    if (orders.length > 0) {
      await Order.insertMany(orders);
    }

    return true;
  }

  await writeJsonFile(ORDERS_FILE, orders);
  return true;
};

const readVisits = async () => {
  if (storageMode === 'mongo') {
    return Visit.find().sort({ createdAt: 1 }).lean();
  }

  return readJsonFile(VISITS_FILE);
};

const writeVisits = async (visits) => {
  if (storageMode === 'mongo') {
    await Visit.deleteMany({});

    if (visits.length > 0) {
      await Visit.insertMany(visits.slice(-5000));
    }

    return true;
  }

  await writeJsonFile(VISITS_FILE, visits.slice(-5000));
  return true;
};

const getStorageMode = () => storageMode;

module.exports = {
  initializeDatabase,
  readProducts,
  writeProducts,
  readOrders,
  writeOrders,
  readVisits,
  writeVisits,
  getStorageMode,
};