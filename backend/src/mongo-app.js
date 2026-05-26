require('dotenv').config();

const express = require('express');
const cors = require('cors');

const config = require('./config');
const { initializeDatabase, readProducts, writeProducts, readOrders, writeOrders, readVisits, writeVisits } = require('./db');
const { uploadImage, isCloudinaryConfigured } = require('./cloudinary');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json({ limit: '12mb' }));

// mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));

const formatLabel = (value, fallback = 'Unknown') => {
  if (!value || typeof value !== 'string') return fallback;
  return value.trim() || fallback;
};

const normalizeArray = (value) => (Array.isArray(value) ? value.map(item => (typeof item === 'string' ? item.trim() : item)).filter(Boolean) : []);

const normalizeNumber = (value) => {
  const parsedValue = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const normalizeProductPayload = async (payload, existingProduct = {}) => {
  const normalized = { ...payload };
  normalized.name = formatLabel(normalized.name, existingProduct.name);
  normalized.category = formatLabel(normalized.category, existingProduct.category);
  normalized.gender = formatLabel(normalized.gender, existingProduct.gender);
  normalized.description = formatLabel(normalized.description, existingProduct.description || '');
  normalized.price = normalizeNumber(normalized.price);
  if (normalized.originalPrice !== undefined && normalized.originalPrice !== null && normalized.originalPrice !== '') {
    normalized.originalPrice = normalizeNumber(normalized.originalPrice);
  }
  normalized.colors = normalizeArray(normalized.colors);
  normalized.sizes = normalizeArray(normalized.sizes);
  normalized.reviews = Array.isArray(normalized.reviews) ? normalized.reviews : (existingProduct.reviews || []);
  normalized.collection = formatLabel(normalized.collection, existingProduct.collection || 'core essentials');
  normalized.isNewArrival = Boolean(normalized.isNewArrival ?? existingProduct.isNewArrival);

  const candidateImage = normalized.image || (Array.isArray(normalized.images) && normalized.images[0]) || existingProduct.image || '';
  if (candidateImage) {
    const uploadedImage = await uploadImage(candidateImage, { folder: 'core/products' });
    normalized.image = uploadedImage;
    normalized.images = Array.isArray(normalized.images) && normalized.images.length > 0
      ? normalized.images.map(image => (image === candidateImage ? uploadedImage : image)).filter(Boolean)
      : [uploadedImage];
  } else if (existingProduct.image) {
    normalized.image = existingProduct.image;
    normalized.images = Array.isArray(existingProduct.images) && existingProduct.images.length > 0
      ? existingProduct.images
      : [existingProduct.image];
  }

  return normalized;
};

const buildAdminAnalytics = (orders, products, visits) => {
  const now = Date.now();
  const liveWindowMs = 5 * 60 * 1000;
  const productMap = new Map(products.map(product => [product.id, product]));

  const uniqueSessionIds = new Set(
    visits.map(visit => visit.sessionId || visit.visitorId).filter(Boolean)
  );

  const liveSessionIds = new Set(
    visits
      .filter(visit => now - new Date(visit.createdAt || visit.timestamp || 0).getTime() <= liveWindowMs)
      .map(visit => visit.sessionId || visit.visitorId)
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
    const day = new Date(now - i * 24 * 60 * 60 * 1000);
    const key = day.toISOString().slice(0, 10);
    dayMap[key] = { date: key, orders: 0, revenue: 0 };
  }

  for (const order of orders) {
    if (!order.createdAt) continue;

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

// auth middleware moved to /src/middleware/auth.js

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', database: 'mongodb', cloudinary: isCloudinaryConfigured });
});

app.post('/api/auth/login', (req, res) => {
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

app.post('/api/analytics/visit', async (req, res) => {
  try {
    const visits = await readVisits();
    const { sessionId, state, country, device, source } = req.body ?? {};

    const entry = {
      sessionId: sessionId || `anon-${Math.floor(Math.random() * 1000000)}`,
      state: formatLabel(state),
      country: formatLabel(country),
      device: formatLabel(device),
      source: formatLabel(source, 'storefront'),
      createdAt: new Date(),
    };

    visits.push(entry);
    await writeVisits(visits);

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Failed to record visit:', error);
    res.status(500).json({ message: 'Failed to record visit' });
  }
});

app.get('/api/products', async (_req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

app.post('/api/uploads/image', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { image } = req.body ?? {};
    if (!image) {
      return res.status(400).json({ message: 'Missing image payload' });
    }

    const url = await uploadImage(image, { folder: 'core/products' });
    res.status(201).json({ url, provider: isCloudinaryConfigured ? 'cloudinary' : 'local' });
  } catch (error) {
    console.error('Failed to upload image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

app.post('/api/products', authenticate, authorize('admin'), async (req, res) => {
  try {
    const products = await readProducts();
    const newProductPayload = req.body ?? {};

    if (!newProductPayload.name || newProductPayload.price === undefined || !newProductPayload.category) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    if (!newProductPayload.image && !(Array.isArray(newProductPayload.images) && newProductPayload.images.length > 0)) {
      return res.status(400).json({ message: 'Missing product image' });
    }

    const product = await normalizeProductPayload(newProductPayload);

    if (!product.id) {
      const prefix = product.gender === 'women' ? 'core-w-' : 'core-';
      const existingCount = products.filter(existingProduct => existingProduct.id && existingProduct.id.startsWith(prefix)).length;
      product.id = `${prefix}${(existingCount + 1).toString().padStart(3, '0')}`;
    }

    product.reviews = product.reviews || [];
    products.push(product);
    await writeProducts(products);

    res.status(201).json(product);
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const products = await readProducts();
    const index = products.findIndex(product => product.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await normalizeProductPayload({ ...products[index], ...req.body, id: req.params.id }, products[index]);
    products[index] = updatedProduct;
    await writeProducts(products);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const products = await readProducts();
    const filtered = products.filter(product => product.id !== req.params.id);

    if (products.length === filtered.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await writeProducts(filtered);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, shippingDetails, deliveryPoint, subtotal, totalDiscount, total } = req.body ?? {};

    if (!items || !items.length || !shippingDetails || !deliveryPoint) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    const orders = await readOrders();
    const orderId = `CR-${Math.floor(1000 + Math.random() * 9000)}`;

    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const formattedDate = `${months[now.getMonth()]} ${now.getDate()}`;

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
        { title: 'DELIVERED', date: '-', done: false },
      ],
    };

    orders.push(newOrder);
    await writeOrders(orders);

    res.status(201).json({ orderId, eta: etaFormatted });
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const orders = await readOrders();
    const order = orders.find(existingOrder => existingOrder.id === req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

app.get('/api/admin/orders', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const orders = await readOrders();
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    res.status(500).json({ message: 'Failed to fetch admin orders' });
  }
});

app.put('/api/admin/orders/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Placed', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status' });
    }

    const orders = await readOrders();
    const index = orders.findIndex(order => order.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[index];
    order.status = status;

    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const formattedDate = `${months[now.getMonth()]} ${now.getDate()}`;

    const statusHierarchy = {
      Placed: 0,
      Packed: 1,
      Shipped: 2,
      'In Transit': 3,
      'Out for Delivery': 4,
      Delivered: 5,
    };

    const targetIndex = statusHierarchy[status];
    order.steps = order.steps.map((step, stepIndex) => {
      if (stepIndex <= targetIndex) {
        return {
          ...step,
          done: true,
          date: step.date === '-' ? formattedDate : step.date,
        };
      }

      return {
        ...step,
        done: false,
        date: '-',
      };
    });

    if (status === 'Packed') order.location = 'PACKING FACILITY';
    else if (status === 'Shipped') order.location = 'SHIPPING HUBS';
    else if (status === 'In Transit') order.location = 'BENGALURU HUB';
    else if (status === 'Out for Delivery') order.location = 'LOCAL COURIER';
    else if (status === 'Delivered') order.location = 'SHIPPED DESTINATION';

    orders[index] = order;
    await writeOrders(orders);

    res.json(order);
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

app.get('/api/admin/metrics', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const orders = await readOrders();
    const products = await readProducts();

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const totalOrders = orders.length;
    const uniqueEmails = new Set(orders.map(order => order?.shippingDetails?.email).filter(Boolean));
    const totalCustomers = uniqueEmails.size;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    res.json({
      revenue: totalRevenue,
      orders: totalOrders,
      users: totalCustomers,
      avgOrderValue,
      productsCount: products.length,
    });
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
});

app.get('/api/admin/analytics', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const orders = await readOrders();
    const products = await readProducts();
    const visits = await readVisits();

    const analytics = buildAdminAnalytics(orders, products, visits);
    res.json(analytics);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled backend error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = {
  app,
  initializeDatabase,
};