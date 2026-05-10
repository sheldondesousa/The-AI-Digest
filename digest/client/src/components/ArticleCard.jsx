export default function ArticleCard({ article, onMarkRead }) {
  return (
    <div className={`article-card ${!article.is_read ? 'unread' : ''}`}>
      <div className="card-meta">
        {!article.is_read && <span className="unread-dot" />}
        <span className="source">{article.source}</span>
        {article.category && <span className="badge">{article.category}</span>}
        <span className="date">{new Date(article.published_at).toLocaleDateString()}</span>
      </div>
      <h2 className="card-title">
        <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={() => onMarkRead(article.id)}>
          {article.title}
        </a>
      </h2>
      {article.summary && <p className="summary">{article.summary}</p>}
      {!article.is_read && (
        <button className="mark-read-btn" onClick={() => onMarkRead(article.id)}>
          Mark as read
        </button>
      )}
    </div>
  )
}
