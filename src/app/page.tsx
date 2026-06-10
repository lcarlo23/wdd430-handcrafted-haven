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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ProductRow
          rowId="77777777-7777-7777-7777-777777777777"
          sectionTitle="Top Deals"
          gridClass="product-grid"
        />
        <FeaturedHandcrafter sellerId="33333333-3333-3333-3333-333333333333" />
        <ProductGrid categoryId={categoryId} isOrganic={isOrganic} isRecycled={isRecycled} />
      </main>
    </div>
  );
}
