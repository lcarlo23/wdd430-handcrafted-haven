import NavLinks from '@/components/navlinks';

export default function Footer() {
  const current_year = new Date().getFullYear();
  return (
    <div className="footer">
      <div className="footer-navlinks-container">
        <NavLinks />
      </div>
      <p className="footer-copyright-text">&copy; {current_year}, Team01-WDD430 (Block 3, 2026) </p>
    </div>
  );
}
