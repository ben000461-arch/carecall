import { useState } from 'react'

export default function Alerts({ alerts }) {
  const [dismissed, setDismissed] = useState([])
  const visible = alerts.filter(a => !dismissed.includes(a.id))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Alerts</div>
          <div className="page-sub">AI-flagged concerns from calls</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => setDismissed(alerts.map(a => a.id))}>
            Dismiss all
          </button>
        </div>
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text2)', marginBottom: 6 }}>All clear</div>
          <div style={{ fontSize: 13 }}>No active alerts</div>
        </div>
      )}

      <div className="card">
        {visible.map(a => (
          <div className="alert-item" key={a.id}>
            <div className={`alert-icon ${a.severity === 'high' ? 'alert-high' : 'alert-med'}`} style={{ fontSize: 16 }}>
              {a.severity === 'high' ? '⚠' : '!'}
            </div>
            <div className="alert-content" style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <div className="alert-title" style={{ fontSize: 14 }}>{a.resident} — Room {a.room}</div>
                <span className={`alert-badge ${a.severity === 'high' ? 'badge-high' : 'badge-med'}`}>
                  {a.severity === 'high' ? 'High Priority' : 'Medium'}
                </span>
                <span className="alert-badge badge-new">New</span>
              </div>
              <div className="alert-desc" style={{ fontSize: 13, marginBottom: 10 }}>{a.desc}</div>

              {a.transcript && a.transcript.length > 0 && (
                <div className="transcript-box" style={{ maxHeight: 100, marginBottom: 10 }}>
                  {a.transcript.map((line, i) => (
                    <div className="transcript-line" key={i}>
                      <span className={line.speaker === 'AI' ? 'transcript-ai' : 'transcript-speaker'}>
                        {line.speaker}:{' '}
                      </span>
                      {line.text}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                {a.severity === 'high'
                  ? <button className="btn btn-sm btn-danger">Escalate to Staff</button>
                  : <button className="btn btn-sm btn-danger">Notify Nurse</button>
                }
                <button className="btn btn-sm">Full Transcript</button>
                <button className="btn btn-sm" onClick={() => setDismissed(d => [...d, a.id])}>Dismiss</button>
              </div>
            </div>
            <div className="alert-time" style={{ flexShrink: 0 }}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
