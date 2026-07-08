import React from "react";
import { Heart, Star } from "lucide-react";
import { Product } from "../types";
import { useShop } from "../context/ShopContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart, formatPrice, setSelectedProduct } = useShop();

  const isWishlisted = wishlist.includes(product.id);
  const reviewsCount = product.reviews?.length || 0;
  
  // Calculate average rating
  const avgRating = reviewsCount > 0
    ? Number((product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1))
    : Number((3.8 + (product.price % 10) * 0.1).toFixed(1)); // mock rating if no reviews
  
  const displayReviewsCount = reviewsCount > 0 ? reviewsCount : (product.price % 85) + 3;

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart(product, size);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer bg-white border border-zinc-100 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative flex flex-col h-full"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-50 flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Wishlist Heart Overlay */}
        <button 
          onClick={(e) => toggleWishlist(product.id, e)}
          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all z-20 text-zinc-400 hover:text-brand-accent border border-zinc-100"
        >
          <Heart 
            size={15} 
            className={isWishlisted ? "fill-brand-accent text-brand-accent" : ""} 
            strokeWidth={isWishlisted ? 0 : 2} 
          />
        </button>

        {/* Rating Badge (Myntra style) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-20 border border-zinc-100 text-[9px] font-black tracking-wider text-zinc-800">
          <span>{avgRating}</span>
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-zinc-300">|</span>
          <span className="text-zinc-400 font-semibold">{displayReviewsCount}</span>
        </div>

        {/* Discount Badge Overlay */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-brand-accent text-white px-2 py-0.5 font-display font-black text-[9px] tracking-widest uppercase rounded-sm shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Quick Size Select Overlay on Hover (Myntra/Ajio style) */}
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30 border-t border-zinc-100 hidden sm:block">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 text-center">
            QUICK ADD SIZE
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {product.sizes.slice(0, 5).map(size => (
              <button
                key={size}
                onClick={(e) => handleQuickAdd(e, size)}
                className="px-2.5 py-1.5 border border-zinc-200 hover:border-brand-primary hover:bg-brand-primary hover:text-white rounded-sm text-[9px] font-display font-black tracking-wider transition-all"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Panel */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-2.5">
        <div className="space-y-1">
          <p className="text-[9px] font-display font-black text-brand-primary tracking-[0.2em] uppercase">
            {product.category}
          </p>
          <h4 className="font-display font-bold text-xs text-zinc-800 uppercase tracking-wide truncate group-hover:text-brand-primary transition-colors">
            {product.name}
          </h4>
        </div>

        {/* Pricing Layout */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-black text-sm text-zinc-950">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-zinc-400 text-xs line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-brand-accent text-[10px] font-bold">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
