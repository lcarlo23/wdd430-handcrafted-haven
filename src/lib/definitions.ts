export type Product = {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isOrganic: boolean;
  isRecycled: boolean;
};

export type Review = {
  id: string;
  productId: number;
  userId: string;
  rating: number;
  description: string;
};

// Got help from a Bing search for "represent a number in stars as in a product rating react next.js typescript"
export interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  color?: string;
}
