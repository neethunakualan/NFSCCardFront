function CustomerListPage({ customers, isLoading, error, onViewDetail, onEdit, onCreate }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL || ''
  const totalCustomers = customers.length

  const getInitials = (firstName, lastName) => {
    const first = (firstName || '').trim().charAt(0)
    const last = (lastName || '').trim().charAt(0)
    return `${first}${last}`.toUpperCase() || 'CU'
  }

  const resolveProfileImageSrc = (value) => {
    if (!value) return ''

    const raw = String(value).trim()
    if (!raw) return ''

    if (/^(https?:\/\/|data:|blob:)/i.test(raw)) {
      return raw
    }

    if (!apiBaseUrl) {
      return raw
    }

    const normalizedBase = apiBaseUrl.replace(/\/+$/, '')
    const normalizedPath = raw.startsWith('/') ? raw : `/${raw}`
    return `${normalizedBase}${normalizedPath}`
  }

  const getRoleOrCompany = (customer) => {
    if (customer.companyName) return customer.companyName
    if (customer.jobTitle) return customer.jobTitle
    return 'No company details'
  }

  return (
    <main className="page-shell">
      <header className="page-header customer-list-header">
        <div>
          <h1>Customer list</h1>
          <p>Open profile details or quickly update customer information.</p>
          <div className="customer-count-badge">{totalCustomers} customers</div>
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={onCreate}>Create new</button>
        </div>
      </header>

      <section className="customer-list-grid">
        {isLoading ? (
          <p className="customer-list-message">Loading customers...</p>
        ) : error ? (
          <p className="customer-list-message message error">{error}</p>
        ) : customers.length === 0 ? (
          <p className="customer-list-message">No customers available yet. Create one to get started.</p>
        ) : (
          <div className="customer-table-wrap">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company / Role</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const profileImageSrc = resolveProfileImageSrc(
                    customer.profileImageUrl || customer.profileImage || customer.imageUrl || customer.image
                  )

                  return (
                    <tr key={customer.customerId}>
                      <td>
                        <div className="customer-name-cell-wrap">
                          {profileImageSrc ? (
                            <img
                              src={profileImageSrc}
                              alt={`${customer.firstName || ''} ${customer.lastName || ''} profile`}
                              className="customer-row-avatar"
                            />
                          ) : (
                            <div className="customer-row-avatar customer-row-avatar-fallback">
                              {getInitials(customer.firstName, customer.lastName)}
                            </div>
                          )}
                          <span className="customer-name-cell">{customer.firstName} {customer.lastName}</span>
                        </div>
                      </td>
                      <td>{customer.email || '-'}</td>
                      <td>{getRoleOrCompany(customer)}</td>
                      <td>{customer.phoneNumber || customer.whatsAppNumber || '-'}</td>
                      <td>
                        <div className="customer-table-actions">
                          <button className="secondary-button customer-action-button" onClick={() => onViewDetail(customer)}>
                            View
                          </button>
                          <button className="primary-button customer-action-button" onClick={() => onEdit(customer)}>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default CustomerListPage
