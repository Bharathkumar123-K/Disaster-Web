const Parser = require('rss-parser');
const parser = new Parser();
const RawPost = require('../models/RawPost');

// Use ReliefWeb Disaster RSS feed as a sample
const RSS_URL = 'https://reliefweb.int/updates/rss.xml';

async function ingestRSS() {
  console.log(`[Ingestion] Fetching RSS feed from ${RSS_URL}...`);
  try {
    const feed = await parser.parseURL(RSS_URL);
    let newItems = 0;
    
    for (const item of feed.items) {
      // Basic normalization
      const sourceId = item.guid || item.id || item.link;
      const text = item.contentSnippet || item.content;
      
      const exists = await RawPost.findOne({ sourceId, source: 'ReliefWeb_RSS' });
      
      if (!exists) {
        await RawPost.create({
          source: 'ReliefWeb_RSS',
          sourceId,
          title: item.title,
          text,
          url: item.link,
          rawTimestamp: item.pubDate ? new Date(item.pubDate) : new Date(),
          processed: false
        });
        newItems++;
      }
    }
    
    console.log(`[Ingestion] Processed ${feed.items.length} items. Inserted ${newItems} new raw posts.`);
  } catch (error) {
    console.error('[Ingestion] Error fetching RSS feed:', error.message);
  }
}

module.exports = { ingestRSS };
