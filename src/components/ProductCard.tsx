interface Product {
  id: number;
  title: string;
  price: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="image-placeholder"></div>
      <div className="product-details">
        <h3 className="product-name">{product.title}</h3>
        <p className="product-price">{product.price}</p>
      </div>
    </div>
  );
}