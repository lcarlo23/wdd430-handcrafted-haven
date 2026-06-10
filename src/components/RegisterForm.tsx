"use client";

import { useState, FormEvent, useRef } from "react";
import { registerUser } from "@/app/account/actions";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // password confirmation check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // security validation (Minimum 8 characters, at least 1 letter and 1 number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }

    // bind form data into a FormData object for server action processing
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    // dispatch the registration action to the server and await the result
    const result = await registerUser(formData);

    if (!result.success) {
      setError(result.error || "An unknown error occurred.");
    } else {
      // alert success
      setSuccess(true);
      
      // clear form fields after successful registration
      setFirstName("");
      setLastName("");
      setAccountName("");
      setEmail("");
      setBio("");
      setPassword("");
      setConfirmPassword("");
      setProfileImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="register-form-container">
      <h2 className="auth-heading">Create Account</h2>
      
      {/* Dynamic Status Notifications */}
      {error && <p className="auth-error-message" style={{ color: "red" }}>{error}</p>}
      {success && <p className="auth-success-message" style={{ color: "green" }}>Account created successfully!</p>}

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
          <label htmlFor="reg-bio">Short Bio</label>
          <textarea
            id="reg-bio"
            className="auth-input"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-image">Profile Picture</label>
          <input
            id="reg-image"
            type="file"
            ref={fileInputRef}
            className="auth-input"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setProfileImage(e.target.files[0]);
              }
            }}
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