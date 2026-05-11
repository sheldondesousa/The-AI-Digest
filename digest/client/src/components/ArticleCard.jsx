import { useState } from 'react'

export default function ArticleCard({ article, onMarkRead }) {
  const [placeholderBg, setPlaceholderBg] = useState(null)

  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  let faviconUrl = null
  try {
    const { hostname } = new URL(article.url)
    faviconUrl = `/api/favicon-proxy?domain=${hostname}`
  } catch {
    // invalid URL
  }

  function handleFaviconLoad(e) {
    try {
      const img = e.target
      const canvas = document.createElement('canvas')
      const size = 64
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)
      // Sample the four corners to find the favicon background color
      const corners = [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]]
      for (const [x, y] of corners) {
        const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data
        if (a > 200) {
          setPlaceholderBg(`rgb(${r},${g},${b})`)
          return
        }
      }
    } catch {
      // Keep default placeholder background
    }
  }

  const preview = article.summary
    ? article.summary.slice(0, 300) + (article.summary.length > 300 ? '...' : '')
    : null

  function handleCheckbox(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!article.is_read) onMarkRead(article.id)
  }

  return (
    <li className={`story-item${!article.is_read ? ' unread' : ''}`}>
      <a
        className="story-link"
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onMarkRead(article.id)}
      >
        {article.image ? (
          <img className="story-thumbnail" src={article.image} alt="" />
        ) : (
          <div
            className="story-thumbnail story-thumbnail--placeholder"
            style={placeholderBg ? { background: placeholderBg, borderColor: placeholderBg } : undefined}
          >
            {faviconUrl && (
              <img
                className="story-favicon"
                src={faviconUrl}
                alt={article.source}
                onLoad={handleFaviconLoad}
              />
            )}
          </div>
        )}
        <div className="story-content">
          <div className="story-meta">
            <time className="story-date">{date}</time>
            {article.category && (
              <span className="story-category">{article.category}</span>
            )}
          </div>
          <h2 className="story-title">{article.title}</h2>
          {preview && <p className="story-preview">{preview}</p>}
          <div className="story-footer">
            <label className="read-checkbox" onClick={handleCheckbox}>
              <input
                type="checkbox"
                checked={!!article.is_read}
                readOnly
              />
              <span>{article.is_read ? 'Read' : 'Mark as read'}</span>
            </label>
          </div>
        </div>
      </a>
    </li>
  )
}
