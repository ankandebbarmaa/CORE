import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

export const PromoPopup: React.FC = () => {
  const { showPromoPopup, setShowPromoPopup } = useShop();

  if (!showPromoPopup) return null;

  return (
    <AnimatePresence>
      {showPromoPopup && (
        <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowPromoPopup(false)} 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          />

          {/* Modal Panel */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-xl relative rounded-t-2xl md:rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh]"
          >
            {/* Visual Panel */}
            <div className="md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden bg-zinc-100 flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600" 
                className="w-full h-full object-cover" 
                alt="Promo Model" 
              />
            </div>
            
            {/* Form Panel */}
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative bg-white">
              <button 
                onClick={() => setShowPromoPopup(false)}
                className="absolute top-4 right-4 p-2 text-zinc-300 hover:text-black transition-all"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
              
              <p className="font-display font-black text-[9px] tracking-[0.4em] text-zinc-400 mb-4 uppercase">
                MEMBER PRIVILEGE
              </p>
              
              <h3 className="text-2xl md:text-3xl font-display font-black tracking-tighter mb-6 leading-tight uppercase text-zinc-950">
                THE PROTOCOL OFFER
              </h3>
              
              <div className="space-y-4 mb-8">
                 <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest leading-relaxed">
                   BUY 4 GET 1 FREE<br/>
                   + EXTRA 15% OFF (₹10,000+)
                 </p>
                 <div className="py-3 px-4 border border-zinc-100 bg-zinc-50 text-center font-display font-black text-lg tracking-[0.2em] uppercase rounded-sm text-brand-accent animate-tag-pulse">
                   CORE15
                 </div>
              </div>

              <button 
                onClick={() => setShowPromoPopup(false)}
                className="w-full bg-brand-black text-white py-4 font-display font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all shadow-md rounded-sm"
              >
                COLLECT OFFER
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
