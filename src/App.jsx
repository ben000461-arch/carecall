import { Routes, Route } from 'react-router-dom'
import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Residents from './pages/Residents'
import CallLogs from './pages/CallLogs'
import Schedule from './pages/Schedule'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import useLivePolling from './lib/useLivePolling'
import { SEED_RESIDENTS, SEED_CALL_LOGS, SEED_SCHEDULE, SEED_ALERTS } from './lib/data'

export default function App() {
  const [residents, setResidents] = useState(SEED_RESIDENTS)
  const [callLogs, setCallLogs] = useState(SEED_CALL_LOGS)
  const [schedule] = useState(SEED_SCHEDULE)
  const [alerts, setAlerts] = useState(SEED_ALERTS)

  function addResident(r) {
    setResidents(prev => [...prev, r])
  }

  // Called when polling finds a new completed call
  const handleNewCall = useCallback((call) => {
    // Add to call logs
    setCallLogs(prev => {
      if (prev.find(c => c.id === call.callId)) return prev
      return [{
        id: call.callId,
        resident: call.residentName,
        room: call.room,
        direction: call.direction || 'Outbound',
        duration: `${call.duration} min`,
        mood: call.mood,
        time: call.time,
        snippet: call.snippet,
      }, ...prev]
    })

    // Update resident mood
    if (call.residentId) {
      setResidents(prev => prev.map(r =>
        r.id === call.residentId
          ? { ...r, mood: call.mood, lastCall: `Today ${call.time}`, calls: r.calls + 1, lastCallSummary: call.snippet }
          : r
      ))
    }
  }, [])

  // Called when polling finds a flagged call
  const handleNewAlert = useCallback((alert) => {
    setAlerts(prev => {
      if (prev.find(a => a.id === alert.id)) return prev
      return [alert, ...prev]
    })
  }, [])

  // Live polling — checks Bland every 30s
  const { status: pollStatus, lastPolled, newCallCount, resetNewCallCount, pollNow } = useLivePolling({
    onNewCall: handleNewCall,
    onNewAlert: handleNewAlert,
    enabled: true,
  })

  return (
    <div className="app">
      <Sidebar alertCount={alerts.length} />
      <div className="main">
        <Routes>
          <Route path="/" element={
            <Dashboard
              residents={residents}
              callLogs={callLogs}
              schedule={schedule}
              alerts={alerts}
              pollStatus={pollStatus}
              lastPolled={lastPolled}
              newCallCount={newCallCount}
              onResetCount={resetNewCallCount}
              onPollNow={pollNow}
            />
          }/>
          <Route path="/residents" element={
            <Residents residents={residents} onAdd={addResident} />
          }/>
          <Route path="/calls" element={<CallLogs callLogs={callLogs} />}/>
          <Route path="/schedule" element={<Schedule schedule={schedule} residents={residents} />}/>
          <Route path="/alerts" element={<Alerts alerts={alerts} />}/>
          <Route path="/settings" element={<Settings />}/>
        </Routes>
      </div>
    </div>
  )
}
