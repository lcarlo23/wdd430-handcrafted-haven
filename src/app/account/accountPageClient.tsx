'use client';

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

// different view for logged in users vs non-logged in users, this component is for non-logged in users
export default function AccountPageClient() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <main className="auth-page-container">
      <div className="auth-toggle-buttons">
        <button
          className={`toggle-btn ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => setAuthMode('login')}
        >
          Sign In
        </button>
        <button
          className={`toggle-btn ${authMode === 'register' ? 'active' : ''}`}
          onClick={() => setAuthMode('register')}
        >
          Register
        </button>
      </div>

      <div className="auth-form-wrapper">
        {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </main>
  );
}
