import { cookies } from 'next/headers';
import sql from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import AccountPageClient from './accountPageClient';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import './account.css';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Log in or manage your account.',
};

interface SellerProfile {
  id: string;
  name: string;
  profile_image: string | null;
}

export default async function AccountPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('seller_session')?.value;

  let seller: SellerProfile | null = null;

  if (sessionToken) {
    try {
      const records = await sql<SellerProfile[]>`
        SELECT id, name, profile_image FROM sellers WHERE id = ${sessionToken}::uuid
      `;
      if (records.length > 0) {
        seller = records[0];
      }
    } catch (error) {
      console.error('Failed to retrieve authenticated seller account info:', error);
    }
  }

  const handleLogout = async () => {
    'use server';
    const cookieStore = await cookies();
    cookieStore.delete('seller_session');
    redirect('/account');
  };

  if (seller) {
    return (
      <main className="auth-page-container dashboard-portal-container">
        <h2 className="auth-heading">Welcome Back</h2>

        <div className="profile-summary-card">
          {seller.profile_image ? (
            <Image
              src={seller.profile_image}
              alt={seller.name}
              width={100}
              height={100}
              className="portal-avatar"
            />
          ) : (
            <div className="portal-avatar-fallback">No Image</div>
          )}
          <h3>{seller.name}</h3>
        </div>

        <div className="portal-actions">
          <Link href="/dashboard" className="auth-submit-btn portal-link-btn">
            Go to Seller Dashboard
          </Link>

          <Link href={`/seller/${seller.id}`} className="auth-submit-btn">
            View Public Profile
          </Link>

          <div className="logout-section">
            <form action={handleLogout}>
              <button type="submit" className="auth-submit-btn context-secondary">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return <AccountPageClient />;
}
