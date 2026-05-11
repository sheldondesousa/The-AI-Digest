export default function FilterBar({ categories, filters, onChange }) {
  return (
    <div className="filter-bar">
      <select
        value={filters.category}
        onChange={e => onChange(f => ({ ...f, category: e.target.value }))}
      >
        <option value="">All Categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        value={filters.sort}
        onChange={e => onChange(f => ({ ...f, sort: e.target.value }))}
      >
        <option value="desc">Recent first</option>
        <option value="asc">Oldest first</option>
      </select>
      <label className="toggle">
        <input
          type="checkbox"
          checked={filters.unread}
          onChange={e => onChange(f => ({ ...f, unread: e.target.checked }))}
        />
        Unread only
      </label>
    </div>
  )
}
