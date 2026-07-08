import React from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { ProductCard } from "./ProductCard";
import { useShop } from "../context/ShopContext";

export const ProductGrid: React.FC = () => {
  const { filteredProducts, clearFilters } = useShop();

  return (
    <div className="w-full">
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: Math.min(idx * 0.04, 0.25), duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-24 text-center flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-sm bg-white p-8">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100 text-zinc-300">
            <Search size={28} strokeWidth={1} />
          </div>
          <h4 className="font-display font-black uppercase tracking-[0.25em] text-zinc-700 text-xs mb-2">
            No Matching Products
          </h4>
          <p className="text-[11px] font-bold text-zinc-400 max-w-xs mx-auto mb-8 leading-relaxed">
            We couldn't find any products matching your active filters. Try modifying your selections.
          </p>
          <button
            onClick={clearFilters}
            className="bg-brand-black text-white px-8 py-3.5 font-display font-black text-[10px] tracking-widest uppercase hover:bg-brand-primary transition-all active:scale-95 duration-200 shadow-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
