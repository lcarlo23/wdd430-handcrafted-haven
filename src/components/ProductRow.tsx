import sql from '@/lib/db';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  title: string;
  price: string;
}

interface ProductRowProps {
  rowId: string; // category_id to fetch products for this row
  sectionTitle: string; // Title to display above the product grid
  gridClass: string; // CSS class to control grid layout
}

export default async function ProductRow({
  rowId,
  sectionTitle,
  gridClass,
}: ProductRowProps) {
  let products: Product[] = [];

  try {
    // Uses the global, optimized connection pool found in lib/db.ts to fetch products for the given category_id (rowId)
    products = await sql<Product[]>`
      SELECT id, title, price 
      FROM products 
      WHERE category_id = ${rowId}
      ORDER BY id ASC
    `;
  } catch (error) {
    console.error(
      `Database query failure for row allocation [${rowId}]:`,
      error,
    );
  }

  return (
    <section className={`product-section ${rowId}-section`}>
      <h2 className='section-title'>{sectionTitle}</h2>
      <div className={`product-grid ${gridClass}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
