import sql from '@/lib/db';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import './seller.css';

interface Seller {
  id: string;
  name: string;
  email: string;
  bio: string;
  profile_image: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image_url: string;
  is_organic: boolean;
  is_recycled: boolean;
}

export default async function SellerPage(props: { params: Promise<{ sellerId: string }> }) {
  const params = await props.params;
  const sellerId = params.sellerId;

  let sellers: Seller[] = [];
  let products: Product[] = [];

  try {
    sellers = await sql<Seller[]>`
      SELECT id, name, email, bio, profile_image 
      FROM sellers 
      WHERE id = ${sellerId}::uuid
    `;

    products = await sql<Product[]>`
      SELECT id, title, price, image_url, is_organic, is_recycled 
      FROM products 
      WHERE seller_id = ${sellerId}::uuid 
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error('Database Error:', error);
  }

  const seller = sellers[0];

  if (!seller) {
    notFound();
  }

  return (
    <main className="seller-page-wrapper">
      {/* SELLER PROFILE SECTION */}
      <section className="seller-profile-card">
        <Image
          src={seller.profile_image || '/placeholder.jpg'}
          alt={`Profile image of ${seller.name}`}
          width={400}
          height={400}
          className="seller-avatar"
          loading="eager"
        />

        <div className="seller-info">
          <h1>{seller.name}</h1>
          <p className="seller-bio">{seller.bio || "This seller hasn't added a biography yet."}</p>

          <a href={`mailto:${seller.email}`} className="btn-contact-seller">
            ✉️ Contact Seller
          </a>
        </div>
      </section>

      {/* 2. SELLER PRODUCTS SECTION */}
      <section className="seller-products-section">
        <h2>Products by {seller.name}</h2>

        {products.length > 0 ? (
          <div className="main-product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="no-products-msg">This seller has no active products at the moment.</p>
        )}
      </section>
    </main>
  );
}
