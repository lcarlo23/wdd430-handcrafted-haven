import sql from '@/lib/db';
import Image from 'next/image';

export default async function FeaturedHandcrafter({ sellerId }: { sellerId: string }) {
  let artisan = null;

  try {
    const result = await sql`
      SELECT name, bio, profile_image 
      FROM sellers 
      WHERE id = ${sellerId}
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
        </div>
      </div>
    </section>
  );
}
