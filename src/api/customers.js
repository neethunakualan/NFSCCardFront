const API_BASE_URL = import.meta.env.VITE_API_URL || ''

function authHeaders(includeJson = true) {
  const token = localStorage.getItem('accessToken')
  const headers = new Headers()

  if (token) {
    headers.append('Authorization', `Bearer ${token}`)
    console.debug('[API] Authorization header set:', `Bearer ${token}`)
  } else {
    console.debug('[API] No access token available for Authorization header')
  }

  if (includeJson) {
    headers.append('Content-Type', 'application/json')
  }

  return headers
}

async function handleResponse(response) {
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    console.error('[API] request failed', response.status, response.url, data)
    throw new Error(data?.message || response.statusText || 'API request failed')
  }
  return data
}

export async function fetchCustomers() {
  const response = await fetch(`${API_BASE_URL}/api/customers`, {
    method: 'GET',
    headers: authHeaders(false),
  })
  return handleResponse(response)
}

export async function fetchMyCustomer() {
  const response = await fetch(`${API_BASE_URL}/api/customers/me`, {
    method: 'GET',
    headers: authHeaders(false),
  })
  return handleResponse(response)
}

export async function fetchCustomerById(customerId) {
  const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}`, {
    method: 'GET',
    headers: authHeaders(false),
  })
  return handleResponse(response)
}

export async function createCustomer(customer) {
  const response = await fetch(`${API_BASE_URL}/api/customers`, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(customer),
  })
  return handleResponse(response)
}

export async function updateCustomer(customerId, customer) {
  const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}`, {
    method: 'PUT',
    headers: authHeaders(true),
    body: JSON.stringify(customer),
  })
  return handleResponse(response)
}
