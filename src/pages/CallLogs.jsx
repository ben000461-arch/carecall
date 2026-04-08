import MoodBadge from '../components/MoodBadge'

export default function CallLogs({ callLogs }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Call Logs</div>
          <div className="page-sub">All AI companion calls</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="form-input" style={{ maxWidth: 140 }}><option>All residents</option></select>
          <select className="form-input" style={{ maxWidth: 130 }}><option>Last 7 days</option><option>Today</option><option>Last 30 days</option></select>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Direction</th>
              <th>Duration</th>
              <th>Mood</th>
              <th>Time</th>
              <th>Snippet</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {callLogs.map(call => (
              <tr key={call.id}>
                <td>
                  <strong>{call.resident}</strong><br/>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>Room {call.room}</span>
                </td>
                <td>
                  <span className="tag" style={{
                    background: call.direction === 'Outbound' ? 'var(--accent-light)' : 'var(--info-light)',
                    color: call.direction === 'Outbound' ? 'var(--accent2)' : 'var(--info)'
                  }}>{call.direction}</span>
                </td>
                <td>{call.duration}</td>
                <td><MoodBadge mood={call.mood} /></td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{call.time}</td>
                <td style={{ maxWidth: 200, color: 'var(--text3)', fontStyle: 'italic', fontSize: 12 }}>
                  "{call.snippet.slice(0, 60)}{call.snippet.length > 60 ? '...' : ''}"
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm">Transcript</button>
                    <button className="btn btn-sm btn-danger">Flag</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {callLogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text2)', marginBottom: 6 }}>No calls yet</div>
            <div style={{ fontSize: 13 }}>Calls will appear here once they are completed</div>
          </div>
        )}
      </div>
    </div>
  )
}
