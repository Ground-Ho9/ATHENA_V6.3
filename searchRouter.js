// backend/routes/searchRouter.js
const express = require('express');
const router = express.Router();
const client = require('../lib/elasticClient');

// POST /search/users { query: 'username' }
router.post('/users', async (req, res) => {
  const { query } = req.body;

  if (!query) return res.status(400).json({ error: 'Query required' });

  try {
    const { body } = await client.search({
      index: 'users',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['username^3', 'displayName', 'bio'],
            fuzziness: 'AUTO'
          }
        }
      }
    });

    const hits = body.hits?.hits.map(hit => hit._source) || [];
    res.json(hits);
  } catch (err) {
  console.error('Elasticsearch error:', err.meta?.body?.error || err.message);
}
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;