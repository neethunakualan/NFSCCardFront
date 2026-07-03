import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import LoginForm from './LoginForm';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await loginUser(formData);

      const profile = {
        userId: data.userId,
        role: data.role,
      };

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userProfile', JSON.stringify(profile));

      setMessage({ type: 'success', text: 'Login successful. Redirecting to home page...' });
      setFormData({ email: '', password: '' });
      onLogin(profile);
      navigate('/');
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Unable to sign in right now.';

      setMessage({
        type: 'error',
        text: detail.includes('Failed to fetch')
          ? 'Unable to reach the API. Make sure the backend is running.'
          : detail,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-block">
          <p className="eyebrow">NFSCCard</p>
          <h1>Welcome back</h1>
          <p>Sign in to access your NFSCCard account.</p>
        </div>

        <LoginForm
          formData={formData}
          isLoading={isLoading}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {message.text ? <p className={`message ${message.type}`}>{message.text}</p> : null}

        <p className="helper-text">
          This form calls the backend authentication endpoint from your NFSCCard API.
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
