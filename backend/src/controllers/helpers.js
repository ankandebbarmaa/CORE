const { uploadImage } = require('../cloudinary');

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

  const statusBreakdown = { placed: 0, packed: 0, shipped: 0, inTransit: 0, outForDelivery: 0, delivered: 0, pending: 0 };
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
        topProductsMap[item.id] = { id: item.id, name: item.name, units: 0, revenue: 0 };
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

  const sortedTopProducts = Object.values(topProductsMap).sort((a, b) => b.units - a.units).slice(0, 6);

  const sortedCountries = Object.entries(countryCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);

  const sortedStates = Object.entries(stateCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);

  const categoryBreakdown = Object.entries(categoryDemand).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const collectionStats = Object.entries(collectionBreakdown).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

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

module.exports = {
  formatLabel,
  normalizeArray,
  normalizeNumber,
  normalizeProductPayload,
  buildAdminAnalytics,
};
