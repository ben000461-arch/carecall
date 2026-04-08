import { useState } from 'react'
import { blandSchedule, BLAND_API_KEY } from '../lib/bland'

export default function ScheduleModal({ residents, onClose, onScheduled }) {
  const [residentIdx, setResidentIdx] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('15:00')
  const [callType, setCallType] = useState('Daily check-in')
  const [recur, setRecur] = useState('One time')
  const [customPrompt, setCustomPrompt] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const selected = residents[residentIdx]

  async function handleSchedule() {
    if (!selected?.phone) {
      setStatus(`${selected?.first} has no phone number. Edit their profile first.`)
      return
    }
    if (!BLAND_API_KEY) {
      setStatus('No API key. Add VITE_BLAND_API_KEY to your .env file.')
      return
    }
    if (!date || !time) { setStatus('Pick a date and time.'); return }

    setLoading(true)
    setStatus('Scheduling with Bland AI...')

    const scheduledTime = new Date(`${date}T${time}`).toISOString()

    try {
      const data = await blandSchedule(selected, scheduledTime, callType, customPrompt)
      if (data.call_id) {
        setStatus(`Scheduled! Call ID: ${data.call_id}`)
        if (onScheduled) onScheduled({ resident: selected, callId: data.call_id, callType, scheduledTime })
        setTimeout(onClose, 2000)
      } else {
        setStatus('Bland AI: ' + (data.message || JSON.stringify(data)))
      }
    } catch (e) {
      setStatus('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const isError = status && !status.includes('Scheduled') && !status.includes('Scheduling')
  const isSuccess = status.includes('Scheduled!')

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Schedule a Call</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {!BLAND_API_KEY && (
            <div style={{ background: 'var(--warn-light)', color: 'var(--warn)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 12 }}>
              No Bland API key detected. Add VITE_BLAND_API_KEY to your .env file.
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Resident</label>
            <select className="form-input" value={residentIdx} onChange={e => setResidentIdx(Number(e.target.value))}>
              {residents.map((r, i) => (
                <option key={r.id} value={i}>
                  {r.first} {r.last} — Room {r.room}{!r.phone ? ' ⚠ no phone' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input type="time" className="form-input" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Call Type</label>
            <select className="form-input" value={callType} onChange={e => setCallType(e.target.value)}>
              {['Daily check-in', 'Cognitive assessment', 'Medication reminder', 'Evening chat', 'Morning check-in', 'Custom'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Recurrence</label>
            <select className="form-input" value={recur} onChange={e => setRecur(e.target.value)}>
              {['One time', 'Daily', 'Weekdays', 'Weekly'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Custom Prompt (optional — overrides default)</label>
            <textarea className="form-input" value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Leave blank to use the AI elder care companion prompt..." />
          </div>

          {status && (
            <div style={{ fontSize: 12, color: isSuccess ? 'var(--accent)' : isError ? 'var(--danger)' : 'var(--text3)', marginTop: 4, padding: '8px 10px', background: isSuccess ? 'var(--accent-light)' : isError ? 'var(--danger-light)' : 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
              {status}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSchedule} disabled={loading}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {loading ? 'Scheduling...' : 'Schedule via Bland AI'}
          </button>
        </div>
      </div>
    </div>
  )
}
