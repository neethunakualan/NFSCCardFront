// Central place for authentication-related API calls.
// Keep the UI components focused on rendering and user interaction.

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function loginUser(credentials) {
  console.debug('[API] loginUser called with email:', credentials.email)
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Invalid email or password');
  }

  return data;
}
