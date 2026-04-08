import { useState } from 'react'

const COLORS = [
  { color: '#e8f4ee', colorText: '#1b4332' },
  { color: '#dbeafe', colorText: '#1e40af' },
  { color: '#fef3c7', colorText: '#92400e' },
  { color: '#fee2e2', colorText: '#991b1b' },
  { color: '#f0ede8', colorText: '#5f5e5a' },
]

export default function AddResidentModal({ count, onClose, onAdd }) {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [room, setRoom] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [freq, setFreq] = useState('Daily')

  function handleAdd() {
    if (!first || !last || !room) { alert('Name and room are required.'); return }
    const c = COLORS[count % COLORS.length]
    onAdd({
      id: Date.now().toString(),
      first, last, room, phone,
      notes: notes || 'New resident',
      freq, mood: 'neutral', calls: 0, lastCall: 'Never',
      ...c
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Add Resident</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input type="text" className="form-input" placeholder="Margaret" value={first} onChange={e => setFirst(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input type="text" className="form-input" placeholder="Williams" value={last} onChange={e => setLast(e.target.value)} />
            </div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Room *</label>
              <input type="text" className="form-input" placeholder="14" value={room} onChange={e => setRoom(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="+15559001234" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes / Conditions</label>
            <textarea className="form-input" placeholder="Early stage dementia, enjoys talking about family..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Call Frequency</label>
            <select className="form-input" value={freq} onChange={e => setFreq(e.target.value)}>
              {['Daily', 'Twice daily', 'Every other day', 'Weekly', 'Manual only'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>Add Resident</button>
        </div>
      </div>
    </div>
  )
}
