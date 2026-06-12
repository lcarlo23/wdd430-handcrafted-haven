import sql from '@/lib/db';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  title: string;
  price: string;
  image_url: string;
}

interface ProductRowProps {
  rowId: string;
  sectionTitle: string;
  gridClass: string;
}

export default async function ProductRow({ rowId, sectionTitle, gridClass }: ProductRowProps) {
  let products: Product[] = [];

  try {
    products = await sql<Product[]>`
      SELECT p.id, p.title, p.price, p.image_url
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, p.title, p.price, p.image_url
      ORDER BY AVG(r.rating) DESC NULLS LAST
      LIMIT 4
    `;
  } catch (error) {
    console.error(`Database query failure for row allocation [${rowId}]:`, error);
  }

  return (
    <section className={`product-section ${rowId}-section`}>
      <h2 className="section-title">{sectionTitle}</h2>
      <div className={`product-grid ${gridClass}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
