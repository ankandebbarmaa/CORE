const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable CORS for frontend and admin sites
app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const VISITS_FILE = path.join(__dirname, 'data', 'visits.json');

// Helper functions for file storage
const readProducts = () => {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

const writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
};

const readOrders = () => {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
};

const writeOrders = (orders) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing orders file:', error);
    return false;
  }
};

const readVisits = () => {
  try {
    if (!fs.existsSync(VISITS_FILE)) return [];
    const data = fs.readFileSync(VISITS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading visits file:', error);
    return [];
  }
};

const writeVisits = (visits) => {
  try {
    fs.writeFileSync(VISITS_FILE, JSON.stringify(visits, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing visits file:', error);
    return false;
  }
};

const formatLabel = (value, fallback = 'Unknown') => {
  if (!value || typeof value !== 'string') return fallback;
  return value.trim() || fallback;
};

const buildAdminAnalytics = (orders, products, visits) => {
  const now = Date.now();
  const liveWindowMs = 5 * 60 * 1000;
  const productMap = new Map(products.map(p => [p.id, p]));

  const uniqueSessionIds = new Set(
    visits.map(v => v.sessionId || v.visitorId).filter(Boolean)
  );

  const liveSessionIds = new Set(
    visits
      .filter(v => now - new Date(v.createdAt || v.timestamp || 0).getTime() <= liveWindowMs)
      .map(v => v.sessionId || v.visitorId)
      .filter(Boolean)
  );

  const statusBreakdown = {
    placed: 0,
    packed: 0,
    shipped: 0,
    inTransit: 0,
    outForDelivery: 0,
    delivered: 0,
    pending: 0,
  };

  const countryCounts = {};
  const stateCounts = {};
  const genderDemand = { men: 0, women: 0, unisex: 0 };
  const categoryDemand = {};
  const topProductsMap = {};
  const collectionBreakdown = {};

  let repeatCustomers = 0;
  const customerOrderCount = {};

  for (const order of orders) {
    const status = formatLabel(order.status);
    if (status === 'Placed') statusBreakdown.placed += 1;
    else if (status === 'Packed') statusBreakdown.packed += 1;
    else if (status === 'Shipped') statusBreakdown.shipped += 1;
    else if (status === 'In Transit') statusBreakdown.inTransit += 1;
    else if (status === 'Out for Delivery') statusBreakdown.outForDelivery += 1;
    else if (status === 'Delivered') statusBreakdown.delivered += 1;

    if (status !== 'Delivered') statusBreakdown.pending += 1;

    const email = formatLabel(order?.shippingDetails?.email, 'unknown@unknown');
    customerOrderCount[email] = (customerOrderCount[email] || 0) + 1;

    const state = formatLabel(order?.deliveryPoint?.city);
    const country = formatLabel(order?.deliveryPoint?.country, 'India');
    stateCounts[state] = (stateCounts[state] || 0) + 1;
    countryCounts[country] = (countryCounts[country] || 0) + 1;

    for (const item of order.items || []) {
      const product = productMap.get(item.id) || productMap.get((item.id || '').split('-').slice(0, 2).join('-'));
      const genderKey = product?.gender || 'unisex';
      const categoryKey = product?.category || 'misc';
      const collectionKey = formatLabel(product?.collection, 'core essentials');

      if (genderKey === 'men' || genderKey === 'women' || genderKey === 'unisex') {
        genderDemand[genderKey] += item.quantity || 0;
      }

      categoryDemand[categoryKey] = (categoryDemand[categoryKey] || 0) + (item.quantity || 0);
      collectionBreakdown[collectionKey] = (collectionBreakdown[collectionKey] || 0) + (item.quantity || 0);

      if (!topProductsMap[item.id]) {
        topProductsMap[item.id] = {
          id: item.id,
          name: item.name,
          units: 0,
          revenue: 0,
        };
      }

      topProductsMap[item.id].units += item.quantity || 0;
      topProductsMap[item.id].revenue += (item.quantity || 0) * (item.price || 0);
    }
  }

  for (const count of Object.values(customerOrderCount)) {
    if (count > 1) repeatCustomers += 1;
  }

  for (const visit of visits) {
    const country = formatLabel(visit.country);
    const state = formatLabel(visit.state);
    countryCounts[country] = (countryCounts[country] || 0) + 1;
    stateCounts[state] = (stateCounts[state] || 0) + 1;
  }

  const sortedTopProducts = Object.values(topProductsMap)
    .sort((a, b) => b.units - a.units)
    .slice(0, 6);

  const sortedCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const sortedStates = Object.entries(stateCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const categoryBreakdown = Object.entries(categoryDemand)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const collectionStats = Object.entries(collectionBreakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const dayMap = {};
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = { date: key, orders: 0, revenue: 0 };
  }

  for (const order of orders) {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    if (!dayMap[key]) continue;
    dayMap[key].orders += 1;
    dayMap[key].revenue += order.total || 0;
  }

  const trafficTimeline = Object.values(dayMap);
  const totalVisitors = uniqueSessionIds.size;
  const conversionRate = totalVisitors > 0 ? Number(((orders.length / totalVisitors) * 100).toFixed(2)) : 0;

  return {
    liveUsers: liveSessionIds.size,
    totalVisitors,
    conversionRate,
    pendingOrders: statusBreakdown.pending,
    deliveredOrders: statusBreakdown.delivered,
    statusBreakdown,
    visitorByCountry: sortedCountries,
    visitorByState: sortedStates,
    genderDemand,
    categoryBreakdown,
    collectionBreakdown: collectionStats,
    topProducts: sortedTopProducts,
    repeatCustomers,
    trafficTimeline,
  };
};

// Authenticate and Authorize middleware
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

// --- API Endpoints ---

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { role = 'user', userId = 'demo-user' } = req.body ?? {};

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role must be user or admin' });
  }

  return res.json({
    token: `Bearer ${role}:${userId}`,
    user: {
      id: userId,
      role,
    },
  });
});

app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Public visit tracking to power analytics
app.post('/api/analytics/visit', (req, res) => {
  const visits = readVisits();
  const { sessionId, state, country, device, source } = req.body ?? {};

  const entry = {
    sessionId: sessionId || `anon-${Math.floor(Math.random() * 1000000)}`,
    state: formatLabel(state),
    country: formatLabel(country),
    device: formatLabel(device),
    source: formatLabel(source, 'storefront'),
    createdAt: new Date().toISOString(),
  };

  visits.push(entry);

  // Keep storage bounded.
  const trimmedVisits = visits.slice(-5000);
  writeVisits(trimmedVisits);

  res.status(201).json({ ok: true });
});

// Product Endpoints (Public fetch, Admin mutate)
app.get('/api/products', (_req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post('/api/products', authenticate, authorize('admin'), (req, res) => {
  const products = readProducts();
  const newProduct = req.body;

  if (!newProduct.name || !newProduct.price || !newProduct.category) {
    return res.status(400).json({ message: 'Missing required product fields' });
  }

  // Generate ID if not provided
  if (!newProduct.id) {
    const prefix = newProduct.gender === 'women' ? 'core-w-' : 'core-';
    const existingCount = products.filter(p => p.id.startsWith(prefix)).length;
    newProduct.id = `${prefix}${(existingCount + 1).toString().padStart(3, '0')}`;
  }

  newProduct.reviews = newProduct.reviews || [];
  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticate, authorize('admin'), (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = { ...products[index], ...req.body, id: req.params.id };
  products[index] = updatedProduct;
  writeProducts(products);

  res.json(updatedProduct);
});

app.delete('/api/products/:id', authenticate, authorize('admin'), (req, res) => {
  const products = readProducts();
  const filtered = products.filter(p => p.id !== req.params.id);

  if (products.length === filtered.length) {
    return res.status(404).json({ message: 'Product not found' });
  }

  writeProducts(filtered);
  res.json({ message: 'Product deleted successfully' });
});

// Customer Order Endpoints
app.post('/api/orders', (req, res) => {
  const { items, shippingDetails, deliveryPoint, subtotal, totalDiscount, total } = req.body ?? {};

  if (!items || !items.length || !shippingDetails || !deliveryPoint) {
    return res.status(400).json({ message: 'Missing order details' });
  }

  const orders = readOrders();
  const orderId = `CR-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Format current date
  const now = new Date();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const formattedDate = `${months[now.getMonth()]} ${now.getDate()}`;
  
  // Set ETA to 5 days from now
  const etaDate = new Date();
  etaDate.setDate(now.getDate() + 5);
  const etaFormatted = `${months[etaDate.getMonth()]} ${etaDate.getDate()}, ${etaDate.getFullYear()}`;

  const newOrder = {
    id: orderId,
    items,
    shippingDetails,
    deliveryPoint,
    subtotal,
    totalDiscount,
    total,
    status: 'Placed',
    location: 'WAREHOUSE DEPOT',
    eta: etaFormatted,
    createdAt: now.toISOString(),
    steps: [
      { title: 'ORDER PLACED', date: formattedDate, done: true },
      { title: 'PACKED', date: '-', done: false },
      { title: 'SHIPPED', date: '-', done: false },
      { title: 'IN TRANSIT', date: '-', done: false },
      { title: 'OUT FOR DELIVERY', date: '-', done: false },
      { title: 'DELIVERED', date: '-', done: false }
    ]
  };

  orders.push(newOrder);
  writeOrders(orders);

  res.status(201).json({ orderId, eta: etaFormatted });
});

// Order tracking
app.get('/api/orders/:id', (req, res) => {
  const orders = readOrders();
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

// Admin Order Endpoints
app.get('/api/admin/orders', authenticate, authorize('admin'), (_req, res) => {
  const orders = readOrders();
  // Sort by newest first
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

app.put('/api/admin/orders/:id/status', authenticate, authorize('admin'), (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Placed', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status' });
  }

  const orders = readOrders();
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const order = orders[index];
  order.status = status;

  // Update steps based on status progress
  const now = new Date();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const formattedDate = `${months[now.getMonth()]} ${now.getDate()}`;

  const statusHierarchy = {
    'Placed': 0,
    'Packed': 1,
    'Shipped': 2,
    'In Transit': 3,
    'Out for Delivery': 4,
    'Delivered': 5
  };

  const targetIndex = statusHierarchy[status];
  order.steps = order.steps.map((step, idx) => {
    if (idx <= targetIndex) {
      return {
        ...step,
        done: true,
        date: step.date === '-' ? formattedDate : step.date
      };
    } else {
      return {
        ...step,
        done: false,
        date: '-'
      };
    }
  });

  // Adjust current location based on status
  if (status === 'Packed') order.location = 'PACKING FACILITY';
  else if (status === 'Shipped') order.location = 'SHIPPING HUBS';
  else if (status === 'In Transit') order.location = 'BENGALURU HUB';
  else if (status === 'Out for Delivery') order.location = 'LOCAL COURIER';
  else if (status === 'Delivered') order.location = 'SHIPPED DESTINATION';

  orders[index] = order;
  writeOrders(orders);

  res.json(order);
});

// Admin Metrics
app.get('/api/admin/metrics', authenticate, authorize('admin'), (_req, res) => {
  const orders = readOrders();
  const products = readProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  
  // Unique customer count based on shipping email
  const uniqueEmails = new Set(orders.map(o => o.shippingDetails.email));
  const totalCustomers = uniqueEmails.size;
  
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  res.json({
    revenue: totalRevenue,
    orders: totalOrders,
    users: totalCustomers,
    avgOrderValue: avgOrderValue,
    productsCount: products.length
  });
});

app.get('/api/admin/analytics', authenticate, authorize('admin'), (_req, res) => {
  const orders = readOrders();
  const products = readProducts();
  const visits = readVisits();

  const analytics = buildAdminAnalytics(orders, products, visits);
  res.json(analytics);
});

module.exports = app;

