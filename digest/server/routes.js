import express from 'express';
import db from './db.js';
import { refreshFeeds } from './feeds.js';
import { getNextRun } from './scheduler.js';

const router = express.Router();
let refreshing = false;

router.get('/articles', (req, res) => {
  const { category, unread, sort } = req.query;
  let query = 'SELECT * FROM articles WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (unread === 'true') {
    query += ' AND is_read = 0';
  }

  query += sort === 'asc' ? ' ORDER BY published_at ASC' : ' ORDER BY published_at DESC';

  res.json(db.prepare(query).all(...params));
});

router.patch('/articles/:id/read', (req, res) => {
  db.prepare('UPDATE articles SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/feeds', (req, res) => {
  res.json(db.prepare('SELECT * FROM feeds').all());
});

router.patch('/feeds/:id/toggle', (req, res) => {
  const feed = db.prepare('SELECT * FROM feeds WHERE id = ?').get(req.params.id);
  if (!feed) return res.status(404).json({ error: 'Feed not found' });
  db.prepare('UPDATE feeds SET is_active = ? WHERE id = ?').run(feed.is_active ? 0 : 1, req.params.id);
  res.json({ success: true });
});

router.post('/feeds', (req, res) => {
  const { name, url, category } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'name and url required' });
  try {
    const result = db.prepare('INSERT INTO feeds (name, url, category) VALUES (?, ?, ?)').run(name, url, category || 'General');
    res.json({ id: result.lastInsertRowid, name, url, category: category || 'General', is_active: 1 });
  } catch {
    res.status(409).json({ error: 'Feed URL already exists' });
  }
});

router.post('/refresh', async (req, res) => {
  if (refreshing) return res.status(409).json({ error: 'Refresh already in progress' });
  refreshing = true;
  try {
    const count = await refreshFeeds();
    res.json({ success: true, newArticles: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    refreshing = false;
  }
});

router.get('/status', (req, res) => {
  res.json({ nextRun: getNextRun(), refreshing });
});

export default router;
