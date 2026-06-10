import sql from '@/lib/db';
import { updateSellerProfile, addProduct, updateProductListing } from './actions';
import './dashboard.css';

const MOCK_SELLER_ID = '55555555-5555-5555-5555-555555555555';

interface Product {
  id: number;
  category_id: string | null;
  title: string;
  description: string;
  price: string;
  stock_quantity: number;
  image_url: string | null;
  is_organic: boolean;
  is_recycled: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Seller {
  id: string;
  name: string;
  bio: string;
  profile_image: string;
}

export default async function SellerDashboard() {
  const sellers = await sql<
    Seller[]
  >`SELECT id, name, bio, profile_image FROM sellers WHERE id = ${MOCK_SELLER_ID}`;
  const seller = sellers[0];

  const products = await sql<
    Product[]
  >`SELECT id, category_id, title, description, price, stock_quantity, image_url, is_organic, is_recycled FROM products WHERE seller_id = ${MOCK_SELLER_ID} ORDER BY id ASC`;
  const categories = await sql<Category[]>`SELECT id, name FROM categories`;

  if (!seller) {
    return <div className="dashboard-error">Seller profile records not identified.</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Seller Dashboard</h1>

      {/* Profile Modification Block */}
      <section className="dashboard-section profile-section">
        <h2>Modify Profile Details</h2>
        <form action={updateSellerProfile} className="dashboard-form">
          <div className="form-group">
            <label>Business Name</label>
            <input type="text" name="name" defaultValue={seller.name} required />
          </div>
          <div className="form-group">
            <label>Biography</label>
            <textarea name="bio" defaultValue={seller.bio || ''} required />
          </div>
          <div className="form-group">
            <label>Profile Image URL</label>
            <input
              type="text"
              name="profile_image"
              defaultValue={seller.profile_image || ''}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Save Profile Changes
          </button>
        </form>
      </section>

      {/* Creation Block */}
      <section className="dashboard-section add-product-section">
        <h2>Add New Product</h2>
        <form action={addProduct} className="dashboard-form">
          <div className="form-group">
            <label>Product Title</label>
            <input type="text" name="title" required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category_id" required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" name="price" step="0.01" required />
          </div>
          <div className="form-group">
            <label>Stock Quantity</label>
            <input type="number" name="stock_quantity" required />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="image_url" />
          </div>
          <div className="form-checkbox-group">
            <label>
              <input type="checkbox" name="is_organic" value="true" /> Organic
            </label>
            <label>
              <input type="checkbox" name="is_recycled" value="true" /> Recycled
            </label>
          </div>
          <button type="submit" className="btn-primary">
            Publish Product
          </button>
        </form>
      </section>

      {/* List Modification Block */}
      <section className="dashboard-section listings-section">
        <h2>Active Listings Management</h2>
        <div className="listings-grid">
          {products.map((product) => (
            <div key={product.id} className="listing-card">
              <form action={updateProductListing} className="dashboard-form">
                <input type="hidden" name="id" value={product.id} />

                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="title" defaultValue={product.title} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category_id" defaultValue={product.category_id || ''} required>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" defaultValue={product.description || ''} required />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    defaultValue={product.price}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    defaultValue={product.stock_quantity}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="text" name="image_url" defaultValue={product.image_url || ''} />
                </div>
                <div className="form-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_organic"
                      value="true"
                      defaultChecked={product.is_organic}
                    />{' '}
                    Organic
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="is_recycled"
                      value="true"
                      defaultChecked={product.is_recycled}
                    />{' '}
                    Recycled
                  </label>
                </div>
                <button type="submit" className="btn-secondary">
                  Update Listing
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
