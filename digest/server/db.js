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

const seedFeeds = [
  // a16z (https://a16z.com/feed/) and Anthropic Blog (https://www.anthropic.com/news/rss.xml)
  // were removed — both URLs 404. Add working feed URLs via the API or UI.
];

const insertFeed = db.prepare(`INSERT OR IGNORE INTO feeds (name, url, category) VALUES (?, ?, ?)`);
for (const feed of seedFeeds) {
  insertFeed.run(feed.name, feed.url, feed.category);
}

export default db;
