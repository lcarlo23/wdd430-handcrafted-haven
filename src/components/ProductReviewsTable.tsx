import StarRating from '@/components/StarRating';
import { Review } from '@/lib/definitions';

export default function ProductReviewsTable({ reviews }: { reviews: Review[] }) {
  return (
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
              <td>
                <StarRating rating={review.rating} />
              </td>
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
  );
}
