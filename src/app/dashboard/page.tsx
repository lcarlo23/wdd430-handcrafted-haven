import sql from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import DashboardClientForm from './dashboardClientForm';

import './dashboard.css';

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

  const sellers = await sql<
    Seller[]
  >`SELECT id, name, bio, profile_image FROM sellers WHERE id = ${currentSellerId}`;

  const seller = sellers[0];

  const products = await sql<
    Product[]
  >`SELECT id, category_id, title, description, price, stock_quantity, image_url, is_organic, is_recycled FROM products WHERE seller_id = ${currentSellerId} ORDER BY id ASC`;

  const categories = await sql<Category[]>`SELECT id, name FROM categories`;

  if (!seller) {
    redirect('/account');
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Seller Dashboard</h1>

      {/* Profile Modification Block */}

      <div
        className="profile-status-bar"
        style={{
          padding: '20px',
          background: '#f5f5f5',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <h3>Current Storefront Profile</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
          {seller.profile_image ? (
            <Image
              src={seller.profile_image}
              alt={`${seller.name}'s avatar`}
              width={80}
              height={80}
              loading="eager"
            />
          ) : (
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#666',
              }}
            >
              No image uploaded
            </div>
          )}

          <div>
            <strong>{seller.name}</strong>

            <p style={{ margin: '5px 0 0 0', color: '#555' }}>
              {seller.bio || 'Hey, you have no store details or biography written yet!'}
            </p>
          </div>
        </div>
      </div>

      {products.length === 0 && (
        <div
          className="no-listings-notice"
          style={{
            padding: '20px',
            border: '2px dashed #ffa500',
            background: '#fff9e6',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#8a6d3b',
          }}
        >
          <strong>Notice:</strong>
          {`Hey, you have no active listings yet! Fill out the "Add New Product" form below to publish your first craft item.`}
        </div>
      )}

      <DashboardClientForm seller={seller} products={products} categories={categories} />
    </div>
  );
}
