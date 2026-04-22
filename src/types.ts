export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "hoodies" | "tees" | "accessories" | "footwear";
  gender: "men" | "women" | "unisex";
  image: string;
  description: string;
  reviews: Review[];
  colors: string[];
  sizes: string[];
  isNewArrival?: boolean;
}

export interface Discount {
  type: "percentage" | "bogo" | "flat";
  value: number;
  code?: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}
