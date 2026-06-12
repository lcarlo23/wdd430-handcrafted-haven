'use client';

import { useActionState, startTransition } from 'react';
import { updateSellerProfile, addProduct, updateProductListing } from './actions';
import { compressImageToLimit } from '@/lib/compressor';

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

interface ClientProps {
  seller: Seller;
  products: Product[];
  categories: Category[];
}

interface ActionState {
  success: boolean;
  message: string | null;
  error: string | null;
}

const initialState: ActionState = { success: false, message: null, error: null };

export default function DashboardClientForm({ seller, products, categories }: ClientProps) {
  const [profileState, profileAction] = useActionState(updateSellerProfile, initialState);
  const [addState, addAction] = useActionState(addProduct, initialState);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('profile_image_file') as File;
    if (file && file.size > 0) {
      try {
        const compressed = await compressImageToLimit(file, 1048576);
        formData.set('profile_image_file', compressed);
      } catch (err) {
        console.error(err);
      }
    }
    startTransition(() => {
      profileAction(formData);
    });
  };

  const handleAddProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('product_image_file') as File;
    if (file && file.size > 0) {
      try {
        const compressed = await compressImageToLimit(file, 1048576);
        formData.set('product_image_file', compressed);
      } catch (err) {
        console.error(err);
      }
    }
    startTransition(() => {
      addAction(formData);
    });
  };

  return (
    <>
      <section className="dashboard-section profile-section">
        <h2>Modify Profile Details</h2>
        
        {profileState.error && <p style={{ color: 'red', margin: '10px 0' }}>{profileState.error}</p>}
        {profileState.success && <p style={{ color: 'green', margin: '10px 0' }}>{profileState.message}</p>}

        <form onSubmit={handleProfileSubmit} className="dashboard-form">
          <input type="hidden" name="current_profile_image" value={seller.profile_image || ''} />
          <div className="form-group">
            <label>Business Name</label>
            <input type="text" name="name" defaultValue={seller.name} required />
          </div>
          <div className="form-group">
            <label>Biography</label>
            <textarea name="bio" defaultValue={seller.bio || ''} required />
          </div>
          <div className="form-group">
            <label>Upload Profile Image</label>
            <input
              type="file"
              name="profile_image_file"
              accept="image/*"
            />
          </div>
          <button type="submit" className="btn-primary">
            Save Profile Changes
          </button>
        </form>
      </section>

      <section className="dashboard-section add-product-section">
        <h2>Add New Product</h2>

        {addState.error && <p style={{ color: 'red', margin: '10px 0' }}>{addState.error}</p>}
        {addState.success && <p style={{ color: 'green', margin: '10px 0' }}>{addState.message}</p>}

        <form onSubmit={handleAddProductSubmit} className="dashboard-form">
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
            <label>Upload Product Image</label>
            <input type="file" name="product_image_file" accept="image/*" />
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

      <section className="dashboard-section listings-section">
        <h2>Active Listings Management</h2>
        <div className="listings-grid">
          {products.map((product) => {
            return (
              <ProductListingRow 
                key={product.id} 
                product={product} 
                categories={categories} 
              />
            );
          })}
        </div>
      </section>
    </>
  );
}

function ProductListingRow({ product, categories }: { product: Product; categories: Category[] }) {
  const [state, action] = useActionState(updateProductListing, initialState);

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('product_image_file') as File;
    if (file && file.size > 0) {
      try {
        const compressed = await compressImageToLimit(file, 1048576);
        formData.set('product_image_file', compressed);
      } catch (err) {
        console.error(err);
      }
    }
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="listing-card">
      {state.error && <p style={{ color: 'red', margin: '10px 0' }}>{state.error}</p>}
      {state.success && <p style={{ color: 'green', margin: '10px 0' }}>{state.message}</p>}

      <form onSubmit={handleUpdateSubmit} className="dashboard-form">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="current_image_url" value={product.image_url || ''} />

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
          <label>Change Product Image</label>
          <input type="file" name="product_image_file" accept="image/*" />
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
  );
}