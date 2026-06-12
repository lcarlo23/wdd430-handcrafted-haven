import sql from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import DashboardClientForm from './dashboardClientForm';

import './dashboard.css';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your profile and products.',
};

interface Product {
  id: number;
  category_id: string | null;
  title: string;
  description: string;
  price: string;
  stock_quantity: number;
  image_url: string | null;
  is_organic: boolean;
  is_recycled: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Seller {
  id: string;
  name: string;
  bio: string;
  profile_image: string;
}

export default async function SellerDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get('seller_session');

  if (!session || !session.value) {
    redirect('/account');
  }

  const currentSellerId = session.value;

  const sellers = await sql<Seller[]>`
    SELECT id, name, bio, profile_image 
    FROM sellers 
    WHERE id = ${currentSellerId}::uuid
  `;

  const seller = sellers[0];
  if (!seller) {
    redirect('/account');
  }

  const products = await sql<Product[]>`
    SELECT id, category_id, title, description, price, stock_quantity, image_url, is_organic, is_recycled 
    FROM products 
    WHERE seller_id = ${currentSellerId}::uuid 
    ORDER BY created_at DESC
  `;

  const categories = await sql<Category[]>`SELECT id, name FROM categories ORDER BY name ASC`;

  return (
    <main className="dashboard-container">
      <h1 className="dashboard-title">Seller Dashboard</h1>

      <div className="dashboard-section">
        <h2>Your Profile</h2>
        <div className="dashboard-profile-card">
          {seller.profile_image ? (
            <Image
              src={seller.profile_image}
              alt={`${seller.name}'s avatar`}
              width={80}
              height={80}
              className="dashboard-avatar"
              loading="eager"
            />
          ) : (
            <div className="dashboard-avatar-fallback">No image</div>
          )}

          <div className="dashboard-profile-info">
            <strong>{seller.name}</strong>
            <p>{seller.bio || 'Hey, you have no store details or biography written yet!'}</p>
          </div>
        </div>
      </div>

      {products.length === 0 && (
        <div className="no-listings-notice">
          <strong>Notice: </strong>
          Hey, you have no active listings yet! Fill out the "Add New Product" form below to publish
          your first craft item.
        </div>
      )}

      <DashboardClientForm seller={seller} products={products} categories={categories} />
    </main>
  );
}
