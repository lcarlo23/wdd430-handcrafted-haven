'use server';

import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { cookies } from 'next/headers';

async function getAuthenticatedSellerId() {
  const cookieStore = await cookies();
  const session = cookieStore.get('seller_session');
  if (!session || !session.value) {
    throw new Error('Authentication session required.');
  }
  return session.value;
}

export async function updateSellerProfile(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const bio = formData.get('bio') as string;
  const profileImageFile = formData.get('profile_image_file') as File;
  let profile_image = formData.get('current_profile_image') as string;

  try {
    const sellerId = await getAuthenticatedSellerId();

    if (profileImageFile && profileImageFile.size > 0) {
      const blob = await put(`profiles/${Date.now()}-${profileImageFile.name}`, profileImageFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      profile_image = blob.url;
    }

    await sql`
      UPDATE sellers
      SET name = ${name}, bio = ${bio}, profile_image = ${profile_image}
      WHERE id = ${sellerId}
    `;
    revalidatePath('/dashboard');
    return { success: true, message: 'Profile details updated successfully!', error: null };
  } catch (error: any) {
    console.error('Failed to update seller profile:', error);
    return { success: false, message: null, error: 'Profile update execution failed.' };
  }
}

export async function addProduct(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  const rawPrice = formData.get('price') as string;
  const price = parseFloat(rawPrice);
  if (isNaN(price) || price < 0 || price >= 100000000) {
    return { success: false, message: null, error: 'Please enter a valid product price less than 100,000,000.' };
  }

  const rawStock = formData.get('stock_quantity') as string;
  const stock_quantity = parseInt(rawStock, 10);
  if (isNaN(stock_quantity) || stock_quantity < 0) {
    return { success: false, message: null, error: 'Please enter a valid stock quantity.' };
  }

  const productImageFile = formData.get('product_image_file') as File;
  const category_id = (formData.get('category_id') as string) || null;
  const is_organic = formData.get('is_organic') === 'true';
  const is_recycled = formData.get('is_recycled') === 'true';

  let image_url: string | null = null;

  try {
    const sellerId = await getAuthenticatedSellerId();

    if (productImageFile && productImageFile.size > 0) {
      const blob = await put(`products/${Date.now()}-${productImageFile.name}`, productImageFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      image_url = blob.url;
    }

    await sql`
      INSERT INTO products (seller_id, category_id, title, description, price, stock_quantity, image_url, is_organic, is_recycled)
      VALUES (${sellerId}, ${category_id}, ${title}, ${description}, ${price.toFixed(2)}, ${stock_quantity}, ${image_url}, ${is_organic}, ${is_recycled})
    `;
    revalidatePath('/dashboard');
    return { success: true, message: 'New product published successfully!', error: null };
  } catch (error: any) {
    console.error('Failed to add product:', error);
    return { success: false, message: null, error: 'Product insertion execution failed.' };
  }
}

export async function updateProductListing(prevState: any, formData: FormData) {
  const id = parseInt(formData.get('id') as string, 10);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  const rawPrice = formData.get('price') as string;
  const price = parseFloat(rawPrice);
  if (isNaN(price) || price < 0 || price >= 100000000) {
    return { success: false, message: null, error: 'Please enter a valid product price less than 100,000,000.' };
  }

  const rawStock = formData.get('stock_quantity') as string;
  const stock_quantity = parseInt(rawStock, 10);
  if (isNaN(stock_quantity) || stock_quantity < 0) {
    return { success: false, message: null, error: 'Please enter a valid stock quantity.' };
  }

  const productImageFile = formData.get('product_image_file') as File;
  let image_url = (formData.get('current_image_url') as string) || null;
  const category_id = (formData.get('category_id') as string) || null;
  const is_organic = formData.get('is_organic') === 'true';
  const is_recycled = formData.get('is_recycled') === 'true';

  try {
    const sellerId = await getAuthenticatedSellerId();

    if (productImageFile && productImageFile.size > 0) {
      const blob = await put(`products/${Date.now()}-${productImageFile.name}`, productImageFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      image_url = blob.url;
    }

    await sql`
      UPDATE products
      SET title = ${title}, description = ${description}, price = ${price.toFixed(2)}, 
          stock_quantity = ${stock_quantity}, image_url = ${image_url}, 
          category_id = ${category_id}, is_organic = ${is_organic}, is_recycled = ${is_recycled}
      WHERE id = ${id} AND seller_id = ${sellerId}
    `;
    revalidatePath('/dashboard');
    return { success: true, message: 'Listing data updated successfully!', error: null };
  } catch (error: any) {
    console.error('Failed to update product listing:', error);
    return { success: false, message: null, error: 'Product modification execution failed.' };
  }
}