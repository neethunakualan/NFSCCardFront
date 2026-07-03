function CustomerDetailPage({ customer, isLoading, error, onEdit, onBack }) {
  if (isLoading) {
    return (
      <main className="page-shell">
        <p>Loading customer...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page-shell">
        <p className="message error">{error}</p>
        <button className="secondary-button" onClick={onBack}>Back to list</button>
      </main>
    )
  }

  if (!customer) {
    return (
      <main className="page-shell">
        <p>Customer not found.</p>
        <button className="secondary-button" onClick={onBack}>Back to list</button>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>{customer.firstName} {customer.lastName}</h1>
          <p>{customer.email}</p>
        </div>
        <div className="button-row">
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onEdit}>Edit</button>
        </div>
      </header>

      <section className="detail-card">
        <h2>Customer details</h2>
        <p><strong>Company:</strong> {customer.companyName || '—'}</p>
        <p><strong>Job title:</strong> {customer.jobTitle || '—'}</p>
        <p><strong>Phone:</strong> {customer.phoneNumber || '—'}</p>
        <p><strong>WhatsApp:</strong> {customer.whatsAppNumber || '—'}</p>
        <p><strong>Website:</strong> {customer.website || '—'}</p>
        <p><strong>Bio:</strong> {customer.bio || '—'}</p>
      </section>
    </main>
  )
}

export default CustomerDetailPage
