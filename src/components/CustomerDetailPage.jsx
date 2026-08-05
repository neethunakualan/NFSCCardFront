function CustomerDetailPage({ customer, isLoading, error, onEdit }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL || ''

  const getInitials = (firstName, lastName) => {
    const first = (firstName || '').trim().charAt(0)
    const last = (lastName || '').trim().charAt(0)
    return `${first}${last}`.toUpperCase() || 'CU'
  }

  const withFallback = (value) => value || '—'

  const toUrl = (value) => {
    if (!value) return ''
    if (/^https?:\/\//i.test(value)) return value
    return `https://${value}`
  }

  const toSocialUrl = (value, platform) => {
    if (!value) return ''

    const trimmed = value.trim()
    if (!trimmed) return ''
    if (/^https?:\/\//i.test(trimmed)) return trimmed

    const normalized = trimmed.replace(/^@/, '')

    if (platform === 'instagram') {
      return `https://www.instagram.com/${normalized}`
    }

    if (platform === 'linkedin') {
      if (normalized.startsWith('in/') || normalized.startsWith('company/')) {
        return `https://www.linkedin.com/${normalized}`
      }
      return `https://www.linkedin.com/in/${normalized}`
    }

    if (platform === 'facebook') {
      return `https://www.facebook.com/${normalized}`
    }

    return ''
  }

  const renderSocialValue = (value, platform) => {
    if (!value) return '—'

    const url = toSocialUrl(value, platform)
    if (!url) return value

    return (
      <a href={url} target="_blank" rel="noreferrer" className="customer-detail-link">
        {value}
      </a>
    )
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
      </main>
    )
  }

  if (!customer) {
    return (
      <main className="page-shell">
        <p>Customer not found.</p>
      </main>
    )
  }

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer'
  const profileImageSrc = resolveProfileImageSrc(
    customer.profileImageUrl || customer.profileImage || customer.imageUrl || customer.image
  )

  return (
    <main className="page-shell customer-detail-page">
      <header className="page-header customer-detail-header">
        <div>
          <h1>{fullName}</h1>
          <p>{withFallback(customer.email)}</p>
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={onEdit}>Edit</button>
        </div>
      </header>

      <section className="detail-card customer-detail-hero">
        <div className="customer-detail-avatar-wrap">
          {profileImageSrc ? (
            <img src={profileImageSrc} alt={`${fullName} profile`} className="customer-detail-avatar" />
          ) : (
            <div className="customer-detail-avatar customer-detail-avatar-fallback">
              {getInitials(customer.firstName, customer.lastName)}
            </div>
          )}
        </div>

        <div className="customer-detail-hero-text">
          <h2>{fullName}</h2>
          <p>{withFallback(customer.jobTitle)}</p>
          <p>{withFallback(customer.companyName)}</p>
        </div>

        <div className="customer-detail-meta">
          <div>
            <span className="customer-meta-label">Customer ID</span>
            <span className="customer-meta-value">{withFallback(customer.customerId)}</span>
          </div>
          <div>
            <span className="customer-meta-label">User ID</span>
            <span className="customer-meta-value">{withFallback(customer.userId)}</span>
          </div>
        </div>
      </section>

      <section className="customer-detail-grid">
        <article className="detail-card">
          <h2>Personal Information</h2>
          <dl className="customer-detail-list">
            <div>
              <dt>First Name</dt>
              <dd>{withFallback(customer.firstName)}</dd>
            </div>
            <div>
              <dt>Last Name</dt>
              <dd>{withFallback(customer.lastName)}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{withFallback(customer.email)}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{withFallback(customer.phoneNumber)}</dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>{withFallback(customer.whatsAppNumber)}</dd>
            </div>
          </dl>
        </article>

        <article className="detail-card">
          <h2>Business Information</h2>
          <dl className="customer-detail-list">
            <div>
              <dt>Company</dt>
              <dd>{withFallback(customer.companyName)}</dd>
            </div>
            <div>
              <dt>Job Title</dt>
              <dd>{withFallback(customer.jobTitle)}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>
                {customer.website ? (
                  <a href={toUrl(customer.website)} target="_blank" rel="noreferrer" className="customer-detail-link">
                    {customer.website}
                  </a>
                ) : '—'}
              </dd>
            </div>
          </dl>
        </article>

        <article className="detail-card">
          <h2>Social Links</h2>
          <dl className="customer-detail-list">
            <div>
              <dt>Instagram</dt>
              <dd>{renderSocialValue(customer.instagram, 'instagram')}</dd>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>{renderSocialValue(customer.linkedIn, 'linkedin')}</dd>
            </div>
            <div>
              <dt>Facebook</dt>
              <dd>{renderSocialValue(customer.facebook, 'facebook')}</dd>
            </div>
          </dl>
        </article>

        <article className="detail-card customer-detail-bio-card">
          <h2>About Customer</h2>
          <p className="customer-detail-bio">{withFallback(customer.bio)}</p>
        </article>
      </section>
    </main>
  )
}

export default CustomerDetailPage
