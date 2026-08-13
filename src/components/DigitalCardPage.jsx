function DigitalCardPage({ customer, isLoading, error, onEdit }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  const getInitials = (firstName, lastName) => {
    const first = (firstName || "").trim().charAt(0);
    const last = (lastName || "").trim().charAt(0);

    return `${first}${last}`.toUpperCase() || "SC";
  };

  const fullName =
    `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() ||
    "Software Company";

  const profileImageSrc = (() => {
    const value =
      customer?.profileImageUrl ||
      customer?.profileImage ||
      customer?.imageUrl ||
      customer?.image;

    if (!value) return "";

    const raw = String(value).trim();

    if (/^(https?:\/\/|data:|blob:)/i.test(raw)) {
      return raw;
    }

    if (!apiBaseUrl) {
      return raw;
    }

    const base = apiBaseUrl.replace(/\/+$/, "");
    const path = raw.startsWith("/") ? raw : `/${raw}`;

    return `${base}${path}`;
  })();

  const websiteUrl = (value) => {
    if (!value) return "";

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `https://${value}`;
  };

  const whatsappUrl = customer?.whatsAppNumber
    ? `https://wa.me/${customer.whatsAppNumber.replace(/\D/g, "")}`
    : "";

  const socialUrl = (value, platform) => {
    if (!value) return "";

    const trimmed = value.trim();

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    const username = trimmed.replace(/^@/, "");

    if (platform === "instagram") {
      return `https://www.instagram.com/${username}`;
    }

    if (platform === "linkedin") {
      if (
        username.startsWith("in/") ||
        username.startsWith("company/")
      ) {
        return `https://www.linkedin.com/${username}`;
      }

      return `https://www.linkedin.com/in/${username}`;
    }

    if (platform === "facebook") {
      return `https://www.facebook.com/${username}`;
    }

    return "#";
  };

  if (isLoading) {
    return (
      <main className="software-card-page">
        <div className="software-loading">
          <div className="software-spinner"></div>
          <p>Loading digital card...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="software-card-page">
        <div className="software-error">{error}</div>
      </main>
    );
  }

  if (!customer) {
    return (
      <main className="software-card-page">
        <div className="software-error">
          Customer not found.
        </div>
      </main>
    );
  }

  return (
    <main className="software-card-page">

      {/* =====================================================
          FRONT CARD
      ===================================================== */}

      <section className="software-business-card software-front">

        {/* Decorative shapes */}
        <div className="soft-shape soft-shape-one"></div>
        <div className="soft-shape soft-shape-two"></div>

        {/* LEFT SIDE */}
        <div className="software-brand-side">

          <div className="software-logo">

            <svg
              viewBox="0 0 100 100"
              width="58"
              height="58"
              fill="none"
            >
              <rect
                x="8"
                y="8"
                width="84"
                height="84"
                rx="25"
                fill="#FFFFFF"
              />

              <path
                d="M35 38L24 50L35 62"
                stroke="#8056D6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M65 38L76 50L65 62"
                stroke="#8056D6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M57 31L43 69"
                stroke="#8056D6"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>

          </div>

          <h1 className="software-company-name">
            {customer.companyName || "CodeNest"}
          </h1>

          <div className="software-company-type">
            SOFTWARE SOLUTIONS
          </div>

          <div className="software-line"></div>

          <p className="software-tagline">
            We Code. We Innovate.
            <br />
            We <span>Deliver.</span>
          </p>

          {/* Coding illustration */}
          <div className="software-illustration">

            <div className="illustration-monitor">

              <div className="monitor-header">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="code-row row-one"></div>
              <div className="code-row row-two"></div>
              <div className="code-row row-three"></div>
              <div className="code-row row-four"></div>

              <div className="monitor-code">
                &lt;/&gt;
              </div>

            </div>

            <div className="monitor-stand"></div>

            <div className="illustration-plant">
              🌿
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="software-contact-side">

          <div className="software-person-header">

            <div>

              <h2>{fullName}</h2>

              <p>
                {customer.jobTitle || "CEO & Founder"}
              </p>

            </div>

            {onEdit && (
              <button
                className="software-edit-button"
                onClick={onEdit}
              >
                Edit
              </button>
            )}

          </div>

          <div className="software-purple-line"></div>


          {/* Contact information */}

          <div className="software-contact-list">

            {customer.phoneNumber && (
              <a
                href={`tel:${customer.phoneNumber}`}
                className="software-contact-item"
              >
                <div className="software-contact-icon">
                  <PhoneIcon />
                </div>

                <div>
                  <small>PHONE</small>
                  <span>{customer.phoneNumber}</span>
                </div>
              </a>
            )}


            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                className="software-contact-item"
              >
                <div className="software-contact-icon">
                  <EmailIcon />
                </div>

                <div>
                  <small>EMAIL</small>
                  <span>{customer.email}</span>
                </div>
              </a>
            )}


            {customer.website && (
              <a
                href={websiteUrl(customer.website)}
                target="_blank"
                rel="noreferrer"
                className="software-contact-item"
              >
                <div className="software-contact-icon">
                  <WebsiteIcon />
                </div>

                <div>
                  <small>WEBSITE</small>
                  <span>{customer.website}</span>
                </div>
              </a>
            )}


            {customer.whatsAppNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="software-contact-item"
              >
                <div className="software-contact-icon">
                  <WhatsAppIcon />
                </div>

                <div>
                  <small>WHATSAPP</small>
                  <span>{customer.whatsAppNumber}</span>
                </div>
              </a>
            )}

          </div>


          {/* Bottom section */}

          <div className="software-bottom-section">

            <div className="software-build-text">
              Let's Build the Future
              <span>♥</span>
            </div>

            {/* Profile image */}

            <div className="software-profile">

              {profileImageSrc ? (
                <img
                  src={profileImageSrc}
                  alt={fullName}
                />
              ) : (
                <div className="software-profile-fallback">
                  {getInitials(
                    customer.firstName,
                    customer.lastName
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BACK CARD
      ===================================================== */}

      <section className="software-business-card software-back">

        <div className="software-back-left">

          <div className="back-title">

            <span>Our</span>

            <strong>Services</strong>

          </div>

          <div className="software-purple-line"></div>


          <ServiceItem
            icon="&lt;/&gt;"
            title="Web Development"
            description="Modern, responsive & scalable websites"
          />

          <ServiceItem
            icon="📱"
            title="Mobile App Development"
            description="Android & iOS apps that users love"
          />

          <ServiceItem
            icon="☁"
            title="Cloud Solutions"
            description="Secure, reliable & scalable cloud services"
          />

          <ServiceItem
            icon="✦"
            title="UI/UX Design"
            description="Beautiful designs that deliver results"
          />

          <ServiceItem
            icon="↗"
            title="Digital Solutions"
            description="Custom solutions to grow your business"
          />

        </div>


        <div className="software-back-right">

          <div className="back-illustration">

            <div className="back-monitor">

              <div className="back-monitor-top">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="back-code">
                <span>&lt;</span>
                <span>/</span>
                <span>&gt;</span>
              </div>

              <div className="back-code-lines">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>

            </div>

            <div className="back-plant">
              🌿
            </div>

          </div>


          <p className="software-about">

            {customer.bio ||
              "We turn ideas into powerful software solutions that make businesses smarter and lives easier."}

          </p>


          <div className="software-heart-divider">
            <span></span>
            ♥
            <span></span>
          </div>


          <h3>Follow Us</h3>

          <div className="software-socials">

            {customer.instagram && (
              <a
                href={socialUrl(
                  customer.instagram,
                  "instagram"
                )}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}

            {customer.linkedIn && (
              <a
                href={socialUrl(
                  customer.linkedIn,
                  "linkedin"
                )}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}

            {customer.facebook && (
              <a
                href={socialUrl(
                  customer.facebook,
                  "facebook"
                )}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            )}

          </div>

        </div>


        <div className="software-back-wave"></div>

      </section>


      <p className="software-card-id">
        #{customer.customerId || "—"}
      </p>

    </main>
  );
}


/* =========================================================
   SERVICE ITEM
========================================================= */

function ServiceItem({ icon, title, description }) {
  return (
    <div className="software-service">

      <div
        className="software-service-icon"
        dangerouslySetInnerHTML={{ __html: icon }}
      />

      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

    </div>
  );
}


/* =========================================================
   ICONS
========================================================= */

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2
        19.79 19.79 0 01-8.63-3.07
        19.5 19.5 0 01-6-6
        19.79 19.79 0 01-3.07-8.67
        A2 2 0 014.11 2h3
        a2 2 0 012 1.72
        12.84 12.84 0 00.7 2.81
        2 2 0 01-.45 2.11L8.09 9.91
        a16 16 0 006 6l1.27-1.27
        a2 2 0 012.11-.45
        12.84 12.84 0 002.81.7
        A2 2 0 0122 16.92z"
      />
    </svg>
  );
}


function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}


function WebsiteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 3 3 15 0 18" />
      <path d="M12 3c-3 3-3 15 0 18" />
    </svg>
  );
}


function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="currentColor"
    >
      <path d="M12 2a10 10 0 00-8.66 15L2 22l5.2-1.36A10 10 0 1012 2zm0 18a8 8 0 01-4.08-1.12l-.3-.18-3.09.8.82-3.01-.2-.31A8 8 0 1112 20zm4.39-5.92c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.17-1.39-1.3-1.62-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}


export default DigitalCardPage;