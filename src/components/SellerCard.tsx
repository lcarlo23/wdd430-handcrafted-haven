import Link from 'next/link';
import Image from 'next/image';

interface Seller {
  id: string;
  profile_image: string;
  name: string;
}

interface SellerCardProps {
  seller: Seller;
}

export default function SellerCard({ seller }: SellerCardProps) {
  return (
    <Link href={`/seller/${seller.id}`} className="seller-card">
      <Image
        src={seller.profile_image}
        alt={seller.name}
        width={200}
        height={200}
        className="card-image"
      />
      <div className="seller-details">
        <h3 className="seller-name">{seller.name}</h3>
      </div>
    </Link>
  );
}
