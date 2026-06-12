'use client';

import { useState, FormEvent } from 'react';
import { loginUser } from '@/app/account/actions';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // bind form data into a FormData object for server action processing
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // dispatch the login action to the server and await the result
    const result = await loginUser(null, formData);

    if (!result.success) {
      setError(result.error || 'An unknown error occurred.');
    } else {
      // alert success
      setSuccess(true);

      // clear form fields after successful login
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="auth-heading">Login</h2>

      {error && (
        <p className="auth-error-message" style={{ color: 'red' }}>
          {error}
        </p>
      )}
      {success && (
        <p className="auth-success-message" style={{ color: 'green' }}>
          Logged in successfully!
        </p>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-submit-btn">
          Sign In
        </button>
      </form>
    </div>
  );
}
