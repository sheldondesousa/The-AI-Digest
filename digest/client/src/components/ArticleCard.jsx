export default function ArticleCard({ article, onMarkRead }) {
  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  let faviconUrl = null
  try {
    const { hostname } = new URL(article.url)
    faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  } catch {
    // invalid URL
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
          <div className="story-thumbnail story-thumbnail--placeholder">
            {faviconUrl && <img className="story-favicon" src={faviconUrl} alt={article.source} />}
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
        </div>
      </a>
    </li>
  )
}
