import {
  fetchProduct,
  fetchReviews,
  calulateReviewCountbyProductId,
  calulateAverageProductRating,
} from '@/lib/actions';
import StarRating from '@/components/StarRating';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductReviewForm from "@/components/ProductReviewForm";

export default async function ProductPage(props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  const id = params.productId;
  const [product, reviews, averageRating, numberofReviews] = await Promise.all([
    fetchProduct(id),
    fetchReviews(Number(id)),
    calulateAverageProductRating(Number(id)),
    calulateReviewCountbyProductId(Number(id)),
  ]);
  const altText = `Image of ${product.title} product`;
  const priceText = `$${product.price}`;

  if (!product) {
    notFound();
  }

  return (
    <main>
      <div className="product-page">
        <h1>{product.title}</h1>
        <Image
          src={product.imageUrl ? product.imageUrl : '/logo.png'}
          alt={altText}
          width={200}
          height={75}
          loading='eager'
        />
        <p className="product-price">{priceText}</p>
        <p className="product-description">{product.description}</p>
        <StarRating rating={averageRating} />
        <span className="number-of-reviews">({numberofReviews})</span>
        <p className="product-seller-name">
          ???Figure out how to put product seller's name and link to their page here???
        </p>
        <h2>Review this Product</h2>
        <ProductReviewForm />
        <h2>Product Reviews</h2>
        <table className="product-reviews-table">
          <thead>
            <tr>
              <th>Reviewer Name</th>
              <th>Rating</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.reviewer_name}</td>
                  <td><StarRating rating={review.rating}/></td>
                  <td>{review.comment}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No reviews yet for this product</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
