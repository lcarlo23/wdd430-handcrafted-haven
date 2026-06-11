'use client';

import { useRef } from 'react';
import { registerUser } from '@/app/account/actions';
import { ToastContainer, toast } from 'react-toastify';

export default function RegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const clientAction = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const clearPasswords = () => {
      if (formRef.current) {
        const passInput = formRef.current.querySelector('#reg-password') as HTMLInputElement;
        const confirmPassInput = formRef.current.querySelector(
          '#reg-confirmpassword'
        ) as HTMLInputElement;
        if (passInput) passInput.value = '';
        if (confirmPassInput) confirmPassInput.value = '';
      }
    };

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      clearPasswords();
      return;
    }

    const result = await registerUser(formData);

    if (!result?.success) {
      toast.error(result?.error || 'An unknown error occurred.');
      clearPasswords();
    } else {
      toast.success('Account created successfully!');
      formRef.current?.reset();
    }
  };

  return (
    <>
      <div className="register-form-container">
        <h2 className="auth-heading">Create Account</h2>

        <form
          ref={formRef}
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            clientAction(new FormData(e.currentTarget));
          }}
        >
          <p className="required-fields-note">Fields marked with an asterisk are required</p>

          <div className="form-group">
            <label htmlFor="reg-name">
              Full Name / Business Name <span aria-label="required">*</span>
            </label>
            <input id="reg-name" name="name" type="text" className="auth-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">
              Email Address <span aria-label="required">*</span>
            </label>
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
            <label htmlFor="reg-password">
              Password <span aria-label="required">*</span>
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className="auth-input"
              required
              minLength={8}
              pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}"
              title="Password must be at least 8 characters long and contain both letters and numbers."
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirmpassword">
              Confirm Password <span aria-label="required">*</span>
            </label>
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
