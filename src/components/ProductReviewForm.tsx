'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { postReview } from '@/lib/actions';
import ClickableStarRating from './ClickableStarRating';

export default function ProductReviewForm() {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: Number(productId),
    reviewerName: '',
    rating: '',
    comment: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleBlur = (e: any) => {
    if (e === '') {
      setError('Please complete this field');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const dataFromForm = new FormData(e.target);
    setLoading(true);
    const reviewerName = dataFromForm.get('reviewerName');
    try {
      const result = await postReview(dataFromForm);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      toast.success(
        `Your review has been submitted, ${reviewerName}! Thanks for reviewing the product!`
      );
      setFormData({
        productId: Number(productId),
        reviewerName: '',
        rating: '',
        comment: '',
      });
      router.refresh();
      setLoading(false);
    } catch {
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <>
      <p>Fields marked with an asterisk are required</p>
      <form className="product-review-form" onSubmit={handleSubmit}>
        <label htmlFor="reviewerName">
          Name <span aria-label="required">*</span>
        </label>
        <input
          type="text"
          name="reviewerName"
          autoComplete="given-name"
          value={formData.reviewerName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error' : undefined}
          title="Please enter your name"
          placeholder="Name"
          required
        />

        <label htmlFor="rating">
          Rating <span aria-label="required">*</span>
        </label>
        <ClickableStarRating
          rating={Number(formData.rating) || 0}
          onChange={(value) => setFormData({ ...formData, rating: String(value) })}
        />
        <input type="hidden" name="rating" value={formData.rating} required />
        <label htmlFor="comment">
          Message <span aria-label="required">*</span>
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error' : undefined}
          placeholder="Type product review here..."
          rows={3}
          required
        ></textarea>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Submitting...' : 'Submit Product Review'}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={4000} />
    </>
  );
}
