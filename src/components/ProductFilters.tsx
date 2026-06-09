'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (formData: FormData) => {
    const categoryId = formData.get('category') as string;
    const isOrganic = formData.get('organic');
    const isRecycled = formData.get('recycled');

    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) params.set('category', categoryId);
    else params.delete('category');

    if (isOrganic) params.set('organic', 'true');
    else params.delete('organic');

    if (isRecycled) params.set('recycled', 'true');
    else params.delete('recycled');

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <form action={handleFilter} className="filter-bar">
      <div className="filter-group">
        <label htmlFor="category">Category:</label>
        <select name="category" id="category" defaultValue={searchParams.get('category') || ''}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="organic"
            value="true"
            defaultChecked={searchParams.get('organic') === 'true'}
          />
          Organic
        </label>
        <label>
          <input
            type="checkbox"
            name="recycled"
            value="true"
            defaultChecked={searchParams.get('recycled') === 'true'}
          />
          Recycled
        </label>
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn-apply">
          Apply Filters
        </button>
        <button type="button" onClick={handleClear} className="btn-reset">
          Clear
        </button>
      </div>
    </form>
  );
}
