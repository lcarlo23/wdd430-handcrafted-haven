import sql from '@/lib/db';
import SellerCard from './SellerCard';

interface Seller {
  id: string;
  name: string;
  profile_image: string;
}

export default async function SellerList() {
  let sellers: Seller[] = [];

  try {
    sellers = await sql<Seller[]>`
      SELECT id, name, profile_image
      FROM sellers
      ORDER BY name ASC
    `;
  } catch (error) {
    console.error('Error recovering sellers:', error);
  }

  return (
    <section className="seller-section">
      <h2 className="section-title">All Sellers</h2>

      <div className="seller-grid">
        {sellers.map((seller) => (
          <SellerCard key={seller.id} seller={seller} />
        ))}
      </div>
    </section>
  );
}
