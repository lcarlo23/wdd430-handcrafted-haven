import { Metadata } from 'next';
import ContactAdministratorForm from '@/components/ContactAdministratorForm';
import './contact.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact us for any information',
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <h1>We love to hear from you!</h1>
      <p>Please complete and submit the form below to contact Handcrafted Haven.</p>
      <ContactAdministratorForm />
    </main>
  );
}
