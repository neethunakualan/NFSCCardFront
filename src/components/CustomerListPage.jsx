function CustomerListPage({ customers, isLoading, error, onViewDetail, onEdit, onCreate, onBack }) {
  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>Customer list</h1>
          <p>Open a detail view or edit a customer directly from the list.</p>
        </div>
        <div className="button-row">
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onCreate}>Create new</button>
        </div>
      </header>

      <section className="item-grid">
        {isLoading ? (
          <p>Loading customers...</p>
        ) : error ? (
          <p className="message error">{error}</p>
        ) : customers.length === 0 ? (
          <p>No customers available yet. Create one to get started.</p>
        ) : (
          customers.map((customer) => (
            <article key={customer.customerId} className="item-card">
              <h2>{customer.firstName} {customer.lastName}</h2>
              <p>{customer.email}</p>
              <p>{customer.companyName || customer.jobTitle}</p>
              <div className="item-actions">
                <button className="text-button" onClick={() => onViewDetail(customer)}>View</button>
                <button className="text-button" onClick={() => onEdit(customer)}>Edit</button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  )
}

export default CustomerListPage
