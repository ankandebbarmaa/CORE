import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "core-001",
    name: "Classic Violet Hoodie",
    price: 3499,
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    description: "Comfortable heavyweight cotton hoodie with a soft inner lining. Perfect for daily wear.",
    colors: ["#7C3AED", "#1F2937", "#FFFFFF"],
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      { id: "r1", user: "Rahul Sharma", rating: 5, comment: "Really warm and the purple is dark and nice." },
      { id: "r2", user: "Sam P.", rating: 4, comment: "Bit heavy for Mumbai, but great for travel!" }
    ]
  },
  {
    id: "core-002",
    name: "Red Signal T-Shirt",
    price: 1299,
    category: "tees",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    description: "Premium cotton tee with a clean boxy fit. Minimal design for a modern look. New arrival.",
    colors: ["#DC2626", "#000000"],
    sizes: ["M", "L", "XL"],
    reviews: [
      { id: "r3", user: "Arnav Singh", rating: 5, comment: "Simple and elegant." }
    ]
  },
  {
    id: "core-003",
    name: "Blue Cargo Pants",
    price: 4999,
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
    description: "Durable cotton blend pants with multiple pockets for utility and style.",
    colors: ["#2563EB", "#111827"],
    sizes: ["30", "32", "34", "36"],
    reviews: []
  },
  {
    id: "core-004",
    name: "White Linen Shirt",
    price: 2499,
    category: "tees",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    description: "Breathable 100% linen shirt for men. Ideal for summer arrival and casual outings.",
    colors: ["#FFFFFF", "#F3F4F6"],
    sizes: ["M", "L", "XL", "XXL"],
    reviews: [
      { id: "r6", user: "Vikram", rating: 5, comment: "Perfect for the summer heat." }
    ]
  },
  {
    id: "core-005",
    name: "Street Pulse Sneakers",
    price: 8999,
    category: "footwear",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800",
    description: "Lightweight and comfortable sneakers designed for urban explorers.",
    colors: ["#F59E0B", "#10B981", "#EF4444"],
    sizes: ["7", "8", "9", "10"],
    reviews: [
      { id: "r5", user: "Aman", rating: 5, comment: "Best sneakers under 10k." }
    ]
  },
  {
    id: "core-006",
    name: "Oversized Beige Tee",
    price: 1599,
    category: "tees",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "Relaxed fit premium cotton tee in a signature beige color. New arrival staple.",
    colors: ["#F5F5DC", "#000000"],
    sizes: ["S", "M", "L", "XL"],
    reviews: []
  },
  {
    id: "core-007",
    name: "Midnight Bomber Jacket",
    price: 5499,
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
    description: "Sleek midnight black bomber jacket with water-resistant finish.",
    colors: ["#000000"],
    sizes: ["M", "L", "XL"],
    reviews: []
  },
  {
    id: "core-008",
    name: "Retro Runner Shoes",
    price: 6499,
    category: "footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    description: "Classic retro design with modern cushioning technology.",
    colors: ["#EF4444", "#FFFFFF"],
    sizes: ["8", "9", "10"],
    reviews: []
  },
  {
    id: "core-009",
    name: "Desert Sand Cargo",
    price: 3999,
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1624371414361-e6e8ea0611e8?auto=format&fit=crop&q=80&w=800",
    description: "Lightweight cargo pants for summer arrival. Minimal and functional.",
    colors: ["#C2B280"],
    sizes: ["30", "32", "34"],
    reviews: []
  },
  {
    id: "core-010",
    name: "Graphite Oversized Hoodie",
    price: 4299,
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    description: "A dark graphite oversized hoodie. New arrival winter essence.",
    colors: ["#374151"],
    sizes: ["L", "XL", "XXL"],
    reviews: []
  },
  {
    id: "core-011",
    name: "Linen Breeze Shirt",
    price: 2999,
    category: "tees",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800",
    description: "High quality linen shirt man collection. New arrival for beach days.",
    colors: ["#ADD8E6"],
    sizes: ["M", "L", "XL"],
    reviews: []
  }
];
