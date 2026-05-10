import { useState, useEffect, useCallback } from 'react'
import ArticleCard from './components/ArticleCard'
import FilterBar from './components/FilterBar'
import SourcesTab from './components/SourcesTab'
import SchedulerPanel from './components/SchedulerPanel'

export default function App() {
  const [tab, setTab] = useState('feed')
  const [articles, setArticles] = useState([])
  const [filters, setFilters] = useState({ category: '', unread: false })
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const fetchArticles = useCallback(async () => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.unread) params.set('unread', 'true')
    const res = await fetch(`/api/articles?${params}`)
    const data = await res.json()
    setArticles(data)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  async function handleRefresh() {
    setRefreshing(true)
    await fetch('/api/refresh', { method: 'POST' })
    await fetchArticles()
    setRefreshing(false)
  }

  async function handleMarkRead(id) {
    await fetch(`/api/articles/${id}/read`, { method: 'PATCH' })
    setArticles(prev => prev.map(a => a.id === id ? { ...a, is_read: 1 } : a))
  }

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))]

  return (
    <div className="app">
      <header>
        <div className="header-left">
          <h1>The Digest</h1>
          <span className="subtitle">AI Intelligence, Daily</span>
        </div>
        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title="Toggle light/dark mode"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button className={tab === 'feed' ? 'active' : ''} onClick={() => setTab('feed')}>Feed</button>
        <button className={tab === 'sources' ? 'active' : ''} onClick={() => setTab('sources')}>Sources</button>
        <button className={tab === 'scheduler' ? 'active' : ''} onClick={() => setTab('scheduler')}>Scheduler</button>
      </nav>

      {tab === 'feed' && (
        <main>
          <FilterBar categories={categories} filters={filters} onChange={setFilters} />
          {loading ? (
            <div className="loading">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="empty">No articles yet. Hit Refresh Now to pull feeds.</div>
          ) : (
            <div className="article-list">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} onMarkRead={handleMarkRead} />
              ))}
            </div>
          )}
        </main>
      )}

      {tab === 'sources' && <SourcesTab />}
      {tab === 'scheduler' && <SchedulerPanel refreshing={refreshing} onRefresh={handleRefresh} />}
    </div>
  )
}
