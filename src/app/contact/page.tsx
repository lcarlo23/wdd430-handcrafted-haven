import ContactAdministratorForm from '@/components/ContactAdministratorForm';
import './contact.css';

export default function ContactPage() {
  return (
    <div className="contact-page">
      <h1>We love to hear from you!</h1>
      <p>Please complete and submit the form below to contact Handcrafted Haven.</p>
      <ContactAdministratorForm />
    </div>
  );
}
