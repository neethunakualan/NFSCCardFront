function DigitalCardPage({ customer, isLoading, error, onEdit }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL || ''

  const getInitials = (firstName, lastName) => {
    const first = (firstName || '').trim().charAt(0)
    const last = (lastName || '').trim().charAt(0)
    return `${first}${last}`.toUpperCase() || 'CU'
  }

  /* Resolve theme: explicit customer.theme wins; else rotate 5 themes by ID */
  const resolveTheme = (c) => {
    const explicit = (c?.theme || c?.cardTheme || '').toLowerCase()
    if (explicit === 'summer' || explicit === 'light') return 'summer'
    if (explicit === 'dark' || explicit === 'luxury') return 'dark'
    if (explicit === 'elegant' || explicit === 'rose') return 'elegant'
    if (explicit === 'emerald' || explicit === 'forest' || explicit === 'green') return 'emerald'
    if (explicit === 'baby' || explicit === 'cute' || explicit === 'kids') return 'baby'
    if (explicit === 'bizcard' || explicit === 'windows' || explicit === 'card') return 'bizcard'
    if (explicit === 'boho' || explicit === 'wawa' || explicit === 'nature') return 'boho'
    const id = Number(c?.customerId) || Number(c?.id) || 0
    const cycle = ['dark', 'summer', 'elegant', 'emerald', 'baby']
    return cycle[id % 5]
  }

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
    if (platform === 'instagram') return `https://www.instagram.com/${normalized}`
    if (platform === 'linkedin') {
      if (normalized.startsWith('in/') || normalized.startsWith('company/'))
        return `https://www.linkedin.com/${normalized}`
      return `https://www.linkedin.com/in/${normalized}`
    }
    if (platform === 'facebook') return `https://www.facebook.com/${normalized}`
    return ''
  }

  const resolveProfileImageSrc = (value) => {
    if (!value) return ''
    const raw = String(value).trim()
    if (!raw) return ''
    if (/^(https?:\/\/|data:|blob:)/i.test(raw)) return raw
    if (!apiBaseUrl) return raw
    const normalizedBase = apiBaseUrl.replace(/\/+$/, '')
    const normalizedPath = raw.startsWith('/') ? raw : `/${raw}`
    return `${normalizedBase}${normalizedPath}`
  }

  if (isLoading) {
    return (
      <main className="dc-shell">
        <div className="dc-loader">
          <div className="dc-spinner" />
          <p>Loading...</p>
        </div>
      </main>
    )
  }
  if (error) return <main className="dc-shell"><p className="dc-error">{error}</p></main>
  if (!customer) return <main className="dc-shell"><p className="dc-error">Customer not found.</p></main>

  const theme = resolveTheme(customer)
  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer'
  const profileImageSrc = resolveProfileImageSrc(
    customer.profileImageUrl || customer.profileImage || customer.imageUrl || customer.image
  )

  const contacts = [
    { href: `mailto:${customer.email}`, label: customer.email, tag: 'Email', svg: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', show: !!customer.email },
    { href: `tel:${customer.phoneNumber}`, label: customer.phoneNumber, tag: 'Phone', svg: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', show: !!customer.phoneNumber },
    { href: `https://wa.me/${(customer.whatsAppNumber || '').replace(/\D/g, '')}`, label: customer.whatsAppNumber, tag: 'WhatsApp', svg: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M11.999 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5.135-1.318A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z', show: !!customer.whatsAppNumber, external: true },
    { href: toUrl(customer.website), label: customer.website, tag: 'Website', svg: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', show: !!customer.website, external: true },
  ]

  const socials = [
    { platform: 'instagram', label: 'Instagram', value: customer.instagram, color: '#E1306C', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
    { platform: 'linkedin', label: 'LinkedIn', value: customer.linkedIn, color: '#0077B5', svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { platform: 'facebook', label: 'Facebook', value: customer.facebook, color: '#1877F2', svg: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  ]

  /* ── Rose Gradient layout ── */
  if (theme === 'elegant') {
    return (
      <main className="rg-shell">
        {/* Decorative blobs */}
        <div className="rg-blob rg-blob1" aria-hidden="true" />
        <div className="rg-blob rg-blob2" aria-hidden="true" />

        {/* Hero */}
        <div className="rg-hero">
          {onEdit && (
            <button className="rg-edit-btn" onClick={onEdit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
          )}
          <div className="rg-avatar-ring">
            {profileImageSrc ? (
              <img src={profileImageSrc} alt={fullName} className="rg-avatar" />
            ) : (
              <div className="rg-avatar rg-avatar-fallback">
                {getInitials(customer.firstName, customer.lastName)}
              </div>
            )}
          </div>
          <h1 className="rg-name">{fullName}</h1>
          {customer.jobTitle && (
            <p className="rg-role">{customer.jobTitle}</p>
          )}
          {customer.companyName && (
            <span className="rg-company-badge">{customer.companyName}</span>
          )}
        </div>

        {/* Body */}
        <div className="rg-body">

          {/* Contact grid */}
          {contacts.some(c => c.show) && (
            <div className="rg-block">
              <p className="rg-label">Get in Touch</p>
              <div className="rg-contact-grid">
                {contacts.filter(c => c.show).map((c, i) => (
                  <a key={i} href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="rg-contact-card">
                    <div className="rg-contact-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" d={c.svg} />
                      </svg>
                    </div>
                    <div>
                      <p className="rg-contact-tag">{c.tag}</p>
                      <p className="rg-contact-val">{c.label}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {customer.bio && (
            <div className="rg-block">
              <p className="rg-label">About</p>
              <p className="rg-bio">{customer.bio}</p>
            </div>
          )}

          {/* Social */}
          {socials.some(s => s.value) && (
            <div className="rg-block">
              <p className="rg-label">Social</p>
              <div className="rg-socials">
                {socials.map(({ platform, label, value, color, svg }) => {
                  if (!value) return null
                  const url = toSocialUrl(value, platform)
                  return (
                    <a key={platform} href={url} target="_blank" rel="noreferrer"
                      className="rg-social-btn" style={{ '--sc': color }}>
                      <div className="rg-social-ico">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                          <path d={svg} />
                        </svg>
                      </div>
                      <span>{label}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          <p className="rg-id">#{customer.customerId || '—'}</p>
        </div>
      </main>
    )
  }

  /* ── Emerald Forest layout ── */
  if (theme === 'emerald') {
    return (
      <main className="em-shell">
        <div className="em-card">
          {/* Top accent bar */}
          <div className="em-topbar">
            <div className="em-topbar-dots" aria-hidden="true">
              <span /><span /><span />
            </div>
            {onEdit && (
              <button className="em-edit-btn" onClick={onEdit}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {/* Profile block */}
          <div className="em-profile">
            <div className="em-avatar-wrap">
              {profileImageSrc ? (
                <img src={profileImageSrc} alt={fullName} className="em-avatar" />
              ) : (
                <div className="em-avatar em-avatar-fallback">
                  {getInitials(customer.firstName, customer.lastName)}
                </div>
              )}
              <div className="em-avatar-badge" aria-hidden="true" />
            </div>
            <div className="em-profile-text">
              <h1 className="em-name">{fullName}</h1>
              {customer.jobTitle && <p className="em-role">{customer.jobTitle}</p>}
              {customer.companyName && (
                <p className="em-company">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {customer.companyName}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="em-divider" />

          {/* Contact list */}
          {contacts.some(c => c.show) && (
            <div className="em-section">
              <div className="em-contact-list">
                {contacts.filter(c => c.show).map((c, i) => (
                  <a key={i} href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="em-contact-row">
                    <div className="em-contact-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" d={c.svg} />
                      </svg>
                    </div>
                    <div className="em-contact-info">
                      <span className="em-contact-tag">{c.tag}</span>
                      <span className="em-contact-val">{c.label}</span>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="em-arrow">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {customer.bio && (
            <div className="em-section">
              <p className="em-bio">{customer.bio}</p>
            </div>
          )}

          {/* Socials */}
          {socials.some(s => s.value) && (
            <div className="em-section">
              <div className="em-socials">
                {socials.map(({ platform, label, value, color, svg }) => {
                  if (!value) return null
                  const url = toSocialUrl(value, platform)
                  return (
                    <a key={platform} href={url} target="_blank" rel="noreferrer"
                      className="em-social" style={{ '--sc': color }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d={svg} />
                      </svg>
                      <span>{label}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          <p className="em-id">#{customer.customerId || '—'}</p>
        </div>
      </main>
    )
  }

  /* ── Bizcard / Windows two-card layout ── */
  if (theme === 'bizcard') {
    return (
      <main className="bc-shell">

        {/* Top card — logo + name */}
        <div className="bc-card-top">
          <div className="bc-decos" aria-hidden="true">
            <svg className="bc-dec bc-star1" viewBox="0 0 24 24" fill="#f59e0b" width="28" height="28"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg className="bc-dec bc-star2" viewBox="0 0 24 24" fill="#f59e0b" width="20" height="20"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg className="bc-dec bc-star3" viewBox="0 0 24 24" fill="#f59e0b" width="22" height="22"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <div className="bc-dec bc-circle1" />
            <div className="bc-dec bc-circle2" />
            <div className="bc-dec bc-dot1" />
            <div className="bc-dec bc-dot2" />
          </div>

          <div className="bc-logo-area">
            <div className="bc-logo-circle">
              <svg viewBox="0 0 80 80" width="60" height="60">
                <circle cx="40" cy="44" r="26" fill="#fff" stroke="#7c3aed" strokeWidth="2"/>
                <circle cx="16" cy="44" r="6" fill="#fff" stroke="#7c3aed" strokeWidth="2"/>
                <circle cx="64" cy="44" r="6" fill="#fff" stroke="#7c3aed" strokeWidth="2"/>
                <path d="M34 20 Q40 14 46 20" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="32" cy="42" r="3.5" fill="#7c3aed"/>
                <circle cx="48" cy="42" r="3.5" fill="#7c3aed"/>
                <circle cx="33.5" cy="40.5" r="1.2" fill="#fff"/>
                <circle cx="49.5" cy="40.5" r="1.2" fill="#fff"/>
                <path d="M32 52 Q40 59 48 52" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="26" cy="50" r="5" fill="#fca5a5" opacity="0.4"/>
                <circle cx="54" cy="50" r="5" fill="#fca5a5" opacity="0.4"/>
              </svg>
            </div>
            <p className="bc-brand">{customer.companyName || 'Baby Shop'}</p>
            {customer.jobTitle && <p className="bc-brand-tag">{customer.jobTitle}</p>}
          </div>

          <div className="bc-name-area">
            <h1 className="bc-name">{fullName}</h1>
            <p className="bc-role">{customer.jobTitle || 'Founder'}</p>
          </div>

          {onEdit && (
            <button className="bc-edit-btn" onClick={onEdit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
          )}
        </div>

        {/* Bottom card — logo + contacts | photo + socials */}
        <div className="bc-card-bot">
          <div className="bc-decos2" aria-hidden="true">
            <svg className="bc-dec2 bc-star4" viewBox="0 0 24 24" fill="#f59e0b" width="28" height="28"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <div className="bc-dec2 bc-arc" />
            <div className="bc-dec2 bc-circle3" />
          </div>

          <div className="bc-bot-left">
            <div className="bc-mini-logo">
              <svg viewBox="0 0 80 80" width="36" height="36">
                <circle cx="40" cy="44" r="26" fill="#fff" stroke="#7c3aed" strokeWidth="2.5"/>
                <circle cx="16" cy="44" r="6" fill="#fff" stroke="#7c3aed" strokeWidth="2.5"/>
                <circle cx="64" cy="44" r="6" fill="#fff" stroke="#7c3aed" strokeWidth="2.5"/>
                <path d="M34 20 Q40 14 46 20" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="32" cy="42" r="3.5" fill="#7c3aed"/>
                <circle cx="48" cy="42" r="3.5" fill="#7c3aed"/>
                <circle cx="33.5" cy="40.5" r="1.2" fill="#fff"/>
                <circle cx="49.5" cy="40.5" r="1.2" fill="#fff"/>
                <path d="M32 52 Q40 59 48 52" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="26" cy="50" r="5" fill="#fca5a5" opacity="0.4"/>
                <circle cx="54" cy="50" r="5" fill="#fca5a5" opacity="0.4"/>
              </svg>
              <div>
                <p className="bc-mini-brand">{customer.companyName || 'Baby Shop'}</p>
                {customer.bio && <p className="bc-mini-tag">{customer.bio.slice(0, 28)}{customer.bio.length > 28 ? '…' : ''}</p>}
              </div>
            </div>
            <div className="bc-contacts">
              {customer.phoneNumber && (
                <a href={`tel:${customer.phoneNumber}`} className="bc-crow">
                  <svg viewBox="0 0 24 24" fill="#7c3aed" width="13" height="13"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                  <span>{customer.phoneNumber}</span>
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="bc-crow">
                  <svg viewBox="0 0 24 24" fill="#7c3aed" width="13" height="13"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <span>{customer.email}</span>
                </a>
              )}
              {customer.website && (
                <a href={toUrl(customer.website)} target="_blank" rel="noreferrer" className="bc-crow">
                  <svg viewBox="0 0 24 24" fill="#7c3aed" width="13" height="13"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  <span>{customer.website}</span>
                </a>
              )}
              {customer.whatsAppNumber && (
                <a href={`https://wa.me/${customer.whatsAppNumber.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="bc-crow">
                  <svg viewBox="0 0 24 24" fill="#7c3aed" width="13" height="13"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5.135-1.338A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                  <span>{customer.whatsAppNumber}</span>
                </a>
              )}
            </div>
          </div>

          <div className="bc-bot-right">
            <div className="bc-photo-wrap">
              {profileImageSrc ? (
                <img src={profileImageSrc} alt={fullName} className="bc-photo"/>
              ) : (
                <div className="bc-photo bc-photo-fallback">
                  {getInitials(customer.firstName, customer.lastName)}
                </div>
              )}
            </div>
            {socials.some(s => s.value) && (
              <div className="bc-social-row">
                {socials.map(({ platform, value, color, svg }) => {
                  if (!value) return null
                  return (
                    <a key={platform} href={toSocialUrl(value, platform)} target="_blank" rel="noreferrer"
                      className="bc-sicon" style={{ '--sc': color }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d={svg}/></svg>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <p className="bc-id">#{customer.customerId || '—'}</p>
      </main>
    )
  }

  /* -- Boho Baby Card (WaWa style) -- */
  if (theme === 'boho') {
    return (
      <main className="wb-shell">

        {/* -- FRONT CARD -- */}
        <section className="wb-card wb-front">
          {/* Sage green right-side arch */}
          <div className="wb-arch" aria-hidden="true" />

          {/* Scattered decorations */}
          <div className="wb-decos" aria-hidden="true">
            <svg className="wb-d wb-heart1" viewBox="0 0 24 24" fill="#e8a5a5" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg className="wb-d wb-heart2" viewBox="0 0 24 24" fill="#e8a5a5" width="12" height="12"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            {/* Clouds */}
            <svg className="wb-d wb-cloud1" viewBox="0 0 80 36" fill="#ddd8cc" width="70" height="32"><path d="M68 24a10 10 0 00-10-10 10 10 0 00-1.2.12A14 14 0 0020 20 8 8 0 0010 28h58z"/></svg>
            <svg className="wb-d wb-cloud2" viewBox="0 0 80 36" fill="#ddd8cc" width="50" height="24"><path d="M68 24a10 10 0 00-10-10 10 10 0 00-1.2.12A14 14 0 0020 20 8 8 0 0010 28h58z"/></svg>
            {/* Flower */}
            <svg className="wb-d wb-flower1" viewBox="0 0 50 50" width="36" height="36">
              <circle cx="25" cy="25" r="5" fill="#f0c987"/>
              <ellipse cx="25" cy="12" rx="5" ry="7" fill="#f5e2c0" transform="rotate(0 25 25)"/>
              <ellipse cx="25" cy="12" rx="5" ry="7" fill="#f5e2c0" transform="rotate(60 25 25)"/>
              <ellipse cx="25" cy="12" rx="5" ry="7" fill="#f5e2c0" transform="rotate(120 25 25)"/>
              <ellipse cx="25" cy="12" rx="5" ry="7" fill="#f5e2c0" transform="rotate(180 25 25)"/>
              <ellipse cx="25" cy="12" rx="5" ry="7" fill="#f5e2c0" transform="rotate(240 25 25)"/>
              <ellipse cx="25" cy="12" rx="5" ry="7" fill="#f5e2c0" transform="rotate(300 25 25)"/>
            </svg>
          </div>

          {/* Bunny character */}
          <div className="wb-char wb-bunny-wrap" aria-hidden="true">
            <svg viewBox="0 0 110 180" width="110" height="180">
              {/* Balloon string */}
              <path d="M78 105 C85 85 82 55 78 35" fill="none" stroke="#a0c8a0" strokeWidth="1.8" strokeDasharray="4,3"/>
              {/* Balloon */}
              <ellipse cx="78" cy="24" rx="14" ry="17" fill="#b8d8c0" stroke="#8cb8a0" strokeWidth="1.5"/>
              <path d="M78 41 L78 47" stroke="#8cb8a0" strokeWidth="1.5"/>
              <ellipse cx="74" cy="18" rx="5" ry="7" fill="rgba(255,255,255,0.35)"/>
              {/* Party hat */}
              <polygon points="45,18 65,18 55,35" fill="#6aaa8f" stroke="#4a8a6f" strokeWidth="1"/>
              <circle cx="55" cy="18" r="3.5" fill="#f0c987"/>
              <line x1="45" y1="18" x2="65" y2="18" stroke="#fff" strokeWidth="1.5" opacity="0.5"/>
              {/* Left ear */}
              <ellipse cx="38" cy="60" rx="9" ry="22" fill="#f0ebe0" stroke="#c8bca8" strokeWidth="1.5"/>
              <ellipse cx="38" cy="62" rx="4.5" ry="15" fill="#f5b8b8" opacity="0.5"/>
              {/* Right ear */}
              <ellipse cx="72" cy="60" rx="9" ry="22" fill="#f0ebe0" stroke="#c8bca8" strokeWidth="1.5"/>
              <ellipse cx="72" cy="62" rx="4.5" ry="15" fill="#f5b8b8" opacity="0.5"/>
              {/* Head */}
              <circle cx="55" cy="85" r="26" fill="#f5f0e8" stroke="#c8bca8" strokeWidth="1.5"/>
              {/* Eyes */}
              <circle cx="45" cy="80" r="4" fill="#4a3828"/>
              <circle cx="65" cy="80" r="4" fill="#4a3828"/>
              <circle cx="46.8" cy="78.2" r="1.5" fill="#fff"/>
              <circle cx="66.8" cy="78.2" r="1.5" fill="#fff"/>
              {/* Nose */}
              <ellipse cx="55" cy="87" rx="3.5" ry="2.5" fill="#f0a0b0"/>
              {/* Smile */}
              <path d="M49 91 Q55 97 61 91" fill="none" stroke="#4a3828" strokeWidth="1.8" strokeLinecap="round"/>
              {/* Cheeks */}
              <circle cx="40" cy="87" r="6" fill="#f8b0b0" opacity="0.28"/>
              <circle cx="70" cy="87" r="6" fill="#f8b0b0" opacity="0.28"/>
              {/* Body */}
              <rect x="40" y="109" width="30" height="34" rx="12" fill="#c8956a"/>
              {/* Suspender straps */}
              <line x1="47" y1="109" x2="47" y2="143" stroke="#6aaa8f" strokeWidth="3" strokeLinecap="round"/>
              <line x1="63" y1="109" x2="63" y2="143" stroke="#6aaa8f" strokeWidth="3" strokeLinecap="round"/>
              <line x1="47" y1="124" x2="63" y2="124" stroke="#6aaa8f" strokeWidth="2.5"/>
              {/* Legs */}
              <ellipse cx="46" cy="150" rx="8" ry="12" fill="#f0ebe0" stroke="#c8bca8" strokeWidth="1.2"/>
              <ellipse cx="64" cy="150" rx="8" ry="12" fill="#f0ebe0" stroke="#c8bca8" strokeWidth="1.2"/>
              {/* Feet */}
              <ellipse cx="44" cy="162" rx="10" ry="5" fill="#f0ebe0" stroke="#c8bca8" strokeWidth="1"/>
              <ellipse cx="66" cy="162" rx="10" ry="5" fill="#f0ebe0" stroke="#c8bca8" strokeWidth="1"/>
            </svg>
          </div>

          {/* Brand */}
          <div className="wb-brand">
            <h1 className="wb-company">{customer.companyName || 'Baby Shop'}</h1>
            <p className="wb-tagline">{customer.bio ? customer.bio.slice(0, 22) : 'babies & kids'}</p>
          </div>

          {onEdit && (
            <button className="wb-edit-btn" onClick={onEdit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
          )}
        </section>

        {/* -- BACK CARD -- */}
        <section className="wb-card wb-back">
          {/* Back decorations */}
          <div className="wb-back-decos" aria-hidden="true">
            {/* Botanical stems */}
            <svg className="wb-d wb-stem1" viewBox="0 0 20 60" width="16" height="50" fill="none" stroke="#8ab898" strokeWidth="1.5">
              <path d="M10 55 Q8 40 10 25 Q12 10 10 0"/><path d="M10 40 Q4 32 2 26"/><path d="M10 30 Q16 22 18 16"/>
            </svg>
            <svg className="wb-d wb-stem2" viewBox="0 0 20 60" width="12" height="40" fill="none" stroke="#8ab898" strokeWidth="1.5">
              <path d="M10 55 Q8 40 10 25 Q12 10 10 0"/><path d="M10 35 Q4 27 2 21"/>
            </svg>
            {/* Clouds back */}
            <svg className="wb-d wb-cloud3" viewBox="0 0 80 36" fill="#ddd8cc" width="55" height="25"><path d="M68 24a10 10 0 00-10-10 10 10 0 00-1.2.12A14 14 0 0020 20 8 8 0 0010 28h58z"/></svg>
          </div>

          {/* Left: name + contacts */}
          <div className="wb-back-left">
            <div className="wb-person">
              <p className="wb-fullname">{fullName}</p>
              <p className="wb-person-role">{customer.jobTitle || 'Founder'}</p>
            </div>
            <div className="wb-contacts">
              {customer.phoneNumber && (
                <a href={`tel:${customer.phoneNumber}`} className="wb-cline">
                  <svg viewBox="0 0 24 24" fill="#6aaa8f" width="13" height="13"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                  <span>{customer.phoneNumber}</span>
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="wb-cline">
                  <svg viewBox="0 0 24 24" fill="#6aaa8f" width="13" height="13"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <span>{customer.email}</span>
                </a>
              )}
              {customer.website && (
                <a href={toUrl(customer.website)} target="_blank" rel="noreferrer" className="wb-website-pill">
                  {customer.website}
                </a>
              )}
              {customer.whatsAppNumber && (
                <a href={`https://wa.me/${customer.whatsAppNumber.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="wb-cline">
                  <svg viewBox="0 0 24 24" fill="#6aaa8f" width="13" height="13"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5.135-1.338A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                  <span>{customer.whatsAppNumber}</span>
                </a>
              )}
            </div>
            {socials.some(s => s.value) && (
              <div className="wb-socials">
                {socials.map(({ platform, value, color, svg }) => {
                  if (!value) return null
                  return (
                    <a key={platform} href={toSocialUrl(value, platform)} target="_blank" rel="noreferrer"
                      className="wb-sicon" style={{ '--sc': color }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d={svg}/></svg>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right: rainbow + lion */}
          <div className="wb-illus" aria-hidden="true">
            {/* Rainbow */}
            <svg viewBox="0 0 130 80" width="140" height="86">
              <path d="M8 68 Q65 4 122 68"  fill="none" stroke="#6aaa8f" strokeWidth="10" strokeLinecap="round"/>
              <path d="M18 68 Q65 16 112 68" fill="none" stroke="#a8c8b0" strokeWidth="10" strokeLinecap="round"/>
              <path d="M28 68 Q65 28 102 68" fill="none" stroke="#d4a882" strokeWidth="10" strokeLinecap="round"/>
              <path d="M38 68 Q65 38 92 68"  fill="none" stroke="#e8d5b0" strokeWidth="10" strokeLinecap="round"/>
              <path d="M48 68 Q65 48 82 68"  fill="none" stroke="#f0ebe0" strokeWidth="10" strokeLinecap="round"/>
              {/* Star */}
              <polygon points="65,60 67.5,67 74.5,67 69,71 71.5,78 65,74 58.5,78 61,71 55.5,67 62.5,67" fill="#f0c060"/>
            </svg>
            {/* Lion cub */}
            <svg viewBox="0 0 90 90" width="80" height="80">
              <circle cx="45" cy="48" r="33" fill="#e0a860" opacity="0.4"/>
              <circle cx="45" cy="45" r="25" fill="#eab870"/>
              <circle cx="25" cy="26" r="9" fill="#e0a860"/>
              <circle cx="65" cy="26" r="9" fill="#e0a860"/>
              <circle cx="25" cy="26" r="5" fill="#f5c898"/>
              <circle cx="65" cy="26" r="5" fill="#f5c898"/>
              <polygon points="36,14 54,14 45,28" fill="#6aaa8f"/>
              <circle cx="45" cy="14" r="3" fill="#f0c987"/>
              <circle cx="35" cy="42" r="5" fill="#4a3828"/>
              <circle cx="55" cy="42" r="5" fill="#4a3828"/>
              <circle cx="37" cy="40" r="2" fill="#fff"/>
              <circle cx="57" cy="40" r="2" fill="#fff"/>
              <ellipse cx="45" cy="51" rx="6" ry="4" fill="#c07840"/>
              <path d="M38 56 Q45 62 52 56" fill="none" stroke="#4a3828" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="30" cy="50" r="6" fill="#f8a0a0" opacity="0.25"/>
              <circle cx="60" cy="50" r="6" fill="#f8a0a0" opacity="0.25"/>
            </svg>
          </div>

          <p className="wb-id">#{customer.customerId || '�'}</p>
        </section>

      </main>
    )
  }
  /* -- Baby / Summer Yellow layout -- */
  if (theme === 'baby' || theme === 'bizcard') {
    return (
      <main className="sy-shell">

        {/* Decorative sun rays top-right */}
        <div className="sy-sun" aria-hidden="true">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(r => (
            <div key={r} className="sy-ray" style={{ transform: `rotate(${r}deg)` }} />
          ))}
        </div>

        {/* Hero */}
        <div className="sy-hero">
          <div className="sy-hero-pattern" aria-hidden="true" />
          {onEdit && (
            <button className="sy-edit-btn" onClick={onEdit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
          )}

          {/* Baby face logo + brand */}
          <div className="sy-brand">
            <div className="sy-logo">
              <svg viewBox="0 0 80 80" width="52" height="52">
                <circle cx="40" cy="44" r="26" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                <circle cx="16" cy="44" r="6"  fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                <circle cx="64" cy="44" r="6"  fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                <path d="M34 20 Q40 14 46 20" fill="none" stroke="#c2500a" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="32" cy="42" r="3.5" fill="#c2500a"/>
                <circle cx="48" cy="42" r="3.5" fill="#c2500a"/>
                <circle cx="33.5" cy="40.5" r="1.2" fill="#fff"/>
                <circle cx="49.5" cy="40.5" r="1.2" fill="#fff"/>
                <path d="M32 52 Q40 59 48 52" fill="none" stroke="#c2500a" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="26" cy="50" r="5" fill="#fdba74" opacity="0.5"/>
                <circle cx="54" cy="50" r="5" fill="#fdba74" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <p className="sy-brand-name">{customer.companyName || 'Baby Shop'}</p>
              {customer.jobTitle && <p className="sy-brand-tag">{customer.jobTitle}</p>}
            </div>
          </div>

          {/* Avatar */}
          <div className="sy-avatar-ring">
            {profileImageSrc ? (
              <img src={profileImageSrc} alt={fullName} className="sy-avatar"/>
            ) : (
              <div className="sy-avatar sy-avatar-fallback">
                {getInitials(customer.firstName, customer.lastName)}
              </div>
            )}
          </div>

          <h1 className="sy-name">{fullName}</h1>
          {customer.jobTitle && <p className="sy-role">{customer.jobTitle}</p>}

          {/* Baby product icons row */}
          <div className="sy-icons" aria-hidden="true">
            {/* Bottle */}
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M8 6h8l1 2v9a3 3 0 01-3 3H9a3 3 0 01-3-3V8l1-2zM9 11h6"/></svg>
            {/* Star */}
            <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {/* Heart */}
            <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            {/* Star */}
            <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" width="16" height="16"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {/* Pacifier */}
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" width="20" height="20"><circle cx="12" cy="11" r="4"/><path strokeLinecap="round" d="M12 15v2M10 17h4"/><circle cx="12" cy="7" r="1.5" fill="rgba(255,255,255,0.8)" stroke="none"/></svg>
          </div>
        </div>

        {/* Body */}
        <div className="sy-body">

          {/* Contact cards */}
          {contacts.some(c => c.show) && (
            <div className="sy-block">
              <p className="sy-label">Contact</p>
              <div className="sy-contacts">
                {contacts.filter(c => c.show).map((c, i) => (
                  <a key={i} href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="sy-contact-row">
                    <div className="sy-contact-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                        <path strokeLinecap="round" strokeLinejoin="round" d={c.svg}/>
                      </svg>
                    </div>
                    <div className="sy-contact-info">
                      <span className="sy-contact-tag">{c.tag}</span>
                      <span className="sy-contact-val">{c.label}</span>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13" className="sy-arrow">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Product tiles */}
          <div className="sy-products">
            {[
              { d: 'M9 3h6M8 6h8l1 2v9a3 3 0 01-3 3H9a3 3 0 01-3-3V8l1-2zM9 11h6', label: 'Feeding' },
              { d: 'M12 3C8 3 5 6 5 10c0 3 1.5 5.5 4 7l1 4h4l1-4c2.5-1.5 4-4 4-7 0-4-3-7-7-7z', label: 'Clothing' },
              { d: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z', label: 'Toys' },
              { d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Care' },
            ].map(p => (
              <div key={p.label} className="sy-product-tile">
                <div className="sy-product-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={p.d}/>
                  </svg>
                </div>
                <span>{p.label}</span>
              </div>
            ))}
          </div>

          {/* Bio */}
          {customer.bio && (
            <div className="sy-block">
              <p className="sy-label">About</p>
              <p className="sy-bio">{customer.bio}</p>
            </div>
          )}

          {/* Socials */}
          {socials.some(s => s.value) && (
            <div className="sy-block">
              <p className="sy-label">Follow Us</p>
              <div className="sy-socials">
                {socials.map(({ platform, label, value, color, svg }) => {
                  if (!value) return null
                  return (
                    <a key={platform} href={toSocialUrl(value, platform)} target="_blank" rel="noreferrer"
                      className="sy-social" style={{ '--sc': color }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d={svg}/></svg>
                      {label}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          <p className="sy-id">#{customer.customerId || '�'}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="dc-shell" data-theme={theme}>
      <div className="dc-orb dc-orb1" aria-hidden="true" />
      <div className="dc-orb dc-orb2" aria-hidden="true" />
      <div className="dc-orb dc-orb3" aria-hidden="true" />
      <div className="dc-hero">
        <div className="dc-hero-overlay" aria-hidden="true" />
        {onEdit && (
          <button className="dc-edit-btn" onClick={onEdit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        )}
        <div className="dc-hero-content">
          <div className="dc-avatar-ring">
            {profileImageSrc ? (
              <img src={profileImageSrc} alt={fullName} className="dc-avatar" />
            ) : (
              <div className="dc-avatar dc-avatar-fallback">
                {getInitials(customer.firstName, customer.lastName)}
              </div>
            )}
          </div>
          <h1 className="dc-name">{fullName}</h1>
          {(customer.jobTitle || customer.companyName) && (
            <p className="dc-sub">
              {customer.jobTitle}{customer.jobTitle && customer.companyName && ' � '}{customer.companyName}
            </p>
          )}
        </div>
        <svg className="dc-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
      <div className="dc-body">
        {customer.bio && (
          <div className="dc-card dc-bio-card">
            <span className="dc-card-label">About</span>
            <p className="dc-bio">{customer.bio}</p>
          </div>
        )}
        {contacts.some(c => c.show) && (
          <div className="dc-card">
            <span className="dc-card-label">Contact</span>
            <div className="dc-contact-grid">
              {contacts.filter(c => c.show).map((c, i) => (
                <a key={i} href={c.href} {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})} className="dc-contact-item">
                  <div className="dc-contact-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d={c.svg} />
                    </svg>
                  </div>
                  <div className="dc-contact-text">
                    <span className="dc-contact-tag">{c.tag}</span>
                    <span className="dc-contact-val">{c.label}</span>
                  </div>
                  <svg className="dc-contact-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
        {socials.some(s => s.value) && (
          <div className="dc-card">
            <span className="dc-card-label">Social</span>
            <div className="dc-social-grid">
              {socials.map(({ platform, label, value, color, svg }) => {
                if (!value) return null
                return (
                  <a key={platform} href={toSocialUrl(value, platform)} target="_blank" rel="noreferrer"
                    className="dc-social-tile" style={{ '--sc': color }}>
                    <div className="dc-social-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d={svg} /></svg>
                    </div>
                    <span>{label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
        <p className="dc-id">ID #{customer.customerId || '�'}</p>
      </div>
    </main>
  )
}

export default DigitalCardPage