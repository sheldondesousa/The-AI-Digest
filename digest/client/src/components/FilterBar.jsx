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
