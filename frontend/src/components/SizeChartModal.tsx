import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";

interface SizeChartModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product | null;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, setIsOpen, product }) => {
  if (!isOpen || !product) return null;

  const getRows = () => {
    if (product.category === "footwear") {
      return product.sizes.map((size: string) => {
        const uk = Number(size);
        const eu = Number.isFinite(uk) ? uk + 34 : "-";
        const cm = Number.isFinite(uk) ? (uk + 23).toFixed(1) : "-";
        return { size, chest: "-", waist: "-", inseam: "-", eu: `${eu}`, cm: `${cm}` };
      });
    }

    if (product.category === "jeans") {
      return product.sizes.map((size: string) => {
        const waist = Number(size);
        return {
          size,
          chest: "-",
          waist: Number.isFinite(waist) ? `${waist} in` : "-",
          inseam: Number.isFinite(waist) ? `${Math.max(28, waist - 2)} in` : "-",
          eu: "-",
          cm: "-",
        };
      });
    }

    const apparelGuide: Record<string, { chest: string; waist: string; inseam: string }> = {
      XS: { chest: "34-36 in", waist: "28-30 in", inseam: "29 in" },
      S: { chest: "36-38 in", waist: "30-32 in", inseam: "30 in" },
      M: { chest: "38-40 in", waist: "32-34 in", inseam: "31 in" },
      L: { chest: "40-42 in", waist: "34-36 in", inseam: "32 in" },
      XL: { chest: "42-44 in", waist: "36-38 in", inseam: "33 in" },
      XXL: { chest: "44-46 in", waist: "38-40 in", inseam: "34 in" },
      "One Size": { chest: "Fits most", waist: "Fits most", inseam: "-" },
    };

    return product.sizes.map((size: string) => {
      const guide = apparelGuide[size] || { chest: "Refer fit guide", waist: "Refer fit guide", inseam: "-" };
      return { size, ...guide, eu: "-", cm: "-" };
    });
  };

  const rows = getRows();

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
            className="bg-white w-full max-w-xl relative rounded-t-2xl md:rounded-sm overflow-hidden shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-black uppercase tracking-tight text-zinc-950">
                  Size Guide
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mt-1">
                  Product Category: {product.category}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-zinc-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-x-auto border border-zinc-100 rounded-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50">
                  <tr className="text-[9px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100">
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Chest</th>
                    <th className="px-4 py-3">Waist</th>
                    <th className="px-4 py-3">Inseam</th>
                    <th className="px-4 py-3">EU</th>
                    <th className="px-4 py-3">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row: any) => (
                    <tr key={row.size} className="border-t border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-black text-black">{row.size}</td>
                      <td className="px-4 py-3">{row.chest}</td>
                      <td className="px-4 py-3">{row.waist}</td>
                      <td className="px-4 py-3">{row.inseam}</td>
                      <td className="px-4 py-3">{row.eu}</td>
                      <td className="px-4 py-3">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-4 text-center leading-relaxed">
              * Dimensions are standard. Fits may vary slightly based on style cuts.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
