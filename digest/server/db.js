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

// Remove old broken seed entries that may already be in an existing database.
db.prepare(`DELETE FROM feeds WHERE url IN ('https://a16z.com/feed/', 'https://www.anthropic.com/news/rss.xml')`).run();

const seedFeeds = [
  { name: 'Anthropic News',    url: 'https://www.anthropic.com/rss.xml',                      category: 'AI Research' },
  { name: 'OpenAI Blog',       url: 'https://openai.com/blog/rss.xml',                         category: 'AI Research' },
  { name: 'Google DeepMind',   url: 'https://deepmind.google/blog/rss.xml',                    category: 'AI Research' },
  { name: 'Hacker News',       url: 'https://news.ycombinator.com/rss',                        category: 'Tech News'   },
  { name: 'arXiv cs.AI',       url: 'https://arxiv.org/rss/cs.AI',                             category: 'AI Research' },
  { name: 'arXiv cs.LG',       url: 'https://arxiv.org/rss/cs.LG',                             category: 'AI Research' },
  { name: 'r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning.rss',            category: 'Community'   },
  { name: 'r/artificial',      url: 'https://www.reddit.com/r/artificial.rss',                 category: 'Community'   },
];

const insertFeed = db.prepare(`INSERT OR IGNORE INTO feeds (name, url, category) VALUES (?, ?, ?)`);
for (const feed of seedFeeds) {
  insertFeed.run(feed.name, feed.url, feed.category);
}

export default db;
