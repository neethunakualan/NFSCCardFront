import { NavLink } from 'react-router-dom'

function Sidebar() {
  const linkClass = ({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">NFC</span>
        <span className="sidebar-brand-text">Card Manager</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={linkClass}>
          <span className="sidebar-icon" aria-hidden="true">🏠</span>
          Home
        </NavLink>

        <NavLink to="/digital-card" className={linkClass}>
          <span className="sidebar-icon" aria-hidden="true">💳</span>
          Digital card
        </NavLink>

        <NavLink to="/customers" className={linkClass}>
          <span className="sidebar-icon" aria-hidden="true">👥</span>
          Customers
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
