import sql from '@/lib/db';
import ProductList from './ProductList';
import ProductFilters from './ProductFilters';

interface ProductGridProps {
  categoryId?: string;
  isOrganic?: boolean;
  isRecycled?: boolean;
  minPrice?: string;
  maxPrice?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image_url: string;
  is_organic: boolean;
  is_recycled: boolean;
}

export default async function ProductGrid({
  categoryId,
  isOrganic,
  isRecycled,
  minPrice,
  maxPrice,
}: ProductGridProps) {
  let initialProducts: Product[] = [];
  let categories: Category[] = [];

  try {
    categories = await sql`SELECT id, name FROM categories ORDER BY name ASC`;

    initialProducts = await sql`
      SELECT id, title, price, image_url, is_organic, is_recycled 
      FROM products 
      WHERE 1=1
      ${categoryId ? sql`AND category_id = ${categoryId}` : sql``}
      ${isOrganic ? sql`AND is_organic = true` : sql``}
      ${isRecycled ? sql`AND is_recycled = true` : sql``}
      ${minPrice ? sql`AND price >= ${minPrice}` : sql``}
      ${maxPrice ? sql`AND price <= ${maxPrice}` : sql``}
      ORDER BY created_at DESC
      LIMIT 9
    `;
  } catch (error) {
    console.error('Errore:', error);
  }

  const currentFilters = { categoryId, isOrganic, isRecycled, minPrice, maxPrice };
  const filtersKey = JSON.stringify(currentFilters);

  return (
    <section className="catalog-section">
      <div className="catalog-header">
        <h2 className="section-title">All Products</h2>

        <ProductFilters categories={categories as any} />
      </div>

      <ProductList
        key={filtersKey}
        initialProducts={initialProducts as any}
        filters={currentFilters}
      />
    </section>
  );
}
