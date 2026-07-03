import { useState, useEffect } from 'react'

function CustomerFormPage({ mode, customer, isLoading, error, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    jobTitle: '',
    website: '',
    bio: '',
  })

  useEffect(() => {
    if (mode === 'edit' && customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phoneNumber: customer.phoneNumber || '',
        companyName: customer.companyName || '',
        jobTitle: customer.jobTitle || '',
        website: customer.website || '',
        bio: customer.bio || '',
      })
    }
  }, [mode, customer])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSave({ ...customer, ...formData })
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <h1>{mode === 'edit' ? 'Edit customer' : 'Create customer'}</h1>
          <p>{mode === 'edit' ? 'Update the customer details and save.' : 'Add a new customer to the list.'}</p>
        </div>
        <button className="secondary-button" onClick={onCancel}>Cancel</button>
      </header>

      {isLoading ? (
        <p>Loading customer...</p>
      ) : (
        <form className="item-form" onSubmit={handleSubmit}>
          {error ? <p className="message error">{error}</p> : null}

          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="First name"
          />

          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Last name"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />

          <label htmlFor="phoneNumber">Phone number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone number"
          />

          <label htmlFor="companyName">Company</label>
          <input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company name"
          />

          <label htmlFor="jobTitle">Job title</label>
          <input
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Job title"
          />

          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website"
          />

          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Bio"
          />

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>
            <button className="primary-button" type="submit">Save</button>
          </div>
        </form>
      )}
    </main>
  )
}

export default CustomerFormPage
