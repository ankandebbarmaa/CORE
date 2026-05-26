const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { readProducts, writeProducts } = require('../db');
const { normalizeProductPayload } = require('../controllers/helpers');

router.get('/', async (_req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
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

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const products = await readProducts();
    const index = products.findIndex(product => product.id === req.params.id);

    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = await normalizeProductPayload({ ...products[index], ...req.body, id: req.params.id }, products[index]);
    products[index] = updatedProduct;
    await writeProducts(products);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const products = await readProducts();
    const filtered = products.filter(product => product.id !== req.params.id);

    if (products.length === filtered.length) return res.status(404).json({ message: 'Product not found' });

    await writeProducts(filtered);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
