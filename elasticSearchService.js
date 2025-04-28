
// services/elasticSearchService.js

import { elasticSearchClient } from '../utils/elasticSearchClient'; // hypothetical ES wrapper

export const searchElastic = async (query) => {
  try {
    const response = await elasticSearchClient.search({
      index: ['users', 'posts', 'tournaments'],
      body: {
        query: {
          multi_match: {
            query,
            fields: ['username^3', 'displayName', 'body', 'tags', 'title', 'organizer', 'location']
          }
        }
      }
    });

    const hits = response.hits?.hits || [];
    return hits.map(hit => ({ ...hit._source, _type: hit._index }));
  } catch (err) {
  console.error('ElasticSearch error:', err);
}
    return [];
  }
};
