'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginUser } from '@/app/account/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="auth-submit-btn" disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  );
}

const initialState = { success: false, error: '' };

export default function LoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState);

  return (
    <div className="login-form-container">
      <h2 className="auth-heading">Login</h2>

      {state?.error && (
        <p className="auth-error-message" style={{ color: '#d9534f' }}>
          {state.error}
        </p>
      )}

      <form action={formAction} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <input id="login-email" name="email" type="email" className="auth-input" required />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            className="auth-input"
            required
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
