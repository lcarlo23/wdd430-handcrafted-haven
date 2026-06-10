'use server';

import sql from '@/lib/db';

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
