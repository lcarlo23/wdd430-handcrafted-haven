'use client';

import { useActionState, useRef, useEffect, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSellerProfile, addProduct, updateProductListing, deleteListing } from './actions';
import { compressImageToLimit } from '@/lib/compressor';
import { ToastContainer, toast } from 'react-toastify';

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

function SubmitBtn({
  text,
  loadingText,
  className = 'btn-primary',
}: {
  text: string;
  loadingText: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? loadingText : text}
    </button>
  );
}

const initialState = {
  success: false,
  message: null as string | null,
  error: null as string | null,
};

export default function DashboardClientForm({ seller, products, categories }: ClientProps) {
  const [profileState, profileAction] = useActionState(updateSellerProfile, initialState);
  const [addState, addAction] = useActionState(addProduct, initialState);
  const [updateState, updateAction] = useActionState(updateProductListing, initialState);
  const [deleteState, deleteAction] = useActionState(deleteListing, initialState);

  const addFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (profileState?.message) toast.success(profileState.message);
    if (profileState?.error) toast.error(profileState.error);

    if (addState?.message) {
      toast.success(addState.message);
      addFormRef.current?.reset();
    }
    if (addState?.error) toast.error(addState.error);

    if (updateState?.message) toast.success(updateState.message);
    if (updateState?.error) toast.error(updateState.error);

    if (deleteState?.message) toast.success(deleteState.message);
    if (deleteState?.error) toast.error(deleteState.error);
  }, [profileState, addState, updateState, deleteState]);

  const handleProfileWrapper = async (formData: FormData) => {
    const file = formData.get('profile_image_file') as File;
    if (file && file.size > 0) {
      const optimized = await compressImageToLimit(file, 1048576);
      formData.set('profile_image_file', optimized);
    }

    formData.append('current_profile_image', seller.profile_image || '');

    startTransition(() => {
      profileAction(formData);
    });
  };

  const handleAddWrapper = async (formData: FormData) => {
    const file = formData.get('product_image_file') as File;
    if (file && file.size > 0) {
      const optimized = await compressImageToLimit(file, 1048576);
      formData.set('product_image_file', optimized);
    }

    startTransition(() => {
      addAction(formData);
    });
  };

  const handleUpdateWrapper = async (formData: FormData) => {
    const file = formData.get('product_image_file') as File;
    if (file && file.size > 0) {
      const optimized = await compressImageToLimit(file, 1048576);
      formData.set('product_image_file', optimized);
    }

    startTransition(() => {
      updateAction(formData);
    });
  };

  return (
    <>
      <div className="dashboard-section">
        <h2>Update Profile</h2>
        <form action={handleProfileWrapper} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Store Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className="auth-input"
              defaultValue={seller.name}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Biography</label>
            <textarea
              id="bio"
              name="bio"
              className="auth-input"
              rows={4}
              defaultValue={seller.bio}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="profile_image">Profile Image (Optional)</label>
            <input
              type="file"
              id="profile_image"
              name="profile_image_file"
              className="auth-input"
              accept="image/*"
            />
          </div>
          <SubmitBtn text="Save Profile" loadingText="Saving..." className="btn-primary" />
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Add New Product</h2>
        <form ref={addFormRef} action={handleAddWrapper} className="auth-form">
          <div className="form-group">
            <label htmlFor="product_title">Title</label>
            <input type="text" id="product_title" name="title" className="auth-input" required />
          </div>
          <div className="form-group">
            <label htmlFor="product_category">Category</label>
            <select id="product_category" name="category_id" className="auth-input" required>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="product_description">Description</label>
            <textarea
              id="product_description"
              name="description"
              className="auth-input"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="product_price">Price ($)</label>
            <input
              type="number"
              step="0.01"
              id="product_price"
              name="price"
              className="auth-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="product_stock">Stock</label>
            <input
              type="number"
              id="product_stock"
              name="stock_quantity"
              className="auth-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_product_image">Product Image</label>
            <input
              type="file"
              id="new_product_image"
              name="product_image_file"
              className="auth-input"
              accept="image/*"
            />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="is_organic" value="true" /> Organic
            </label>
            <label>
              <input type="checkbox" name="is_recycled" value="true" /> Recycled
            </label>
          </div>
          <SubmitBtn text="Publish Product" loadingText="Publishing..." className="btn-primary" />
        </form>
      </div>

      {products.length > 0 && (
        <div className="dashboard-section">
          <h2>Manage Your Listings</h2>
          <div className="listings-grid">
            {products.map((product) => (
              <div key={product.id} className="listing-card">
                <form action={handleUpdateWrapper} className="auth-form">
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="current_image_url" value={product.image_url || ''} />

                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="auth-input"
                      defaultValue={product.title}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category_id"
                      className="auth-input"
                      defaultValue={product.category_id || ''}
                      required
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      className="auth-input"
                      rows={2}
                      defaultValue={product.description}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      id="price"
                      name="price"
                      className="auth-input"
                      defaultValue={product.price}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock_quantity"
                      className="auth-input"
                      defaultValue={product.stock_quantity}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="product_image">Change Image</label>
                    <input
                      type="file"
                      id="product_image"
                      name="product_image_file"
                      className="auth-input"
                      accept="image/*"
                    />
                  </div>
                  <div className="form-group checkbox-group">
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
                  <SubmitBtn
                    text="Update Listing"
                    loadingText="Updating..."
                    className="btn-secondary"
                  />
                </form>

                <form action={deleteAction} style={{ marginTop: '1rem' }}>
                  <input type="hidden" name="listingId" value={product.id} />
                  <SubmitBtn
                    text="Delete Listing Permanently"
                    loadingText="Deleting..."
                    className="btn-danger"
                  />
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
