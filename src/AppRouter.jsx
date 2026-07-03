import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'
import CustomerListPage from './components/CustomerListPage'
import CustomerDetailPage from './components/CustomerDetailPage'
import CustomerFormPage from './components/CustomerFormPage'
import { fetchCustomers, fetchCustomerById, fetchMyCustomer, createCustomer, updateCustomer } from './api/customers'

function CustomerListRoute({ isAdmin }) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function loadCustomers() {
      try {
        const data = isAdmin ? await fetchCustomers() : await fetchMyCustomer()
        if (active) {
          setCustomers(Array.isArray(data) ? data : data ? [data] : [])
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load customers')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCustomers()
    return () => {
      active = false
    }
  }, [isAdmin])

  return (
    <CustomerListPage
      customers={customers}
      isLoading={loading}
      error={error}
      onViewDetail={(customer) => navigate(`/customers/${customer.customerId}`)}
      onEdit={(customer) => navigate(`/customers/${customer.customerId}/edit`)}
      onCreate={() => navigate('/customers/create')}
      onBack={() => navigate('/')}
    />
  )
}

function CustomerDetailRoute() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function loadCustomer() {
      try {
        const data = await fetchCustomerById(Number(id))
        if (active) setCustomer(data)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load customer')
      } finally {
        if (active) setLoading(false)
      }
    }

    if (id) loadCustomer()
    return () => {
      active = false
    }
  }, [id])

  return (
    <CustomerDetailPage
      customer={customer}
      isLoading={loading}
      error={error}
      onEdit={() => navigate(`/customers/${id}/edit`)}
      onBack={() => navigate('/customers')}
    />
  )
}

function CustomerCreateRoute() {
  const navigate = useNavigate()

  const handleCreate = async (customer) => {
    await createCustomer(customer)
    navigate('/customers')
  }

  return <CustomerFormPage mode="create" onSave={handleCreate} onCancel={() => navigate('/customers')} />
}

function CustomerEditRoute() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function loadCustomer() {
      try {
        const data = await fetchCustomerById(Number(id))
        if (active) setCustomer(data)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load customer')
      } finally {
        if (active) setLoading(false)
      }
    }

    if (id) loadCustomer()
    return () => {
      active = false
    }
  }, [id])

  const handleUpdate = async (customer) => {
    await updateCustomer(Number(id), customer)
    navigate('/customers')
  }

  return (
    <CustomerFormPage
      mode="edit"
      customer={customer}
      isLoading={loading}
      error={error}
      onSave={handleUpdate}
      onCancel={() => navigate('/customers')}
    />
  )
}

function AppRouter() {
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    const storedProfile = localStorage.getItem('userProfile')

    if (storedToken && storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    }
  }, [])

  const handleLogin = (profile) => {
    setUserProfile(profile)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userProfile')
    setUserProfile(null)
  }

  const isAdmin = userProfile?.role === 'Admin'

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            userProfile ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="/"
          element={
            userProfile ? <HomePage user={userProfile} isAdmin={isAdmin} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/customers"
          element={userProfile ? <CustomerListRoute isAdmin={userProfile.role === 'Admin'} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/customers/create"
          element={userProfile?.role === 'Admin' ? <CustomerCreateRoute /> : <Navigate to="/customers" replace />}
        />
        <Route
          path="/customers/:id"
          element={userProfile ? <CustomerDetailRoute /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/customers/:id/edit"
          element={userProfile ? <CustomerEditRoute /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={userProfile ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
