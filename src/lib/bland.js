export const BLAND_API_KEY = import.meta.env.VITE_BLAND_API_KEY || ''
export const BLAND_BASE = 'https://api.bland.ai/v1'
export const WEBHOOK_URL = 'https://carecall-beige.vercel.app/api/webhook'

// ─── Build personalized elder care prompt ────────────────────────────────────
export function buildPrompt(resident) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const h = new Date().getHours()
  const timeOfDay = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'

  const personalContext = []
  if (resident.notes) personalContext.push(`Care notes: ${resident.notes}`)
  if (resident.interests) personalContext.push(`Known interests: ${resident.interests}`)
  if (resident.family) personalContext.push(`Family: ${resident.family}`)
  if (resident.lastCallSummary) personalContext.push(`Last call summary: ${resident.lastCallSummary}`)

  return `You are CareCall, a warm and caring AI companion. You are calling ${resident.first} ${resident.last}, a resident in Room ${resident.room} at Sunrise Memory Care.

TODAY IS: ${today}. It is currently the ${timeOfDay}.

RESIDENT PROFILE:
- Full name: ${resident.first} ${resident.last}
- Room: ${resident.room}
- Call frequency: ${resident.freq || 'Daily'}
${personalContext.map(c => `- ${c}`).join('\n')}

YOUR PERSONALITY:
- You already know ${resident.first} well — speak like a familiar trusted friend
- Warm, gentle, and unhurried at all times
- Use simple short sentences — never more than 15 words per sentence
- Always use their first name: ${resident.first}
- Be patient. If they repeat themselves, respond kindly each time as if hearing it fresh
- Never sound clinical, robotic, or like you are reading from a script
- Match their energy — if they are chatty, be chatty. If they are quiet, be gentle and soft

OPENING THE CALL:
- Start with: "Good ${timeOfDay}, ${resident.first}! It's CareCall, your companion from Sunrise. How are you doing today?"
- Reference something personal if available — their interests or family
- Make them feel remembered and cared for from the very first sentence

YOUR GOALS FOR THIS CALL (in order):
1. Greet ${resident.first} warmly — make them feel genuinely recognized and remembered
2. Ask how they are feeling today — physically and emotionally
3. Reference something personal from their profile to show you remember them
4. Ask about their day — what they had for breakfast, if they slept well, any plans
5. Gently ask if they have taken their medications today
6. Ask if they need anything or want to speak with someone at the facility
7. Close warmly — say the whole team at Sunrise cares about them

IMPORTANT CONVERSATION RULES:
- Never ask more than one question at a time
- Give ${resident.first} plenty of time to respond — pause naturally
- If they seem confused, gently redirect with warmth — never correct harshly
- If they bring up a topic, follow it — do not force the agenda
- If they mention family members by name, use those names warmly in responses

CRITICAL MONITORING — flag in post-call summary if ${resident.first}:
- Expresses confusion about where they are or what day or year it is
- Asks to go home repeatedly or says they want to leave
- Mentions pain, falling, or physical discomfort
- Expresses sadness, loneliness, fear, or distress
- Cannot recall recent events or familiar people
- Asks for someone who may have passed away
- Ends the call abruptly or refuses to speak
- Mentions not eating or not sleeping

POST-CALL SUMMARY — provide after call ends:
- Resident mood: positive / neutral / concern / alert
- Energy level: high / normal / low
- Key topics discussed
- Any flags raised with exact quotes
- Recommended follow-up action`.trim()
}

// ─── Immediate outbound call ──────────────────────────────────────────────────
export async function blandCallNow(resident) {
  const h = new Date().getHours()
  const timeOfDay = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  const resp = await fetch(`${BLAND_BASE}/calls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: BLAND_API_KEY },
    body: JSON.stringify({
      phone_number: resident.phone,
      task: buildPrompt(resident),
      voice: 'June',
      first_sentence: `Good ${timeOfDay}, ${resident.first}! It's CareCall, your companion from Sunrise Memory Care. How are you doing today?`,
      wait_for_greeting: true,
      record: true,
      max_duration: 20,
      temperature: 0.6,
      webhook: WEBHOOK_URL,
      metadata: {
        resident_id: resident.id,
        resident_name: `${resident.first} ${resident.last}`,
        room: resident.room,
        call_type: 'immediate',
      },
    }),
  })
  return resp.json()
}

// ─── Scheduled outbound call ─────────────────────────────────────────────────
export async function blandSchedule(resident, scheduledTime, callType = 'Daily check-in', customPrompt = '') {
  const h = new Date().getHours()
  const timeOfDay = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  const resp = await fetch(`${BLAND_BASE}/calls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: BLAND_API_KEY },
    body: JSON.stringify({
      phone_number: resident.phone,
      task: customPrompt || buildPrompt(resident),
      voice: 'June',
      first_sentence: `Good ${timeOfDay}, ${resident.first}! It's CareCall, your companion from Sunrise Memory Care. How are you doing today?`,
      wait_for_greeting: true,
      record: true,
      max_duration: 20,
      temperature: 0.6,
      scheduled_time: scheduledTime,
      webhook: WEBHOOK_URL,
      metadata: {
        resident_id: resident.id,
        resident_name: `${resident.first} ${resident.last}`,
        room: resident.room,
        call_type: callType,
      },
    }),
  })
  return resp.json()
}

