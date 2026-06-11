import {
  fetchProduct,
  fetchSellerbySellerId,
  fetchReviews,
  calulateReviewCountbyProductId,
  calulateAverageProductRating,
} from '@/lib/actions';
import StarRating from '@/components/StarRating';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductReviewForm from '@/components/ProductReviewForm';
import ProductReviewsTable from '@/components/ProductReviewsTable';
import Link from 'next/link';
import './product.css';

export async function generateMetadata(props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  const productId = params.productId;

  try {
    const product = await fetchProduct(productId);

    if (!product) {
      return { title: 'Product Not Found' };
    }

    return {
      title: product.title,
      description: product.description || `Buy ${product.title} handcrafted just for you.`,
    };
  } catch (error) {
    return { title: 'Product Detail' };
  }
}

export default async function ProductPage(props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  const id = params.productId;
  const [product, reviews, averageRating, numberofReviews] = await Promise.all([
    fetchProduct(id),
    fetchReviews(Number(id)),
    calulateAverageProductRating(Number(id)),
    calulateReviewCountbyProductId(Number(id)),
  ]);
  const sellerId = product.seller_id;
  const [seller] = await Promise.all([fetchSellerbySellerId(sellerId)]);
  const altText = `Image of ${product.title} product`;
  const priceText = `$${product.price}`;
  let numberofReviewsText = '';
  if (numberofReviews === 1) {
    numberofReviewsText = `(${numberofReviews} review)`;
  } else {
    numberofReviewsText = `(${numberofReviews} reviews)`;
  }
  const checkSymbol = '✔'; // source of symbol:  https://symbolsdb.com/check-mark-symbol
  const noSymbol = '✖'; // source of symbol:  https://symbolsdb.com/check-mark-symbol
  let isOrganicText = '';
  if (product.is_organic) {
    isOrganicText = `${checkSymbol} Verified Organic`;
  } else {
    isOrganicText = `${noSymbol} Verified Organic`;
  }
  let isRecycledText = '';
  if (product.is_recycled) {
    isRecycledText = `${checkSymbol} Verified Recycled`;
  } else {
    isRecycledText = `${noSymbol} Verified Recycled`;
  }

  if (!product) {
    notFound();
  }

  return (
    <main>
      <div className="product-page">
        <h1>{product.title}</h1>
        <Image
          src={product.image_url ? product.image_url : '/product-placeholder.jpg'}
          alt={altText}
          width={100}
          height={100}
          loading="eager"
        />
        <p className="product-price">{priceText}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-isOrganic">{isOrganicText}</p>
        <p className="product-isRecycled">{isRecycledText}</p>
        <div>
          <StarRating rating={averageRating} />
          <span className="number-of-reviews">{numberofReviewsText}</span>
        </div>
        <p className="product-seller-name">
          Sold by:
          <Link href={`/seller/${product.seller_id}`} className="product-page-seller-link">
            {' '}
            {seller.name}
          </Link>
        </p>
        <div className="product-purchase-section">
          <p className="product-purchase-question">Love this item? Want to make it yours?</p>
          <a
            href={`mailto:${seller.email}?subject=Interested in purchasing: ${product.title}`}
            className="btn-buy-now"
          >
            ✉️ Email Seller to Buy
          </a>
        </div>

        <div className="product-reviews-section">
          <h2>Customer Reviews</h2>
          <ProductReviewsTable reviews={reviews} />
          <h2>Review this Product</h2>
          <ProductReviewForm />
        </div>
      </div>
    </main>
  );
}
