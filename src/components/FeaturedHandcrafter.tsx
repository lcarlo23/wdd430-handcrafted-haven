import sql from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

export default async function FeaturedHandcrafter() {
  let artisan = null;

  try {
    const result = await sql`
      SELECT id, name, bio, profile_image 
      FROM sellers 
      ORDER BY md5(id::text || CURRENT_DATE::text)
      LIMIT 1
    `;

    if (result.length > 0) {
      artisan = result[0];
    }
  } catch (error) {
    console.error('Error on retrieving database data:', error);
  }

  if (!artisan) return null;

  return (
    <section className="featured-section">
      <h2 className="section-title">Featured Handcrafter</h2>

      <div className="handcrafter-card">
        <div className="handcrafter-image-box">
          <Image
            src={artisan.profile_image || '/placeholder.jpg'}
            alt={artisan.name}
            width={600}
            height={450}
          />
        </div>

        <div className="handcrafter-info">
          <h3>Meet {artisan.name}</h3>
          <p>{artisan.bio}</p>
          <Link href={`/seller/${artisan.id}`} className="btn-load-more">
            Read their Story
          </Link>
        </div>
      </div>
    </section>
  );
}
