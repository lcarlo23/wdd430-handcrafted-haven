import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  title: string;
  price: string;
  image_url: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <Image
        src={product.image_url ? product.image_url : '/product-placeholder.jpg'}
        alt={`${product.title} photo`}
        width={200}
        height={200}
        className="card-image"
      />
      <div className="product-details">
        <h3 className="product-name">{product.title}</h3>
        <p className="product-price">$ {product.price}</p>
      </div>
    </Link>
  );
}
