import React from "react";
import { X, Truck, RotateCcw, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShippingReturnsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const ShippingReturnsModal: React.FC<ShippingReturnsModalProps> = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div 
            initial={{ y: "100%", opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: "100%", opacity: 0 }} 
            className="bg-white w-full max-w-lg relative rounded-t-2xl md:rounded-sm overflow-hidden shadow-2xl p-6 md:p-8 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-zinc-950">
                Shipping & Returns
              </h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-zinc-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 text-zinc-600">
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-brand-primary p-2 bg-brand-primary/10 rounded-sm h-fit">
                  <Truck size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-zinc-800">
                    EXPRESS DELIVERY
                  </h4>
                  <p className="text-[11px] font-medium leading-relaxed text-zinc-500">
                    All orders are packed and shipped within 24 hours. Expected transit time across India is 2-5 business days. Metropolitan addresses are served on priority.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 text-brand-accent p-2 bg-brand-accent/10 rounded-sm h-fit">
                  <RotateCcw size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-zinc-800">
                    7-DAY NO-QUESTIONS RETURN
                  </h4>
                  <p className="text-[11px] font-medium leading-relaxed text-zinc-500">
                    Return or exchange any unused items in their original condition, with tags intact, within 7 days of delivery. Refunds are credited directly to your bank account or payment wallet.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 text-zinc-800 p-2 bg-zinc-100 rounded-sm h-fit">
                  <ShieldAlert size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-zinc-800">
                    EXCLUSION DETAILS
                  </h4>
                  <p className="text-[11px] font-medium leading-relaxed text-zinc-500">
                    Collabs, limited drops, and privilege codes purchases cannot be cancelled after dispatch unless received damaged or incorrect.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="mt-8 w-full bg-brand-black text-white py-3.5 font-display font-black text-[10px] tracking-widest uppercase hover:bg-brand-primary transition-all rounded-sm shadow-sm"
            >
              CLOSE GUIDES
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
