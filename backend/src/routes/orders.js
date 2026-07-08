const express = require('express');
const router = express.Router();
const { readOrders, writeOrders } = require('../db');

router.post('/', async (req, res) => {
  try {
    const { items, shippingDetails, deliveryPoint, subtotal, totalDiscount, total } = req.body ?? {};

    if (!items || !items.length || !shippingDetails || !deliveryPoint) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    const orders = await readOrders();
    const orderId = `CR-${Math.floor(1000 + Math.random() * 9000)}`;

    const now = new Date();
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
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

router.get('/:id', async (req, res) => {
  try {
    const orders = await readOrders();
    const order = orders.find(existingOrder => existingOrder.id === req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Fetch orders by phone number
router.get('/phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const orders = await readOrders();
    const userOrders = orders.filter(
      order => order?.shippingDetails?.phone === phone
    );
    // Sort by newest first
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userOrders);
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});

// Cancel order by user
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await readOrders();
    const index = orders.findIndex(order => order.id === id);
    if (index === -1) return res.status(404).json({ message: 'Order not found' });

    const order = orders[index];
    if (order.status !== 'Placed') {
      return res.status(400).json({ message: 'Only placed orders can be cancelled' });
    }

    order.status = 'Cancelled';
    order.location = 'CANCELLED';
    order.steps = order.steps.map(step => {
      if (step.title === 'ORDER PLACED') return { ...step, done: true };
      return { ...step, done: false, date: '-' };
    });

    orders[index] = order;
    await writeOrders(orders);
    res.json(order);
  } catch (error) {
    console.error('Failed to cancel order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

module.exports = router;
