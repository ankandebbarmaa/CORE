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
  category: "hoodies" | "tees" | "accessories" | "footwear";
  image: string;
  description: string;
  reviews: Review[];
  colors: string[];
  sizes: string[];
}

export interface CartItem extends Product {
  quantity: number;
}
