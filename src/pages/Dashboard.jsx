import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MoodBadge from '../components/MoodBadge'
import ScheduleModal from '../components/ScheduleModal'

export default function Dashboard({ residents, callLogs, schedule, alerts, pollStatus, lastPolled, newCallCount, onResetCount, onPollNow }) {
  const [showSchedule, setShowSchedule] = useState(false)
  const navigate = useNavigate()

  const upcoming = schedule.filter(s => !s.done).slice(0, 4)
  const recentCalls = callLogs.slice(0, 5)
  const activeAlerts = alerts.slice(0, 3)

  function handleShowSchedule() {
    setShowSchedule(true)
    if (onResetCount) onResetCount()
  }

  const positiveCount = residents.filter(r => r.mood === 'positive').length
  const concernCount = residents.filter(r => r.mood === 'concern' || r.mood === 'alert').length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — Live overview</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Live polling indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {pollStatus === 'polling' ? (
              <div className="api-status" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
                <div className="pulse" style={{ background: 'var(--info)' }} />Syncing...
              </div>
            ) : pollStatus === 'error' ? (
              <div className="api-status" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                <span>⚠</span> Sync error
              </div>
            ) : (
              <div className="api-status">
                <div className="pulse" />
                {newCallCount > 0 ? `${newCallCount} new call${newCallCount > 1 ? 's' : ''}` : 'Live'}
              </div>
            )}
            {lastPolled && (
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                Updated {lastPolled.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            )}
            <button className="btn btn-sm" onClick={onPollNow} title="Refresh now">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
            </button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleShowSchedule}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Schedule Call
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Residents</div>
          <div className="stat-value">{residents.length}</div>
          <div className="stat-sub"><span className="status-dot dot-green" />All enrolled</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Calls Today</div>
          <div className="stat-value">{callLogs.length}</div>
          <div className="stat-sub" style={{ color: 'var(--accent)' }}>↑ Live count</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Positive Mood</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{positiveCount}</div>
          <div className="stat-sub">of {residents.length} residents</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Alerts</div>
          <div className="stat-value" style={{ color: alerts.length > 0 ? 'var(--danger)' : 'var(--accent)' }}>{alerts.length}</div>
          <div className="stat-sub">
            {alerts.length > 0
              ? <><span className="status-dot dot-red" />Needs review</>
              : <><span className="status-dot dot-green" />All clear</>
            }
          </div>
        </div>
      </div>

      <div className="two-col">
        <div>
          {/* Recent calls */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Call Activity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {newCallCount > 0 && (
                  <span className="alert-badge badge-new">{newCallCount} new</span>
                )}
                <button className="btn btn-sm" onClick={() => navigate('/calls')}>View all</button>
              </div>
            </div>
            {recentCalls.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                No calls yet today. Schedule one or use Call Now on a resident.
              </div>
            ) : recentCalls.map(call => (
              <div className="call-log-item" key={call.id}>
                <div className={`call-icon ${call.direction === 'Inbound' ? 'call-icon-in' : 'call-icon-out'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={call.direction === 'Inbound' ? '#1e40af' : '#2d6a4f'} strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                  </svg>
                </div>
                <div className="call-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="call-name">{call.resident} <MoodBadge mood={call.mood} /></div>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{call.time}</span>
                  </div>
                  <div className="call-time">Room {call.room} · {call.duration} · {call.direction}</div>
                  <div className="call-snippet">"{call.snippet?.slice(0, 100)}"</div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Upcoming Scheduled Calls</div>
              <button className="btn btn-sm" onClick={() => navigate('/schedule')}>View all</button>
            </div>
            {upcoming.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                No upcoming calls scheduled.
              </div>
            ) : upcoming.map(s => (
              <div className="schedule-row" key={s.id}>
                <div className="schedule-time">{s.time}</div>
                <div style={{ flex: 1 }}>
                  <div className="schedule-name">{s.name}</div>
                  <div className="schedule-type">Room {s.room} · {s.type}</div>
                </div>
                <span className="tag" style={{ background: 'var(--accent-light)', color: 'var(--accent2)' }}>Outbound</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Alerts */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Alerts</div>
              {alerts.length > 0
                ? <span className="alert-badge badge-high">{alerts.length} active</span>
                : <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>All clear</span>
              }
            </div>
            {activeAlerts.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
                No alerts right now
              </div>
            ) : activeAlerts.map(a => (
              <div className="alert-item" key={a.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/alerts')}>
                <div className={`alert-icon ${a.severity === 'high' ? 'alert-high' : 'alert-med'}`}>
                  {a.severity === 'high' ? '⚠' : '!'}
                </div>
                <div className="alert-content">
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                    <div className="alert-title">{a.resident}</div>
                    <span className={`alert-badge ${a.severity === 'high' ? 'badge-high' : 'badge-med'}`}>
                      {a.severity === 'high' ? 'High' : 'Med'}
                    </span>
                  </div>
                  <div className="alert-desc">{a.desc?.slice(0, 80)}...</div>
                  <div className="alert-time">{a.time} today</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mood breakdown */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Resident Mood</div>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>Live</span>
            </div>
            <div className="card-body">
              {[
                ['Positive', residents.filter(r => r.mood === 'positive').length, 'var(--accent-light)', 'var(--accent2)'],
                ['Neutral', residents.filter(r => r.mood === 'neutral').length, 'var(--surface2)', 'var(--text2)'],
                ['Concern', residents.filter(r => r.mood === 'concern').length, 'var(--warn-light)', 'var(--warn)'],
                ['Flagged', residents.filter(r => r.mood === 'alert').length, 'var(--danger-light)', 'var(--danger)'],
              ].map(([label, count, bg, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--text3)', width: 60 }}>{label}</div>
                  <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div style={{
                      width: residents.length ? `${(count / residents.length) * 100}%` : '0%',
                      height: '100%',
                      background: color,
                      borderRadius: 4,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color, width: 20, textAlign: 'right' }}>{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showSchedule && <ScheduleModal residents={residents} onClose={() => setShowSchedule(false)} />}
    </div>
  )
}
