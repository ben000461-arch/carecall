import { useState } from 'react'
import { BLAND_API_KEY, BLAND_BASE } from '../lib/bland'

const DEFAULT_PROMPT = `You are CareCall, a warm and caring AI companion calling a resident at Sunrise Memory Care. Speak slowly, clearly, and warmly. Use simple short sentences. Ask about their day, how they are feeling, and if they have taken their medications. Flag any signs of confusion, distress, or disorientation.`

export default function Settings() {
  const [connStatus, setConnStatus] = useState('')

  async function testConnection() {
    setConnStatus('Testing...')
    try {
      const resp = await fetch(`${BLAND_BASE}/calls`, {
        headers: { authorization: BLAND_API_KEY }
      })
      if (resp.ok) {
        setConnStatus('Connected successfully')
      } else {
        const d = await resp.json()
        setConnStatus('Error: ' + (d.message || resp.status))
      }
    } catch (e) {
      setConnStatus('Network error: ' + e.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-sub">Platform and API configuration</div>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card">
            <div className="card-header"><div className="card-title">Bland AI Integration</div></div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">API Key</label>
                <input
                  type="password"
                  className="form-input"
                  defaultValue={BLAND_API_KEY}
                  placeholder="Set VITE_BLAND_API_KEY in .env"
                />
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                  Set via VITE_BLAND_API_KEY in your .env file
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">AI Voice</label>
                <select className="form-input">
                  <option>June (recommended)</option>
                  <option>Calm female</option>
                  <option>Warm male</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Default Call Prompt</label>
                <textarea className="form-input" defaultValue={DEFAULT_PROMPT} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn btn-primary" onClick={testConnection}>Test Connection</button>
                {connStatus && (
                  <span style={{
                    fontSize: 12,
                    color: connStatus.includes('success') ? 'var(--accent)' : 'var(--danger)'
                  }}>{connStatus}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><div className="card-title">Facility Info</div></div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Facility Name</label>
                <input type="text" className="form-input" defaultValue="Sunrise Memory Care" />
              </div>
              <div className="form-group">
                <label className="form-label">Admin Contact Email</label>
                <input type="email" className="form-input" defaultValue="admin@sunrisememorycare.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Alert Notifications</label>
                <select className="form-input">
                  <option>Email + SMS</option>
                  <option>Email only</option>
                  <option>SMS only</option>
                </select>
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Alert Thresholds</div></div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Flag keywords (comma separated)</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: 60 }}
                  defaultValue="go home, don't know where, scared, confused, medication, hurt, pain, fall"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Short call threshold (minutes)</label>
                <input type="number" className="form-input" defaultValue="3" />
              </div>
              <button className="btn btn-primary">Save Thresholds</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
