# CareCall — AI Elder Care Companion Platform

Built with React + Vite. Powered by Bland AI for outbound/inbound calls.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Add your Bland AI key to `.env`:
   ```
   VITE_BLAND_API_KEY=your_key_here
   ```

3. Run locally:
   ```
   npm run dev
   ```
   Opens at http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import repo on vercel.com
3. Add `VITE_BLAND_API_KEY` in Vercel Environment Variables
4. Deploy — you get a live URL instantly

## Project Structure

```
src/
  App.jsx              # Root with routing + state
  main.jsx             # Entry point
  styles.css           # Global styles
  lib/
    data.js            # Bland API calls + seed data
  components/
    Sidebar.jsx
    MoodBadge.jsx
    ScheduleModal.jsx  # Triggers Bland AI calls
    AddResidentModal.jsx
  pages/
    Dashboard.jsx
    Residents.jsx
    CallLogs.jsx
    Schedule.jsx
    Alerts.jsx
    Settings.jsx
```

## Bland AI

- Outbound calls fire via `POST /v1/calls`
- "Call Now" on resident cards triggers immediate call
- Schedule modal sends `scheduled_time` param to Bland
- Voice: June (configurable in Settings)