// ─── Fetch single call ────────────────────────────────────────────────────────
export async function blandGetCall(callId) {
  const resp = await fetch(`${BLAND_BASE}/calls/${callId}`, {
    headers: { authorization: BLAND_API_KEY },
  })
  return resp.json()
}

// ─── Fetch all calls from Bland ───────────────────────────────────────────────
export async function blandGetAllCalls() {
  const resp = await fetch(`${BLAND_BASE}/calls?limit=50`, {
    headers: { authorization: BLAND_API_KEY },
  })
  return resp.json()
}

// ─── Mood detection from transcript ──────────────────────────────────────────
const HIGH_ALERT_KEYWORDS = [
  'go home', 'want to go home', 'i want to leave',
  "don't know where", "don't know this place", 'where am i',
  'scared', 'frightened', 'terrified',
  'fell', 'falling', 'i fell', 'fall down',
  'chest pain', "can't breathe", 'hurts so much',
  'want to die', "don't want to live", 'end it',
]

const MEDIUM_ALERT_KEYWORDS = [
  'confused', 'i forgot', "can't remember", 'medication', 'pills',
  "didn't eat", 'not eating', 'not hungry',
  "didn't sleep", "can't sleep", 'no sleep',
  'alone', 'lonely', 'nobody visits', 'nobody cares',
  'sad', 'depressed', 'crying', 'upset',
  'pain', 'hurts', 'ache', 'sore',
]

const POSITIVE_KEYWORDS = [
  'wonderful', 'great', 'happy', 'excited', 'lovely', 'beautiful',
  'family', 'grandchildren', 'visit', 'looking forward',
  'slept well', 'feeling good', 'feeling well',
  'thank you', 'appreciate', 'nice', 'enjoyed',
]

export function detectMood(transcript, durationSeconds) {
  if (!transcript) return { mood: 'neutral', flags: [], score: 5 }

  const text = transcript.toLowerCase()
  const flags = []
  let score = 5

  if (durationSeconds && durationSeconds < 120) {
    flags.push({ severity: 'medium', message: `Call ended very early (${Math.round(durationSeconds / 60)} min). Resident may have been unwilling or unable to talk.` })
    score -= 2
  }

  HIGH_ALERT_KEYWORDS.forEach(kw => {
    if (text.includes(kw)) {
      flags.push({ severity: 'high', message: `Detected: "${kw}"` })
      score -= 3
    }
  })

  MEDIUM_ALERT_KEYWORDS.forEach(kw => {
    if (text.includes(kw)) {
      flags.push({ severity: 'medium', message: `Noted: "${kw}"` })
      score -= 1
    }
  })

  POSITIVE_KEYWORDS.forEach(kw => {
    if (text.includes(kw)) score += 0.5
  })

  score = Math.max(1, Math.min(10, Math.round(score)))

  const hasHighFlag = flags.some(f => f.severity === 'high')
  const hasMedFlag = flags.some(f => f.severity === 'medium')

  let mood = 'positive'
  if (hasHighFlag || score <= 3) mood = 'alert'
  else if (hasMedFlag || score <= 5) mood = 'concern'
  else if (score <= 7) mood = 'neutral'

  const uniqueFlags = flags.filter((f, i, arr) => arr.findIndex(x => x.message === f.message) === i)

  return { mood, flags: uniqueFlags, score }
}

// ─── Parse Bland webhook payload ─────────────────────────────────────────────
export function parseWebhookPayload(payload) {
  const transcript = payload.concatenated_transcript || payload.transcript || ''
  const duration = payload.call_length || 0
  const { mood, flags, score } = detectMood(transcript, duration * 60)
  const metadata = payload.metadata || {}

  return {
    callId: payload.call_id,
    residentId: metadata.resident_id,
    residentName: metadata.resident_name,
    room: metadata.room,
    callType: metadata.call_type,
    transcript,
    duration: Math.round(duration),
    mood,
    flags,
    score,
    recordingUrl: payload.recording_url || '',
    status: payload.status || 'completed',
    completedAt: new Date().toISOString(),
  }
}

// ─── Poll Bland for recent completed calls ────────────────────────────────────
// Returns parsed call results from the last N minutes
export async function pollRecentCalls(sinceTimestamp) {
  try {
    const data = await blandGetAllCalls()
    const calls = data.calls || data || []

    return calls
      .filter(c => {
        if (c.status !== 'completed') return false
        if (!sinceTimestamp) return true
        const ended = new Date(c.end_at || c.created_at).getTime()
        return ended > sinceTimestamp
      })
      .map(c => {
        const transcript = c.concatenated_transcript || c.transcript || ''
        const duration = c.call_length || 0
        const { mood, flags, score } = detectMood(transcript, duration * 60)
        const metadata = c.metadata || {}
        return {
          callId: c.call_id,
          residentId: metadata.resident_id,
          residentName: metadata.resident_name || 'Unknown',
          room: metadata.room || '—',
          callType: metadata.call_type || 'Check-in',
          direction: 'Outbound',
          transcript,
          duration: Math.round(duration),
          mood,
          flags,
          score,
          recordingUrl: c.recording_url || '',
          status: c.status,
          completedAt: c.end_at || c.created_at,
          time: new Date(c.end_at || c.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          snippet: transcript ? transcript.slice(0, 120) + '...' : 'No transcript available',
        }
      })
  } catch (e) {
    console.error('[pollRecentCalls] Error:', e)
    return []
  }
}
