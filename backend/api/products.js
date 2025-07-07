const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Helper: Fetch gold price (USD/gram)
async function fetchGoldPrice() {
  return 75; // USD/gram (static fallback)
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const productsPath = path.join(process.cwd(), 'backend', 'data', 'products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const goldPrice = await fetchGoldPrice();

    // Filtering
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
}; 