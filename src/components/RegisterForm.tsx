'use client';

import { useState, FormEvent } from 'react';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Password confirmation check
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Standard security validation (Minimum 8 characters, at least 1 letter and 1 number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    // Payload structure for backend submission
    console.log('Registration payload:', {
      firstName,
      lastName,
      accountName,
      email,
      password,
    });
  };

  return (
    <div className="register-form-container">
      <h2 className="auth-heading">Create Account</h2>
      {error && <p className="auth-error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="reg-firstname">First Name</label>
          <input
            id="reg-firstname"
            type="text"
            className="auth-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-lastname">Last Name</label>
          <input
            id="reg-lastname"
            type="text"
            className="auth-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-accountname">Username</label>
          <input
            id="reg-accountname"
            type="text"
            className="auth-input"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirmpassword">Confirm Password</label>
          <input
            id="reg-confirmpassword"
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-submit-btn">
          Register Account
        </button>
      </form>
    </div>
  );
}
