import Parser from 'rss-parser';
import db from './db.js';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RSS-reader/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
});

export async function refreshFeeds() {
  const feeds = db.prepare('SELECT * FROM feeds WHERE is_active = 1').all();

  const insertArticle = db.prepare(`
    INSERT OR IGNORE INTO articles (title, url, source, category, summary, published_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let newCount = 0;

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);

      for (const item of parsed.items.slice(0, 10)) {
        const exists = db.prepare('SELECT id FROM articles WHERE url = ?').get(item.link);
        if (exists) continue;

        const content = item.contentSnippet || item.content || item.summary || null;

        insertArticle.run(
          item.title,
          item.link,
          feed.name,
          feed.category,
          content,
          item.pubDate || new Date().toISOString()
        );

        newCount++;
      }
    } catch (err) {
      console.error(`Failed to fetch feed: ${feed.name}`, err.message);
    }
  }

  return newCount;
}
