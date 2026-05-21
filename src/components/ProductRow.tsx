import postgres from 'postgres';

// Defines the structure of a product record as expected from the database query
interface Product {
  id: number;
  title: string;
  price: string;
}

interface ProductRowProps {
  rowId: string; // Identifier for the product category or row to query from the database
  sectionTitle: string; // Title to display for the product section header
  gridClass: string; // CSS class to apply for grid layout styling (e.g., "columns-4", "columns-5")
}

export default async function ProductRow({ rowId, sectionTitle, gridClass }: ProductRowProps) {
  // Initializes a connection to the PostgreSQL database using the connection string from environment variables
  const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

  let products: Product[] = [];

  try {
    // SQL query to fetch products based on the provided rowId (category_id) and order them by id in ascending order
    products = await sql<Product[]>`
      SELECT id, title, price 
      FROM products 
      WHERE category_id = ${rowId}
      ORDER BY id ASC
    `;
  } catch (error) {
    console.error(`Database query failure for row allocation [${rowId}]:`, error);
    // In case of error, products will remain an empty array, and the component will render without product cards
  } finally {
    // End the database connection to free up resources
    await sql.end();
  }

  return (
    <section className={`product-section ${rowId}-section`}>
      <h2 className="section-title">{sectionTitle}</h2>
      <div className={`product-grid ${gridClass}`}>
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="image-placeholder"></div>
            <div className="product-details">
              <h3 className="product-name">{product.title}</h3>
              <p className="product-price">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}