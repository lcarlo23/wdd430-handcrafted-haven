'use server';

import sql from '@/lib/db';
import { z } from 'zod';
import { Product, Review } from '@/lib/definitions';

export async function loadMoreProducts(
  categoryId?: string,
  isOrganic?: boolean,
  isRecycled?: boolean,
  minPrice?: string,
  maxPrice?: string,
  offset: number = 0
) {
  const limit = 9;

  try {
    const products = await sql`
      SELECT id, title, price, image_url, is_organic, is_recycled 
      FROM products 
      WHERE 1=1
      ${categoryId ? sql`AND category_id = ${categoryId}` : sql``}
      ${isOrganic ? sql`AND is_organic = true` : sql``}
      ${isRecycled ? sql`AND is_recycled = true` : sql``}
      ${minPrice ? sql`AND price >= ${minPrice}` : sql``}
      ${maxPrice ? sql`AND price <= ${maxPrice}` : sql``}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return products;
  } catch (error) {
    console.error('Errore nel caricamento prodotti extra:', error);
    return [];
  }
}

export async function fetchProduct(productId: string) {
  try {
    const data = await sql<Product[]>`SELECT * FROM products WHERE id = ${productId}`;
    const product = data.map((product) => ({
      ...product,
    }));
    return product[0];
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch product data.');
  }
}

export async function fetchReviews(productId: number) {
  try {
    const data = await sql<Review[]>`SELECT * FROM reviews WHERE product_id = ${productId}`;
    const reviewsById = data.map((review) => ({
      ...review,
    }));
    return reviewsById;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch reviews data.');
  }
}

const FormSchema = z.object({
  id: z.string(),
  product_id: z.coerce.number(),
  reviewer_name: z.string(),
  rating: z.coerce.number().min(0).max(5),
  comment: z.string(),
});

const PostReview = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    product_id?: string[];
    reviewer_name?: string[];
    rating?: string[];
    comment?: string[];
  };
  message?: string | null;
};

export async function postReview(formData: FormData) {
  console.log('SERVER ACTION HIT');
  const validatedFields = PostReview.safeParse({
    product_id: formData.get('productId'),
    reviewer_name: formData.get('reviewerName'),
    rating: formData.get('rating'),
    comment: formData.get('comment'),
  });
  if (!validatedFields.success) {
    return { error: 'Missing or invalid form data' };
  }
  const { product_id, reviewer_name, rating, comment } = validatedFields.data;
  try {
    console.log("Rating:", rating)
    await sql`INSERT INTO reviews (product_id, reviewer_name, rating, comment) VALUES (${product_id}, ${reviewer_name}, ${rating}, ${comment})`;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to submit product review data.');
  }
}

export async function calulateReviewCountbyProductId(productId: number) {
  try {
    const data =
      await sql<any>`SELECT COUNT(*) AS num_ratings FROM reviews WHERE product_id = ${productId}`;
    const result = data[0]?.num_ratings; // Got help here from Copilot because I couldn't figure out how to extract the numeric value that was being returned from the SQL query
    return result !== null ? Number(result) : 0;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to calculate number of reviews.');
  }
}

export async function calulateAverageProductRating(productId: number) {
  try {
    const data =
      await sql<any>`SELECT ROUND(AVG(rating)::NUMERIC, 2) AS avg_rating FROM reviews WHERE product_id = ${productId}`;
    const result = data[0]?.avg_rating; // Got help here from Copilot because I couldn't figure out how to extract the numeric value that was being returned from the SQL query
    return result !== null ? Number(result) : 0;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to calculate average product rating.');
  }
}
