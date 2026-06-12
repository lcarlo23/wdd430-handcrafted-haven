import { cookies } from 'next/headers';
import sql from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import AccountPageClient from './accountPageClient';
import './account.css';

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
        SELECT id, name, profile_image FROM sellers WHERE id = ${sessionToken}
      `;
      if (records.length > 0) {
        seller = records[0];
      }
    } catch (error) {
      console.error('Failed to retrieve authenticated seller account info:', error);
    }
  }

  if (seller) {
    return (
      <main
        className="auth-page-container dashboard-portal-container"
        style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}
      >
        <h2 className="auth-heading">Welcome Back</h2>

        <div
          className="profile-summary-card"
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          {seller.profile_image ? (
            <Image
              src={seller.profile_image}
              alt={`${seller.name}'s avatar`}
              width={120}
              height={120}
              loading="eager"
            />
          ) : (
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#eee',
                margin: '0 auto 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              No Image
            </div>
          )}
          <h3>{seller.name}</h3>
        </div>

        <div
          className="portal-actions"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <Link
            href="/dashboard"
            className="auth-submit-btn"
            style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}
          >
            Go to Seller Dashboard
          </Link>

          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <form action="/app/account/actions/logout" method="POST">
              <button
                formAction={async () => {
                  'use server';
                  const cookiesToClear = await cookies();
                  cookiesToClear.delete('seller_session');
                  const { redirect } = await import('next/navigation');
                  redirect('/account');
                }}
                type="submit"
                className="auth-submit-btn context-secondary"
                style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
              >
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
