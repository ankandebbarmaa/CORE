const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { readOrders, writeOrders, readProducts, readVisits } = require('../db');
const { buildAdminAnalytics } = require('../controllers/helpers');

router.get('/orders', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const orders = await readOrders();
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    res.status(500).json({ message: 'Failed to fetch admin orders' });
  }
});

router.put('/orders/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Placed', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];

    if (!status || !validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid or missing status' });

    const orders = await readOrders();
    const index = orders.findIndex(order => order.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Order not found' });

    const order = orders[index];
    order.status = status;

    const now = new Date();
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const formattedDate = `${months[now.getMonth()]} ${now.getDate()}`;

    const statusHierarchy = { Placed:0, Packed:1, Shipped:2, 'In Transit':3, 'Out for Delivery':4, Delivered:5 };
    const targetIndex = statusHierarchy[status];
    order.steps = order.steps.map((step, stepIndex) => {
      if (stepIndex <= targetIndex) {
        return { ...step, done: true, date: step.date === '-' ? formattedDate : step.date };
      }
      return { ...step, done: false, date: '-' };
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

router.get('/metrics', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const orders = await readOrders();
    const products = await readProducts();

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const totalOrders = orders.length;
    const uniqueEmails = new Set(orders.map(order => order?.shippingDetails?.email).filter(Boolean));
    const totalCustomers = uniqueEmails.size;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    res.json({ revenue: totalRevenue, orders: totalOrders, users: totalCustomers, avgOrderValue, productsCount: products.length });
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
});

router.get('/analytics', authenticate, authorize('admin'), async (_req, res) => {
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

module.exports = router;
