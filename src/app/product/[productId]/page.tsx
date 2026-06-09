import { fetchProduct, calulateAverageProductRating } from "@/lib/db";
import StarRating from "@/components/StarRating";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ProductPage(props: {
  params: Promise<{ productId: string }>;
}) {
  const params = await props.params;
  const id = params.productId;
  const [product, averageRating] = await Promise.all([
    fetchProduct(id),
    calulateAverageProductRating(Number(id)),
  ]);
  const altText = `Image of ${product.title} product`;
  const priceText = `$${product.price}`;
  
  if (!product) {
    notFound();
  }

  return (
    <main>
      <div className="product-page">
        <h1>{product.title}</h1>
        <Image src={product.imageUrl} alt={altText} width={200} height={75} />
        <p className="product-price">{priceText}</p>
        <p className="product-description">{product.description}</p>
        <StarRating rating={averageRating} /> ???Maybe add how many reviews there are for the product???
        <p className="product-seller-name">
          ???Figure out how to put product seller's name and link to their page
          here???
        </p>
        ???Need to list reviews and put add rating and review feature???
      </div>
    </main>
  );
}
