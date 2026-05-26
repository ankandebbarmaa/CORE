const express = require('express');
const router = express.Router();
const { readVisits, writeVisits } = require('../db');
const { formatLabel } = require('../controllers/helpers');

router.post('/visit', async (req, res) => {
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

module.exports = router;
