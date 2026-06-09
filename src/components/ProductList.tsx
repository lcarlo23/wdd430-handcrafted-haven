'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { loadMoreProducts } from '@/lib/actions';

interface Product {
  id: number;
  title: string;
  price: string;
  image_url: string;
  is_organic: boolean;
  is_recycled: boolean;
}

interface FilterProps {
  categoryId?: string;
  isOrganic?: boolean;
  isRecycled?: boolean;
}

export default function ProductList({
  initialProducts,
  filters,
}: {
  initialProducts: Product[];
  filters: FilterProps;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [offset, setOffset] = useState(9);
  const [hasMore, setHasMore] = useState(initialProducts.length === 9);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);

    const nextProducts = await loadMoreProducts(
      filters.categoryId,
      filters.isOrganic,
      filters.isRecycled,
      offset
    );

    setProducts((prev) => [...prev, ...(nextProducts as Product[])]);

    setOffset((prev) => prev + 9);

    if (nextProducts.length < 9) {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  if (products.length === 0) {
    return (
      <div className="no-results">
        <p>No products match your selected filters.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="main-product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} disabled={isLoading} className="btn-load-more">
            {isLoading ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </div>
  );
}
