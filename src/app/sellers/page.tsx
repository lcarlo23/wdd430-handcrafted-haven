import { Metadata } from 'next';
import SellersList from '@/components/SellersList';
import './sellers.css';

export const metadata: Metadata = {
  title: 'Sellers',
  description: 'Discover all the artisans',
};

export default function SellersPage() {
  return (
    <main className="sellers-page">
      <h1>Our Sellers</h1>
      <p>Discover all the artisans and creators available on our platform.</p>
      <SellersList />
    </main>
  );
}
