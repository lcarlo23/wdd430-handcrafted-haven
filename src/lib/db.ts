import postgres from 'postgres';
import {Product, Review} from "@/lib/definitions";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('CRITICAL: POSTGRES_URL environment variable is missing.');
}

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 10,
  idle_timeout: 30,
});

export async function fetchProduct(productId: string) {
  try {
    const data = await sql<
      Product[]
    >`SELECT * FROM products WHERE id = ${productId}`;
    const product = data.map((product) => ({
      ...product,
    }));
    return product[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch product data.");
  }
}

export async function calulateAverageProductRating(productId: number) {
  try {
    const data = await sql<any>`SELECT ROUND(AVG(rating)::NUMERIC, 2) AS avg_rating FROM reviews WHERE product_id = ${productId}`;
    const result = data[0]?.avg_rating; // Got help here from Copilot because I couldn't figure out how to extract the numeric value that was being returned from the SQL query
    return result !== null ? Number(result) : 0;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to calculate average product rating.");
  }
}
