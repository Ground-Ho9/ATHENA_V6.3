// backend/lib/elasticClient.js
const { Client } = require('@elastic/elasticsearch');

// Placeholder: replace with real credentials and endpoint
const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'changeme'
  }
});

module.exports = client;