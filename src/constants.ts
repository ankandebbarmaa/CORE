import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "core-001",
    name: "Classic Violet Hoodie",
    price: 3499,
    category: "hoodies",
    gender: "unisex",
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
    gender: "men",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    description: "Premium cotton tee with a clean boxy fit. Minimal design for a modern holiday escape mood. New arrival.",
    colors: ["#DC2626", "#000000"],
    sizes: ["M", "L", "XL"],
    reviews: [
      { id: "r3", user: "Arnav Singh", rating: 5, comment: "Simple and elegant." }
    ]
  },
  {
    id: "core-003",
    name: "Night Stealth Cargos",
    price: 4999,
    category: "jeans",
    gender: "men",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800",
    description: "Deep black tactical cargo pants with high-density cotton. Built for the urban modular life.",
    colors: ["#000000", "#111827"],
    sizes: ["30", "32", "34", "36"],
    reviews: []
  },
  {
    id: "core-004",
    name: "White Linen Shirt",
    price: 2499,
    category: "tees",
    gender: "men",
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
    gender: "unisex",
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
    gender: "unisex",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "Relaxed fit premium cotton tee in a signature beige color. New arrival staple basics.",
    colors: ["#F5F5DC", "#000000"],
    sizes: ["S", "M", "L", "XL"],
    reviews: []
  },
  {
    id: "core-007",
    name: "Midnight Bomber Jacket",
    price: 5499,
    category: "hoodies",
    gender: "men",
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
    gender: "unisex",
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
    gender: "men",
    image: "https://images.unsplash.com/photo-1552839014-41275623306e?auto=format&fit=crop&q=80&w=800",
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
    gender: "unisex",
    image: "https://images.unsplash.com/photo-1603252109303-12751441dd157?auto=format&fit=crop&q=80&w=800",
    description: "A dark graphite oversized hoodie. New arrival winter essence.",
    colors: ["#374151"],
    sizes: ["L", "XL", "XXL"],
    reviews: []
  },
  {
    id: "core-011",
    name: "Linen Breeze Shirt",
    price: 2999,
    category: "shirts",
    gender: "men",
    image: "https://images.unsplash.com/photo-1594932224010-74f43c3298a0?auto=format&fit=crop&q=80&w=800",
    description: "High quality linen shirt man collection. New arrival for beach days.",
    colors: ["#ADD8E6"],
    sizes: ["M", "L", "XL"],
    reviews: []
  },
  {
    id: "core-w-001",
    name: "Cyber Pink Crop Top",
    price: 1299,
    originalPrice: 1999,
    category: "tees",
    gender: "women",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    description: "Futuristic pink crop top with a tight fit. High-grade synthetic blend.",
    colors: ["#FF69B4", "#000000"],
    sizes: ["XS", "S", "M"],
    reviews: []
  },
  {
    id: "core-w-002",
    name: "Velvet Night Cargo",
    price: 2999,
    originalPrice: 4499,
    category: "hoodies",
    gender: "women",
    image: "https://images.unsplash.com/photo-1539109132381-31a1a9a23991?auto=format&fit=crop&q=80&w=800",
    description: "Soft velvet texture cargo pants for a luxe luxury refined streetwear look.",
    colors: ["#000000", "#4B0082"],
    sizes: ["26", "28", "30"],
    reviews: []
  },
  {
    id: "core-w-003",
    name: "Electric Blue Biker Shorts",
    price: 1599,
    originalPrice: 2199,
    category: "tees",
    gender: "women",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    description: "High-compression biker shorts in vibrant electric blue. Perfect for athleisure.",
    colors: ["#0000FF"],
    sizes: ["S", "M", "L"],
    reviews: []
  },
  {
    id: "core-w-004",
    name: "Aero Platform Boots",
    price: 6499,
    originalPrice: 8999,
    category: "footwear",
    gender: "women",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800",
    description: "Chunky platform boots with a technical techwear finish.",
    colors: ["#000000", "#FFFFFF"],
    sizes: ["5", "6", "7", "8"],
    reviews: []
  },
  {
    id: "core-w-005",
    name: "Onyx Mesh Jacket",
    price: 3999,
    originalPrice: 5499,
    category: "hoodies",
    gender: "women",
    image: "https://images.unsplash.com/photo-1591047139829-d91aec06adce?auto=format&fit=crop&q=80&w=800",
    description: "Breathable mesh jacket for layering. Edgy streetwear aesthetic.",
    colors: ["#000000"],
    sizes: ["S", "M", "L"],
    reviews: []
  },
  {
    id: "core-w-006",
    name: "Pastel Wave Sneakers",
    price: 4999,
    originalPrice: 6999,
    category: "footwear",
    gender: "women",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
    description: "Soft pastel colorway sneakers with high-rebound cushioning.",
    colors: ["#FFB6C1", "#E0FFFF"],
    sizes: ["6", "7", "8"],
    reviews: []
  },
  {
    id: "core-w-007",
    name: "Acid Wash Denim Skirt",
    price: 2499,
    originalPrice: 3299,
    category: "jeans",
    gender: "women",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
    description: "Y2K inspired acid wash denim skirt with distressed edges.",
    colors: ["#B0C4DE"],
    sizes: ["26", "28", "30"],
    reviews: []
  },
  {
    id: "core-w-008",
    name: "Nova Silver Windbreaker",
    price: 4599,
    originalPrice: 5999,
    category: "hoodies",
    gender: "women",
    image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&q=80&w=800",
    description: "Reflective silver windbreaker for night visibility and futuristic style.",
    colors: ["#C0C0C0"],
    sizes: ["S", "M", "L"],
    reviews: []
  },
  {
    id: "core-w-009",
    name: "Matrix Slit Dress",
    price: 3299,
    originalPrice: 4299,
    category: "shirts",
    gender: "women",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
    description: "Sleek black bodycon dress with side slit for luxury high-fashion refined style.",
    colors: ["#000000"],
    sizes: ["XS", "S", "M"],
    reviews: []
  },
  {
    id: "core-w-010",
    name: "Neon Tracer Bodysuit",
    price: 2199,
    originalPrice: 2999,
    category: "tees",
    gender: "women",
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=800",
    description: "Form-fitting bodysuit with neon reflective piping.",
    colors: ["#39FF14", "#000000"],
    sizes: ["XS", "S", "M"],
    reviews: []
  },
  {
    id: "core-w-011",
    name: "Shadow Pleated Pants",
    price: 3899,
    originalPrice: 5299,
    category: "hoodies",
    gender: "women",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
    description: "Technical pleated pants with a wide-leg silhouette. Techwear inspired formal drip luxury.",
    colors: ["#1A1A1A"],
    sizes: ["26", "28", "30"],
    reviews: []
  }
];
