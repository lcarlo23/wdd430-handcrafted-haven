"use server";

import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

// based off a hardcoded seller ID in the seed.sql
const MOCK_SELLER_ID = "55555555-5555-5555-5555-555555555555";

export async function updateSellerProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const profile_image = formData.get("profile_image") as string;

  try {
    await sql`
      UPDATE sellers
      SET name = ${name}, bio = ${bio}, profile_image = ${profile_image}
      WHERE id = ${MOCK_SELLER_ID}
    `;
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to update seller profile:", error);
    throw new Error("Profile update execution failed.");
  }
}

export async function addProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string, 10);
  const image_url = formData.get("image_url") as string || null;
  const category_id = formData.get("category_id") as string || null;
  const is_organic = formData.get("is_organic") === "true";
  const is_recycled = formData.get("is_recycled") === "true";

  try {
    await sql`
      INSERT INTO products (seller_id, category_id, title, description, price, stock_quantity, image_url, is_organic, is_recycled)
      VALUES (${MOCK_SELLER_ID}, ${category_id}, ${title}, ${description}, ${price}, ${stock_quantity}, ${image_url}, ${is_organic}, ${is_recycled})
    `;
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to add product:", error);
    throw new Error("Product insertion execution failed.");
  }
}

export async function updateProductListing(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string, 10);
  const image_url = formData.get("image_url") as string || null;
  const category_id = formData.get("category_id") as string || null;
  const is_organic = formData.get("is_organic") === "true";
  const is_recycled = formData.get("is_recycled") === "true";

  try {
    await sql`
      UPDATE products
      SET title = ${title}, description = ${description}, price = ${price}, 
          stock_quantity = ${stock_quantity}, image_url = ${image_url}, 
          category_id = ${category_id}, is_organic = ${is_organic}, is_recycled = ${is_recycled}
      WHERE id = ${id} AND seller_id = ${MOCK_SELLER_ID}
    `;
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to update product listing:", error);
    throw new Error("Product modification execution failed.");
  }
}