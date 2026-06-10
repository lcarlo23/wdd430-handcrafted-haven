export type Product = {
  id: string;
  seller_id: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  is_organic: boolean;
  is_recycled: boolean;
};

export type Review = {
  id: string;
  product_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
};

export type Seller = {
  id: string;
  name: string;
  email: string;
  bio: string;
  profile_image: string;
};

// Got help from a Bing search for "represent a number in stars as in a product rating react next.js typescript"
export interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  color?: string;
}

export interface ClickableStarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  color?: string;
  onChange?: (value: number) => void;
}
