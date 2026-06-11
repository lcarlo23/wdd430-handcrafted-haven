'use client';

import { useRef } from 'react';
import { registerUser } from '@/app/account/actions';
import { ToastContainer, toast } from 'react-toastify';

export default function RegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const clientAction = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        'Password must be at least 8 characters long and contain both letters and numbers.'
      );
      return;
    }

    const result = await registerUser(formData);

    if (!result?.success) {
      toast.error(result?.error || 'An unknown error occurred.');
    } else {
      toast.success('Account created successfully!');
      formRef.current?.reset();
    }
  };

  return (
    <>
      <div className="register-form-container">
        <h2 className="auth-heading">Create Account</h2>

        <form action={clientAction} ref={formRef} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name / Business Name</label>
            <input id="reg-name" name="name" type="text" className="auth-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input id="reg-email" name="email" type="email" className="auth-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="reg-bio">Short Bio</label>
            <textarea id="reg-bio" name="bio" className="auth-input" rows={3} />
          </div>

          <div className="form-group">
            <label htmlFor="reg-image">Profile Picture</label>
            <input
              id="reg-image"
              name="profileImage"
              type="file"
              className="auth-input"
              accept="image/*"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className="auth-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirmpassword">Confirm Password</label>
            <input
              id="reg-confirmpassword"
              name="confirmPassword"
              type="password"
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Register Account
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={4000} />
    </>
  );
}
