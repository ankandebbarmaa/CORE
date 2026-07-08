import React from "react";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    subtotal,
    totalDiscount,
    total,
    setIsCheckoutOpen,
    formatPrice
  } = useShop();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
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
                  SHOPPING BAG
                </h3>
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 mt-1 uppercase">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} inside
                </p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-2 text-zinc-400 hover:text-black transition-all hover:rotate-90 duration-300"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-zinc-50 pb-5">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-24 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-xs text-zinc-800 uppercase tracking-wide truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Price: {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-zinc-200 rounded-sm bg-zinc-50">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-zinc-150 text-zinc-600 transition-colors"
                          >
                            <Minus size={11} strokeWidth={3} />
                          </button>
                          <span className="px-3 font-display font-black text-xs text-zinc-800">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-zinc-150 text-zinc-600 transition-colors"
                          >
                            <Plus size={11} strokeWidth={3} />
                          </button>
                        </div>

                        <button 
                          onClick={() => updateQuantity(item.id, -item.quantity)}
                          className="p-2 text-zinc-300 hover:text-brand-accent transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty Cart State */
                <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="text-zinc-200">
                    <ShoppingBag size={48} strokeWidth={1} />
                  </div>
                  <h4 className="font-display font-black uppercase text-xs tracking-widest text-zinc-400">
                    Your bag is empty
                  </h4>
                  <p className="text-[11px] font-bold text-zinc-400 max-w-xs leading-relaxed uppercase tracking-wider">
                    Add products from the catalog to start your order.
                  </p>
                </div>
              )}
            </div>

            {/* Cart Pricing Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-100 bg-zinc-50 space-y-6">
                <div className="space-y-3 font-bold uppercase text-[10px] tracking-widest">
                  {/* BOGO banner notification */}
                  {totalItemsCount < 5 ? (
                    <div className="text-[9px] font-black tracking-widest bg-brand-primary/10 text-brand-primary p-2 text-center rounded-sm">
                      ADD {5 - totalItemsCount} MORE ITEM(S) TO UNLOCK BOGO FREE OFFER!
                    </div>
                  ) : (
                    <div className="text-[9px] font-black tracking-widest bg-brand-secondary/15 text-emerald-600 p-2 text-center rounded-sm animate-tag-pulse">
                      🎉 BOGO PROMO APPLIED! CHEAPEST ITEMS ARE FREE!
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-zinc-700">{formatPrice(subtotal)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-brand-accent">
                      <span>BOGO & Promos discount</span>
                      <span>-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between font-display font-black text-3xl tracking-tighter text-zinc-950 pt-5 border-t border-zinc-200 mt-4 normal-case">
                    <span>TOTAL</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-brand-black text-white py-5 font-display font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brand-primary transition-all flex items-center justify-center gap-3 shadow-lg rounded-sm"
                >
                  SECURE CHECKOUT <ArrowRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
