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

module.exports = router;
