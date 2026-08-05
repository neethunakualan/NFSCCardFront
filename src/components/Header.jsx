function Header({ user, onLogout }) {
  const roleLabel = user?.role || 'User'
  const initial = roleLabel.charAt(0).toUpperCase()

  return (
    <header className="app-header">
      <div className="header-spacer" />

      <div className="header-user-area">
        <div className="header-user">
          <div className="header-avatar">{initial}</div>
          <div className="header-user-info">
            <p className="header-user-name">{roleLabel}</p>
            {user?.userId && <p className="header-user-id">ID: {user.userId}</p>}
          </div>
        </div>

        <button type="button" className="header-logout" onClick={onLogout}>
          <span className="sidebar-icon" aria-hidden="true">↩</span>
          Sign out
        </button>
      </div>
    </header>
  )
}

export default Header
