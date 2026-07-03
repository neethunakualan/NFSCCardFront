import { useNavigate } from 'react-router-dom'

function HomePage({ user, onLogout, isAdmin }) {
  const navigate = useNavigate()

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="welcome-text">Welcome, {user?.role || 'User'}</p>
          <h1>Home</h1>
          <p>Choose a menu option to continue.</p>
        </div>
        <button className="secondary-button" onClick={onLogout}>Sign out</button>
      </header>

      <section className="menu-grid">
        <button className="card button-card" onClick={() => navigate('/customers')}>
          <h2>List view</h2>
          <p>View customers, open details, and edit from the list.</p>
        </button>

        {isAdmin ? (
          <button className="card button-card" onClick={() => navigate('/customers/create')}>
            <h2>Create customer</h2>
            <p>Add a new customer record.</p>
          </button>
        ) : (
          <div className="card button-card disabled-card">
            <h2>Create customer</h2>
            <p>Only admin users can create customers.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default HomePage
