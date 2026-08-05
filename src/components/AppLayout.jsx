import Sidebar from './Sidebar'
import Header from './Header'

function AppLayout({ user, onLogout, children }) {
  return (
    <div className="app-with-sidebar">
      <Sidebar />
      <div className="app-content">
        <Header user={user} onLogout={onLogout} />
        <div className="app-page">{children}</div>
      </div>
    </div>
  )
}

export default AppLayout
