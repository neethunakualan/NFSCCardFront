import { useState, useEffect } from 'react'

function CustomerFormPage({
  mode,
  customer,
  isLoading,
  error,
  onSave,
  onCancel,
}) {
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
    }
  }, [mode, customer])


  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleImageChange = (event) => {
    const file = event.target.files[0]

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }))
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

        <form
          className="item-form"
          onSubmit={handleSubmit}
        >

          {error ? (
            <p className="message error">
              {error}
            </p>
          ) : null}



          <label htmlFor="firstName">
            First Name
          </label>

          <input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="First name"
          />



          <label htmlFor="lastName">
            Last Name
          </label>

          <input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Last name"
          />



          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />



          <label htmlFor="phoneNumber">
            Phone Number
          </label>

          <input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone number"
          />



          <label htmlFor="whatsAppNumber">
            WhatsApp Number
          </label>

          <input
            id="whatsAppNumber"
            name="whatsAppNumber"
            value={formData.whatsAppNumber}
            onChange={handleChange}
            placeholder="WhatsApp number"
          />



          <label htmlFor="companyName">
            Company Name
          </label>

          <input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company name"
          />



          <label htmlFor="jobTitle">
            Job Title
          </label>

          <input
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Job title"
          />



          <label htmlFor="website">
            Website
          </label>

          <input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website"
          />



          <label htmlFor="instagram">
            Instagram
          </label>

          <input
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="Instagram"
          />



          <label htmlFor="linkedIn">
            LinkedIn
          </label>

          <input
            id="linkedIn"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            placeholder="LinkedIn"
          />



          <label htmlFor="facebook">
            Facebook
          </label>

          <input
            id="facebook"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="Facebook"
          />



          <label htmlFor="profileImage">
            Profile Image
          </label>

          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
          />



          <label htmlFor="bio">
            Bio
          </label>

          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
          />



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
              Save
            </button>

          </div>


        </form>

      )}

    </main>
  )
}

export default CustomerFormPage