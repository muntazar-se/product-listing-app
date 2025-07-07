const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Helper: Fetch gold price (USD/gram)
async function fetchGoldPrice() {
  // Always use fallback for local/dev
  return 75; // USD/gram (static fallback)
}

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
    const goldPrice = await fetchGoldPrice();

    // Filtering (bonus)
    let filtered = products;
    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;

    // Calculate price and popularity for each product
    filtered = filtered.map((product) => {
      const price = (product.popularityScore + 1) * product.weight * goldPrice;
      const popularityOutOf5 = (product.popularityScore * 5).toFixed(1);
      return {
        ...product,
        price: price.toFixed(2),
        popularityOutOf5,
        goldPrice: goldPrice.toFixed(2),
      };
    });

    // Apply filters if present
    if (minPrice) filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(minPrice));
    if (maxPrice) filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
    if (minPopularity) filtered = filtered.filter(p => parseFloat(p.popularityOutOf5) >= parseFloat(minPopularity));
    if (maxPopularity) filtered = filtered.filter(p => parseFloat(p.popularityOutOf5) <= parseFloat(maxPopularity));

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 