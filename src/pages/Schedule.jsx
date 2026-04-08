import { useState } from 'react'
import ScheduleModal from '../components/ScheduleModal'

export default function Schedule({ schedule, residents }) {
  const [tab, setTab] = useState('today')
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Scheduling</div>
          <div className="page-sub">Manage outbound call schedules</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Schedule Call
        </button>
      </div>

      <div className="tabs">
        {['today', 'week', 'recurring'].map(t => (
          <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'today' ? 'Today' : t === 'week' ? 'This Week' : 'Recurring'}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            {tab === 'today' ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : tab === 'week' ? 'This Week' : 'Recurring Schedules'}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{schedule.length} calls scheduled</span>
        </div>

        {schedule.map(s => (
          <div className="schedule-row" key={s.id} style={{ opacity: s.done ? 0.5 : 1 }}>
            <div className="schedule-time">{s.time}</div>
            <div style={{ flex: 1 }}>
              <div className="schedule-name">
                {s.name}
                {s.done && <span style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 6 }}>✓ Done</span>}
              </div>
              <div className="schedule-type">Room {s.room} · {s.type} · {s.recur}</div>
            </div>
            {!s.done && (
              <button className="btn btn-sm btn-primary">Call Now</button>
            )}
            <button className="btn btn-sm">Edit</button>
          </div>
        ))}
      </div>

      {showModal && <ScheduleModal residents={residents} onClose={() => setShowModal(false)} />}
    </div>
  )
}
