// Bland AI API config
export const BLAND_API_KEY = import.meta.env.VITE_BLAND_API_KEY || ''
export const BLAND_BASE = 'https://api.bland.ai/v1'

export const DEFAULT_PROMPT = `You are a warm, caring AI companion calling a resident at a senior care facility called Sunrise Memory Care. Your goal is to have a supportive, friendly conversation. Ask about their day, how they are feeling, any upcoming events they are looking forward to. Listen attentively. If you detect any signs of confusion, distress, disorientation, or unusual behavior, note it clearly in your summary.`

export async function blandCall(phoneNumber, task, firstName) {
  const resp = await fetch(`${BLAND_BASE}/calls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': BLAND_API_KEY
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      task: task || DEFAULT_PROMPT,
      voice: 'June',
      first_sentence: `Hello ${firstName || 'there'}, this is your CareCall companion from Sunrise Memory Care. How are you doing today?`,
      wait_for_greeting: true,
      record: true,
      max_duration: 15,
    })
  })
  return resp.json()
}

export async function blandScheduleCall(phoneNumber, task, firstName, scheduledTime) {
  const resp = await fetch(`${BLAND_BASE}/calls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': BLAND_API_KEY
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      task: task || DEFAULT_PROMPT,
      voice: 'June',
      first_sentence: `Hello ${firstName || 'there'}, this is your CareCall companion from Sunrise Memory Care. How are you doing today?`,
      wait_for_greeting: true,
      record: true,
      max_duration: 15,
      scheduled_time: scheduledTime
    })
  })
  return resp.json()
}

export async function blandGetCalls() {
  const resp = await fetch(`${BLAND_BASE}/calls`, {
    headers: { 'authorization': BLAND_API_KEY }
  })
  return resp.json()
}

// Seed data
export const SEED_RESIDENTS = [
  { id: '1', first: 'Margaret', last: 'Williams', room: '14', phone: '', mood: 'positive', calls: 28, lastCall: 'Today 1:45 PM', notes: 'Enjoys gardening and family stories. Early stage dementia.', freq: 'Daily', color: '#e8f4ee', colorText: '#1b4332' },
  { id: '2', first: 'Robert', last: 'Chen', room: '7', phone: '', mood: 'concern', calls: 21, lastCall: 'Today 2:14 PM', notes: 'Medication concerns. Needs twice-daily check-ins.', freq: 'Twice daily', color: '#dbeafe', colorText: '#1e40af' },
  { id: '3', first: 'Dorothy', last: 'Patel', room: '22', phone: '', mood: 'positive', calls: 34, lastCall: 'Today 1:00 PM', notes: 'Very social, loves talking about her grandchildren.', freq: 'Daily', color: '#fef3c7', colorText: '#92400e' },
  { id: '4', first: 'James', last: 'Morrison', room: '3', phone: '', mood: 'alert', calls: 19, lastCall: 'Today 12:30 PM', notes: 'Moderate dementia. Close monitoring required.', freq: 'Twice daily', color: '#fee2e2', colorText: '#991b1b' },
  { id: '5', first: 'Helen', last: 'Brooks', room: '18', phone: '', mood: 'positive', calls: 41, lastCall: 'Yesterday', notes: 'Very positive, excellent memory.', freq: 'Daily', color: '#e8f4ee', colorText: '#1b4332' },
  { id: '6', first: 'Frances', last: 'Wu', room: '19', phone: '', mood: 'concern', calls: 22, lastCall: 'Today 11:20 AM', notes: 'Shorter call than usual today — flagged for follow-up.', freq: 'Daily', color: '#f0ede8', colorText: '#5f5e5a' },
]

export const SEED_CALL_LOGS = [
  { id: 'c1', resident: 'Margaret Williams', room: '14', direction: 'Outbound', duration: '12 min', mood: 'positive', time: '1:45 PM', snippet: 'I had a wonderful morning, the garden looked beautiful...' },
  { id: 'c2', resident: 'Robert Chen', room: '7', direction: 'Inbound', duration: '8 min', mood: 'concern', time: '2:14 PM', snippet: "I can't remember if I took my medication this morning..." },
  { id: 'c3', resident: 'Dorothy Patel', room: '22', direction: 'Outbound', duration: '14 min', mood: 'positive', time: '1:00 PM', snippet: 'My daughter is visiting this weekend, I am so excited...' },
  { id: 'c4', resident: 'James Morrison', room: '3', direction: 'Outbound', duration: '6 min', mood: 'alert', time: '12:30 PM', snippet: "I don't know where I am... I want to go home..." },
  { id: 'c5', resident: 'Frances Wu', room: '19', direction: 'Outbound', duration: '2 min', mood: 'concern', time: '11:20 AM', snippet: 'Asked to end call early. Seemed withdrawn.' },
]

export const SEED_SCHEDULE = [
  { id: 's1', time: '8:00 AM', name: 'Helen Brooks', room: '18', type: 'Morning check-in', done: true, recur: 'Daily' },
  { id: 's2', time: '10:00 AM', name: 'Frances Wu', room: '19', type: 'Daily check-in', done: true, recur: 'Daily' },
  { id: 's3', time: '11:20 AM', name: 'Frances Wu', room: '19', type: 'Follow-up', done: true, recur: 'One time' },
  { id: 's4', time: '12:30 PM', name: 'James Morrison', room: '3', type: 'Cognitive check', done: true, recur: 'Twice daily' },
  { id: 's5', time: '1:00 PM', name: 'Dorothy Patel', room: '22', type: 'Afternoon chat', done: true, recur: 'Daily' },
  { id: 's6', time: '2:14 PM', name: 'Robert Chen', room: '7', type: 'Medication reminder', done: true, recur: 'Twice daily' },
  { id: 's7', time: '3:00 PM', name: 'Helen Brooks', room: '18', type: 'Daily check-in', done: false, recur: 'Daily' },
  { id: 's8', time: '3:30 PM', name: 'James Morrison', room: '3', type: 'Evening check', done: false, recur: 'Twice daily' },
  { id: 's9', time: '4:00 PM', name: 'Margaret Williams', room: '14', type: 'Afternoon chat', done: false, recur: 'Daily' },
  { id: 's10', time: '5:00 PM', name: 'Robert Chen', room: '7', type: 'Evening reminder', done: false, recur: 'Daily' },
]

export const SEED_ALERTS = [
  {
    id: 'a1', resident: 'James Morrison', room: '3', severity: 'high', time: '12:36 PM',
    desc: 'Resident expressed confusion about current location and asked repeatedly to go home. Possible acute disorientation episode.',
    transcript: [
      { speaker: 'AI', text: 'Good afternoon James, how are you feeling today?' },
      { speaker: 'James', text: "Where am I? I don't know this place. I want to go home." },
      { speaker: 'AI', text: "You're safe at Sunrise, James. Can you tell me more about how you're feeling?" },
      { speaker: 'James', text: "I don't know... I'm scared. Where's my wife?" },
    ]
  },
  {
    id: 'a2', resident: 'Robert Chen', room: '7', severity: 'medium', time: '2:14 PM',
    desc: 'Resident expressed uncertainty about whether morning medications were taken. May need staff verification.',
    transcript: []
  },
  {
    id: 'a3', resident: 'Frances Wu', room: '19', severity: 'medium', time: '11:20 AM',
    desc: 'Call was notably shorter than usual (2 min vs 14 min avg). Resident asked to end the call and seemed withdrawn.',
    transcript: []
  },
]
