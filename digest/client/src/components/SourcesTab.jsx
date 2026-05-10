import { useState, useEffect } from 'react'

export default function SourcesTab() {
  const [feeds, setFeeds] = useState([])
  const [form, setForm] = useState({ name: '', url: '', category: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/feeds').then(r => r.json()).then(setFeeds)
  }, [])

  async function toggleFeed(id) {
    await fetch(`/api/feeds/${id}/toggle`, { method: 'PATCH' })
    setFeeds(prev => prev.map(f => f.id === id ? { ...f, is_active: f.is_active ? 0 : 1 } : f))
  }

  async function addFeed(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setFeeds(prev => [...prev, data])
    setForm({ name: '', url: '', category: '' })
  }

  return (
    <div className="sources-tab">
      <h2>Feed Sources</h2>
      <div className="feeds-list">
        {feeds.map(feed => (
          <div key={feed.id} className={`feed-item ${!feed.is_active ? 'inactive' : ''}`}>
            <div>
              <strong>{feed.name}</strong>
              <span className="badge">{feed.category}</span>
              <small>{feed.url}</small>
            </div>
            <button className="toggle-btn" onClick={() => toggleFeed(feed.id)}>
              {feed.is_active ? 'Disable' : 'Enable'}
            </button>
          </div>
        ))}
      </div>

      <h3>Add New Source</h3>
      <form className="add-feed-form" onSubmit={addFeed}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          placeholder="RSS URL"
          value={form.url}
          onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
          required
        />
        <input
          placeholder="Category (optional)"
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
        />
        <button type="submit">Add Feed</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
