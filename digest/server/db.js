import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'digest.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS feeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'General',
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    summary TEXT,
    published_at TEXT,
    is_read INTEGER DEFAULT 0
  );
`);

// Remove old/replaced seed entries from any existing database.
db.prepare(`DELETE FROM feeds WHERE url IN (
  'https://a16z.com/feed/',
  'https://www.anthropic.com/news/rss.xml',
  'https://www.anthropic.com/rss.xml',
  'https://openai.com/blog/rss.xml',
  'https://deepmind.google/blog/rss.xml',
  'https://blog.google/topics/health/rss/',
  'https://news.ycombinator.com/rss',
  'https://arxiv.org/rss/cs.AI',
  'https://arxiv.org/rss/cs.LG',
  'https://www.reddit.com/r/MachineLearning.rss',
  'https://www.reddit.com/r/artificial.rss'
)`).run();

const seedFeeds = [
  // Anthropic has no official RSS — this is a community-maintained mirror of anthropic.com/news
  { name: 'Anthropic News',  url: 'https://raw.githubusercontent.com/taobojlen/anthropic-rss-feed/main/anthropic_news_rss.xml', category: 'AI Research' },
  { name: 'OpenAI Blog',     url: 'https://openai.com/news/rss.xml',                                   category: 'AI Research' },
  { name: 'Google DeepMind', url: 'https://blog.google/technology/google-deepmind/rss/',               category: 'AI Research' },
  { name: 'Google Health',   url: 'https://blog.google/products-and-platforms/products/google-health/rss/', category: 'Health' },
];

const insertFeed = db.prepare(`INSERT OR IGNORE INTO feeds (name, url, category) VALUES (?, ?, ?)`);
for (const feed of seedFeeds) {
  insertFeed.run(feed.name, feed.url, feed.category);
}

export default db;
