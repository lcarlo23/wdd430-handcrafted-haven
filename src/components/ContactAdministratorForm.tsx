// Got some help from here:  https://youtu.be/VLvecZISYqw?si=UVzt6GE83rA8lNPL, a Bing search for "pop-up submission success message for form submission react next.js" and https://unwiredlearning.com/blog/react-accessible-forms"

'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function ContactAdministratorForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    message: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleBlur = (e: any) => {
    if (e === '') {
      setError('Please complete this field');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const firstName = formData.firstName;
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(
        `Your message has been received, ${firstName}! Thanks for contacting Handcrafted Haven!`
      );
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        tel: '',
        message: '',
      });
    } catch {
      toast.error('Something went wrong!');
    }
  };

  return (
    <>
      <p>Fields marked with an asterisk are required</p>
      <form className="contact-administrator-form" onSubmit={handleSubmit}>
        <label htmlFor="firstName">
          First Name <span aria-label="required">*</span>
        </label>
        <input
          type="text"
          name="firstName"
          autoComplete="given-name"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error' : undefined}
          title="Please enter your first name"
          placeholder="First Name"
          required
        />
        <label htmlFor="lastName">
          Last Name <span aria-label="required">*</span>
        </label>
        <input
          type="text"
          name="lastName"
          autoComplete="family-name"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error' : undefined}
          title="Please enter your last name"
          placeholder="Last Name"
          required
        />

        <label htmlFor="email">
          E-mail Address <span aria-label="required">*</span>
        </label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error' : undefined}
          title="Please enter your e-mail address"
          placeholder="E-mail address"
          required
        />
        <label htmlFor="tel">Telephone Number</label>
        <input
          type="tel"
          name="tel"
          autoComplete="tel"
          value={formData.tel}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error' : undefined}
          title="Please enter your phone number"
          placeholder="Telephone number"
        />
        <label htmlFor="message">
          Message <span aria-label="required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error' : undefined}
          placeholder="Type message here..."
          rows={3}
          required
        ></textarea>
        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={4000} />
    </>
  );
}
