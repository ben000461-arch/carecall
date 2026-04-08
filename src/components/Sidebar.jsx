import { NavLink, useLocation } from 'react-router-dom'

const NavItem = ({ to, icon, label, badge }) => {
  const location = useLocation()
  const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
  return (
    <NavLink to={to} className={`nav-item${active ? ' active' : ''}`} style={{ textDecoration: 'none' }}>
      {icon}
      {label}
      {badge > 0 && <span className="nav-badge">{badge}</span>}
    </NavLink>
  )
}

export default function Sidebar({ alertCount = 0 }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">CareCall</div>
            <div className="logo-sub">AI Companion Platform</div>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-label">Monitor</div>
        <NavItem to="/" label="Dashboard" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        }/>
        <NavItem to="/alerts" label="Alerts" badge={alertCount} icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        }/>

        <div className="nav-label">Residents</div>
        <NavItem to="/residents" label="Residents" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        }/>
        <NavItem to="/calls" label="Call Logs" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
        }/>

        <div className="nav-label">Operations</div>
        <NavItem to="/schedule" label="Scheduling" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        }/>
        <NavItem to="/settings" label="Settings" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 115 19.07M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        }/>
      </div>

      <div className="sidebar-bottom">
        <div className="facility-card">
          <div className="facility-name">Sunrise Memory Care</div>
          <div className="facility-sub">Powered by CareCall AI</div>
        </div>
      </div>
    </div>
  )
}
