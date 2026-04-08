import { useState, useEffect, useRef, useCallback } from 'react'
import { pollRecentCalls } from '../lib/bland'

const POLL_INTERVAL = 30000 // 30 seconds

export default function useLivePolling({ onNewCall, onNewAlert, enabled = true }) {
  const [status, setStatus] = useState('idle') // idle | polling | error
  const [lastPolled, setLastPolled] = useState(null)
  const [newCallCount, setNewCallCount] = useState(0)
  const sinceRef = useRef(Date.now() - 60 * 60 * 1000) // start: last 1 hour
  const seenCallIds = useRef(new Set())
  const intervalRef = useRef(null)

  const poll = useCallback(async () => {
    if (!enabled) return
    setStatus('polling')
    try {
      const results = await pollRecentCalls(sinceRef.current)
      const newCalls = results.filter(c => !seenCallIds.current.has(c.callId))

      if (newCalls.length > 0) {
        newCalls.forEach(call => {
          seenCallIds.current.add(call.callId)

          // Fire new call callback
          if (onNewCall) onNewCall(call)

          // Fire alert callback if flags exist
          if (call.flags && call.flags.length > 0 && onNewAlert) {
            onNewAlert({
              id: `alert-${call.callId}`,
              resident: call.residentName,
              room: call.room,
              severity: call.flags.some(f => f.severity === 'high') ? 'high' : 'medium',
              time: call.time,
              desc: call.flags.map(f => f.message).join('. '),
              transcript: [],
              callId: call.callId,
            })
          }
        })

        setNewCallCount(prev => prev + newCalls.length)
        sinceRef.current = Date.now()
      }

      setLastPolled(new Date())
      setStatus('idle')
    } catch (e) {
      console.error('[useLivePolling] Error:', e)
      setStatus('error')
    }
  }, [enabled, onNewCall, onNewAlert])

  useEffect(() => {
    if (!enabled) return

    // Poll immediately on mount
    poll()

    // Then poll every 30s
    intervalRef.current = setInterval(poll, POLL_INTERVAL)

    return () => clearInterval(intervalRef.current)
  }, [poll, enabled])

  function resetNewCallCount() {
    setNewCallCount(0)
  }

  return { status, lastPolled, newCallCount, resetNewCallCount, pollNow: poll }
}
