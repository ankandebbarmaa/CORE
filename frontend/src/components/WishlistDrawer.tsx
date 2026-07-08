import React from "react";
import { X, Heart, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    formatPrice
  } = useShop();

  // Filter products that are in user's wishlist
  const wishlistedItems = products.filter(p => wishlist.includes(p.id));

  const handleMoveToBag = (product: any) => {
    // Select first size as default or "One Size"
    const defaultSize = product.sizes[0] || "One Size";
    addToCart(product, defaultSize);
    toggleWishlist(product.id);
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />

          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[160] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <div>
                <h3 className="text-xl font-display font-black tracking-tight uppercase text-zinc-950">
                  WISHLIST
                </h3>
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 mt-1 uppercase">
                  {wishlistedItems.length} {wishlistedItems.length === 1 ? "item" : "items"} saved
                </p>
              </div>
              <button 
                onClick={() => setIsWishlistOpen(false)} 
                className="p-2 text-zinc-400 hover:text-black transition-all hover:rotate-90 duration-300"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {wishlistedItems.length > 0 ? (
                wishlistedItems.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-zinc-50 pb-5">
                    {/* Item Thumbnail */}
                    <div className="w-16 h-20 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details and CTAs */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-display font-bold text-xs text-zinc-800 uppercase tracking-wide truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] font-black text-zinc-950 uppercase tracking-widest">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleMoveToBag(item)}
                          className="flex-grow bg-brand-primary text-white py-2 px-3 rounded-sm font-display font-black text-[9px] tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ShoppingBag size={11} />
                          <span>MOVE TO BAG</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(item.id)}
                          className="p-2 border border-zinc-200 hover:border-brand-accent hover:bg-brand-accent/5 rounded-sm transition-colors text-brand-accent"
                          title="Remove from wishlist"
                        >
                          <Heart size={14} className="fill-brand-accent text-brand-accent" strokeWidth={0} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty Wishlist State */
                <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="text-zinc-200">
                    <Heart size={48} strokeWidth={1} />
                  </div>
                  <h4 className="font-display font-black uppercase text-xs tracking-widest text-zinc-400">
                    Wishlist is empty
                  </h4>
                  <p className="text-[11px] font-bold text-zinc-400 max-w-xs leading-relaxed uppercase tracking-wider">
                    Save items you like to buy them later.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
