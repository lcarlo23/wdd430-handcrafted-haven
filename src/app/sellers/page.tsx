import SellersList from '@/components/SellersList';
import './sellers.css';

export default function SellersPage() {
  return (
    <div className="sellers-page">
      <h1>Our Sellers</h1>
      <p>Discover all the artisans and creators available on our platform.</p>
      <SellersList />
    </div>
  );
}
