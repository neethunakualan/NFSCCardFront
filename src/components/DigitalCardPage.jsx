function DigitalCardPage({ user }) {
  const displayName = user?.role ? `NFSCCard ${user.role}` : 'NFSCCard User'
  const roleLabel = user?.role || 'Creative Director'
  const companyName = 'NFSCCard'
  const bio = 'Short profile for quick introductions, instant contact sharing, and NFC tap access.'

  const contacts = [
    { icon: '☎', value: '+1 555 012 8899', label: 'Work' },
    { icon: '✉', value: 'hello@nfsccard.com', label: 'Work' },
    { icon: '◔', value: 'nfsccard.com', label: 'Company' },
  ]

  return (
    <main className="page-shell digital-card-page">
      <section className="digital-card-shell">
        <article className="digital-card">
          <header className="digital-card-top">
            <div className="digital-card-brand">
              <div className="digital-card-mark" aria-hidden="true">
                <span />
              </div>
              <div>
                <p className="digital-card-brand-name">{companyName}</p>
                <p className="digital-card-brand-subtitle">Creative Agency</p>
              </div>
            </div>

            <div className="digital-card-avatar-wrap" aria-hidden="true">
              <div className="digital-card-avatar-ring">
                <div className="digital-card-avatar">{displayName.charAt(0).toUpperCase()}</div>
              </div>
            </div>

            <div className="digital-card-heading">
              <h1>{displayName}</h1>
              <p className="digital-card-pronoun">(she/her)</p>
              <p className="digital-card-role">{roleLabel}</p>
              <p className="digital-card-company">{companyName}</p>
            </div>
          </header>

          <section className="digital-card-bio">
            <p>{bio}</p>
          </section>

          <section className="digital-card-contacts">
            {contacts.map((contact) => (
              <div key={contact.label} className="digital-card-contact-row">
                <div className="digital-card-contact-icon" aria-hidden="true">
                  {contact.icon}
                </div>
                <div className="digital-card-contact-text">
                  <strong>{contact.value}</strong>
                  <span>{contact.label}</span>
                </div>
              </div>
            ))}
          </section>

          <footer className="digital-card-footer">
            <button className="digital-card-cta" type="button">+ Add to Contacts</button>
          </footer>
        </article>
      </section>
    </main>
  )
}

export default DigitalCardPage