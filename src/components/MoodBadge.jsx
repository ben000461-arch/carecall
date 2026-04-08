export default function MoodBadge({ mood }) {
  const map = {
    positive: ['mood-positive', 'Positive'],
    neutral:  ['mood-neutral',  'Neutral'],
    concern:  ['mood-concern',  'Concern'],
    alert:    ['mood-alert',    'Flagged'],
  }
  const [cls, label] = map[mood] || ['mood-neutral', 'Unknown']
  return <span className={`mood-badge ${cls}`}>{label}</span>
}
