// api/webhook.js
// Vercel serverless function — receives POST from Bland AI when a call completes
// Bland sends full call data: transcript, duration, recording, metadata

import { parseWebhookPayload } from '../src/lib/bland.js'

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = req.body
    console.log('[CareCall Webhook] Received call:', payload.call_id)

    // Parse and analyze the call
    const result = parseWebhookPayload(payload)
    console.log('[CareCall Webhook] Parsed result:', {
      callId: result.callId,
      resident: result.residentName,
      mood: result.mood,
      score: result.score,
      flags: result.flags.length,
    })

    // ─── Store the result ───────────────────────────────────────────────────
    // Right now we log it — in the next step we'll connect a database (Supabase)
    // For now this confirms Bland can reach us and we can parse the data.
    //
    // When you add a DB, replace this section with:
    // await supabase.from('calls').insert(result)
    // await supabase.from('alerts').insert(flags)

    if (result.flags.length > 0) {
      console.log('[CareCall Webhook] FLAGS RAISED for', result.residentName)
      result.flags.forEach(f => {
        console.log(`  [${f.severity.toUpperCase()}] ${f.message}`)
      })
    }

    return res.status(200).json({
      received: true,
      callId: result.callId,
      mood: result.mood,
      score: result.score,
      flagCount: result.flags.length,
    })

  } catch (err) {
    console.error('[CareCall Webhook] Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
