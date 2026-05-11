import { useState, useEffect } from 'react'

export default function SchedulerPanel({ refreshing, onRefresh }) {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch('/api/status').then(r => r.json()).then(setStatus)
  }, [refreshing])

  const nextRun = status?.nextRun ? new Date(status.nextRun) : null

  return (
    <div className="scheduler-panel">
      <h2>Scheduler</h2>
      <div className="scheduler-card">
        <div className="scheduler-row">
          <span>Schedule</span>
          <strong>Daily at 7:00 AM</strong>
        </div>
        <div className="scheduler-row">
          <span>Next refresh</span>
          <strong>{nextRun ? nextRun.toLocaleString() : '—'}</strong>
        </div>
        <div className="scheduler-row">
          <span>Status</span>
          <strong className={refreshing ? 'refreshing-text' : 'idle-text'}>
            {refreshing ? 'Refreshing...' : 'Idle'}
          </strong>
        </div>
      </div>
      <button className="refresh-btn" onClick={onRefresh} disabled={refreshing}>
        {refreshing ? 'Refreshing...' : 'Refresh Now'}
      </button>
    </div>
  )
}
