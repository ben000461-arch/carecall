import { useState } from 'react'
import MoodBadge from '../components/MoodBadge'
import AddResidentModal from '../components/AddResidentModal'
import { blandCallNow, BLAND_API_KEY } from '../lib/bland'

export default function Residents({ residents, onAdd, onCallResult }) {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [callingId, setCallingId] = useState(null)
  const [callResults, setCallResults] = useState({})

  const filtered = residents.filter(r =>
    `${r.first} ${r.last} ${r.room}`.toLowerCase().includes(search.toLowerCase())
  )

  async function handleCallNow(r) {
    if (!r.phone) {
      alert(`No phone number for ${r.first} ${r.last}.\n\nEdit their profile and add a phone number first (format: +15559001234)`)
      return
    }
    if (!BLAND_API_KEY) {
      alert('No Bland API key. Add VITE_BLAND_API_KEY to your .env file.')
      return
    }
    if (!confirm(`Call ${r.first} ${r.last} now?\n\nRoom ${r.room} · ${r.phone}`)) return

    setCallingId(r.id)
    setCallResults(prev => ({ ...prev, [r.id]: { status: 'dialing' } }))

    try {
      const data = await blandCallNow(r)
      if (data.call_id) {
        setCallResults(prev => ({ ...prev, [r.id]: { status: 'live', callId: data.call_id } }))
        if (onCallResult) onCallResult({ residentId: r.id, callId: data.call_id, status: 'live' })
      } else {
        setCallResults(prev => ({ ...prev, [r.id]: { status: 'error', message: data.message } }))
        alert('Bland AI: ' + (data.message || JSON.stringify(data)))
      }
    } catch (e) {
      setCallResults(prev => ({ ...prev, [r.id]: { status: 'error', message: e.message } }))
      alert('Error: ' + e.message)
    } finally {
      setCallingId(null)
    }
  }

  function CallStatus({ id }) {
    const r = callResults[id]
    if (!r) return null
    if (r.status === 'dialing') return <span style={{ fontSize: 11, color: 'var(--warn)', fontWeight: 500 }}>Dialing...</span>
    if (r.status === 'live') return <span className="call-status-live"><span className="pulse" />Live · {r.callId?.slice(0, 8)}</span>
    if (r.status === 'error') return <span style={{ fontSize: 11, color: 'var(--danger)' }}>Call error</span>
    return null
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Residents</div>
          <div className="page-sub">{residents.length} enrolled residents</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Resident
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input type="text" className="form-input" placeholder="Search residents..." style={{ maxWidth: 280 }} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="resident-grid">
        {filtered.map(r => (
          <div className="resident-card" key={r.id}>
            <div className="resident-avatar" style={{ background: r.color, color: r.colorText }}>
              {r.first[0]}{r.last[0]}
            </div>
            <div className="resident-name">{r.first} {r.last}</div>
            <div className="resident-room">Room {r.room} · {r.freq}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>{r.notes}</div>
            {r.phone
              ? <div style={{ fontSize: 11, color: 'var(--accent2)', fontFamily: 'var(--mono)' }}>{r.phone}</div>
              : <div style={{ fontSize: 11, color: 'var(--warn)' }}>⚠ No phone number — edit to add</div>
            }
            <div className="resident-meta">
              <MoodBadge mood={r.mood} />
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{r.calls} calls</span>
            </div>
            <div style={{ marginTop: 6, minHeight: 18 }}><CallStatus id={r.id} /></div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
              <button className="btn btn-sm btn-primary" onClick={() => handleCallNow(r)} disabled={callingId === r.id}>
                {callingId === r.id ? 'Calling...' : 'Call Now'}
              </button>
              <button className="btn btn-sm">Edit</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text2)', marginBottom: 6 }}>No residents found</div>
            <div style={{ fontSize: 13 }}>Try a different search or add a new resident</div>
          </div>
        )}
      </div>

      {showAdd && <AddResidentModal count={residents.length} onClose={() => setShowAdd(false)} onAdd={onAdd} />}
    </div>
  )
}
