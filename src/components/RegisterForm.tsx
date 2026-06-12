'use client';

import { useRef, useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerUser } from '@/app/account/actions';
import { ToastContainer, toast } from 'react-toastify';
import { compressImageToLimit } from '@/lib/compressor';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="auth-submit-btn" disabled={pending}>
      {pending ? 'Creating Account...' : 'Register Account'}
    </button>
  );
}

const initialState = { success: false, error: '' };

export default function RegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(registerUser, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleClientAction = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      if (formRef.current) {
        (formRef.current.querySelector('#reg-password') as HTMLInputElement).value = '';
        (formRef.current.querySelector('#reg-confirmpassword') as HTMLInputElement).value = '';
      }
      return;
    }

    const imageFile = formData.get('profileImage') as File;
    if (imageFile && imageFile.size > 0) {
      try {
        const optimizedFile = await compressImageToLimit(imageFile, 1048576);
        formData.set('profileImage', optimizedFile);
      } catch (err) {
        console.error('Client compression operation aborted:', err);
      }
    }

    formAction(formData);
  };

  return (
    <>
      <div className="register-form-container">
        <h2 className="auth-heading">Create an Account</h2>

        <form ref={formRef} action={handleClientAction} className="auth-form">
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
            <label htmlFor="reg-bio">Short Bio / Description</label>
            <textarea id="reg-bio" name="bio" className="auth-input" rows={3}></textarea>
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

          <SubmitButton />
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={4000} />
    </>
  );
}
