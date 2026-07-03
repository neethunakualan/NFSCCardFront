// Reusable form component for the sign-in experience.
// It receives its state and handlers from the parent page component.

function LoginForm({ formData, isLoading, onChange, onSubmit }) {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label htmlFor="email">Email address</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={formData.email}
        onChange={onChange}
        placeholder="you@example.com"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={formData.password}
        onChange={onChange}
        placeholder="Enter your password"
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

export default LoginForm;
