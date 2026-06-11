import styles from './page.module.css';
import ProductRow from '@/components/ProductRow';
import FeaturedHandcrafter from '@/components/FeaturedHandcrafter';
import ProductGrid from '@/components/ProductGrid';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const isOrganic = resolvedParams?.organic === 'true';
  const isRecycled = resolvedParams?.recycled === 'true';
  const categoryId =
    typeof resolvedParams?.category === 'string' ? resolvedParams.category : undefined;
  const minPrice =
    typeof resolvedParams?.minPrice === 'string' ? resolvedParams.minPrice : undefined;
  const maxPrice =
    typeof resolvedParams?.maxPrice === 'string' ? resolvedParams.maxPrice : undefined;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ProductRow
          rowId="77777777-7777-7777-7777-777777777777"
          sectionTitle="Top Deals"
          gridClass="product-grid"
        />
        <FeaturedHandcrafter />
        <ProductGrid
          categoryId={categoryId}
          isOrganic={isOrganic}
          isRecycled={isRecycled}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </main>
    </div>
  );
}
