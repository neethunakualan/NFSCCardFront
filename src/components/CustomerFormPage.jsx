import { useState, useEffect, useRef } from 'react'

function CustomerFormPage({
  mode,
  customer,
  isLoading,
  error,
  onSave,
  onCancel,
}) {
  const apiBaseUrl = import.meta.env.VITE_API_URL || ''
  const fileInputRef = useRef(null)
  const previewObjectUrlRef = useRef('')
  const [imagePreviewSrc, setImagePreviewSrc] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    whatsAppNumber: '',
    companyName: '',
    jobTitle: '',
    website: '',
    instagram: '',
    linkedIn: '',
    facebook: '',
    bio: '',
    profileImage: null,
  })

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

  useEffect(() => {
    if (mode === 'edit' && customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phoneNumber: customer.phoneNumber || '',
        whatsAppNumber: customer.whatsAppNumber || '',
        companyName: customer.companyName || '',
        jobTitle: customer.jobTitle || '',
        website: customer.website || '',
        instagram: customer.instagram || '',
        linkedIn: customer.linkedIn || '',
        facebook: customer.facebook || '',
        bio: customer.bio || '',
        profileImage: null,
      })

      setImagePreviewSrc(
        resolveProfileImageSrc(
          customer.profileImageUrl || customer.profileImage || customer.imageUrl || customer.image
        )
      )
    } else if (mode === 'create') {
      setImagePreviewSrc('')
    }
  }, [mode, customer])

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [])


  const handleChange = (event) => {
    const { name, value } = event.target

    const isNumericField = name === 'phoneNumber' || name === 'whatsAppNumber'
    const nextValue = isNumericField ? value.replace(/\D/g, '') : value

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }))
  }


  const handleImageChange = (event) => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
    }

    const previewSrc = URL.createObjectURL(file)
    previewObjectUrlRef.current = previewSrc

    setImagePreviewSrc(previewSrc)

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }))
  }


  const handleRemoveImage = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = ''
    }

    setFormData((prev) => ({
      ...prev,
      profileImage: null,
    }))

    setImagePreviewSrc('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = new FormData()

    form.append('firstName', formData.firstName)
    form.append('lastName', formData.lastName)
    form.append('email', formData.email)
    form.append('phoneNumber', formData.phoneNumber)
    form.append('whatsAppNumber', formData.whatsAppNumber)
    form.append('companyName', formData.companyName)
    form.append('jobTitle', formData.jobTitle)
    form.append('website', formData.website)
    form.append('instagram', formData.instagram)
    form.append('linkedIn', formData.linkedIn)
    form.append('facebook', formData.facebook)
    form.append('bio', formData.bio)

    if (formData.profileImage) {
      form.append('profileImage', formData.profileImage)
    }

    await onSave(form)
  }


  return (
    <main className="page-shell">

      <header className="page-header">
        <div>
          <h1>
            {mode === 'edit'
              ? 'Edit customer'
              : 'Create customer'}
          </h1>

          <p>
            {mode === 'edit'
              ? 'Update customer details and save.'
              : 'Add a new customer.'}
          </p>
        </div>


        <button
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>

      </header>


      {isLoading ? (
        <p>Loading customer...</p>
      ) : (

        <form className="customer-form" onSubmit={handleSubmit}>

        {/* Profile + Personal */}
        <section className="card">
          <h2>Personal Information</h2>
      
          <div className="profile-section">
      
            <div className="image-upload">
              <div className="avatar-wrap">
                <div className="avatar">
                  {imagePreviewSrc ? (
                    <img
                      src={imagePreviewSrc}
                      alt="Profile preview"
                    />
                  ) : (
                    <span className="avatar-placeholder">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
                        <circle cx="12" cy="13" r="3.5" />
                      </svg>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="avatar-edit-btn"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload photo"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />

              <div className="image-upload-actions">
                <button
                  type="button"
                  className="text-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreviewSrc ? 'Change photo' : 'Upload photo'}
                </button>

                {imagePreviewSrc && (
                  <button
                    type="button"
                    className="text-button danger"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="image-upload-hint">JPG or PNG, up to 5MB</p>
            </div>
      
            <div className="grid">
      
              <div>
                <label>First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
      
              <div>
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
      
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
      
              <div>
                <label>Phone</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
      
              <div>
                <label>WhatsApp</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="whatsAppNumber"
                  value={formData.whatsAppNumber}
                  onChange={handleChange}
                />
              </div>
      
            </div>
      
          </div>
      
        </section>
      
        {/* Business */}
      
        <section className="card">
          <h2>Business Information</h2>
      
          <div className="grid">
            <div>
              <label>Company Name</label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Job Title</label>
              <input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Website</label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
      
          </div>
        </section>
      
        {/* Social */}
      
        <section className="card">
          <h2>Social Media</h2>
      
          <div className="grid">
            <div>
              <label>Instagram</label>
              <input
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>LinkedIn</label>
              <input
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Facebook</label>
              <input
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>
          </div>
      
        </section>
      
        {/* Bio */}
      
        <section className="card">
          <h2>About Customer</h2>
      
          <textarea
            rows={5}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </section>
      
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>
      
          <button
            type="submit"
            className="primary-button"
          >
            Save Customer
          </button>
        </div>
      
      </form>

      )}

    </main>
  )
}

export default CustomerFormPage