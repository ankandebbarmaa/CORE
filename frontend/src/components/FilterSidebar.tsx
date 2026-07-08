import React from "react";
import { X } from "lucide-react";
import { useShop } from "../context/ShopContext";

const STATIC_COLORS = [
  { name: "Purple", hex: "#7C3AED" },
  { name: "Dark Grey", hex: "#1F2937" },
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Red", hex: "#DC2626" },
  { name: "Black", hex: "#000000" },
  { name: "Beige", hex: "#F5F5DC", border: true },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Pink", hex: "#FF69B4" },
  { name: "Electric Blue", hex: "#0000FF" },
  { name: "Silver", hex: "#C0C0C0", border: true },
  { name: "Neon Green", hex: "#39FF14" }
];

const STATIC_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "26", "28", "30", "32", "34", "36"];

export const FilterSidebar: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    activeGender,
    setActiveGender,
    selectedSort,
    setSelectedSort,
    maxPrice,
    setMaxPrice,
    selectedColors,
    toggleColorFilter,
    selectedSizes,
    toggleSizeFilter,
    clearFilters,
    filteredProducts,
    formatPrice
  } = useShop();

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-zinc-100 rounded-sm p-6 space-y-8 sticky top-28 h-fit max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
      {/* Filters Title */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
        <h4 className="font-display font-black text-sm tracking-widest uppercase">FILTERS</h4>
        <button 
          onClick={clearFilters}
          className="text-[10px] font-bold text-brand-accent hover:underline uppercase"
        >
          Clear All
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-3">
        <h5 className="font-display font-black text-[10px] tracking-[0.25em] text-zinc-400 uppercase">SORT BY</h5>
        <select 
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200/60 rounded-sm p-3 font-semibold text-[11px] outline-none text-zinc-700 focus:border-brand-primary transition-colors"
        >
          <option value="default">Default Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
          <option value="new">Fresh Arrivals First</option>
        </select>
      </div>

      {/* Category Section */}
      <div className="space-y-3">
        <h5 className="font-display font-black text-[10px] tracking-[0.25em] text-zinc-400 uppercase">CATEGORIES</h5>
        <div className="flex flex-col gap-2 font-semibold text-[11px] text-zinc-600">
          {["all", "tees", "hoodies", "jeans", "shirts"].map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer hover:text-black transition-colors uppercase">
              <input 
                type="radio"
                name="category-filter"
                checked={activeCategory === cat}
                onChange={() => setActiveCategory(cat)}
                className="w-4 h-4 accent-brand-accent cursor-pointer"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Section */}
      <div className="space-y-3">
        <h5 className="font-display font-black text-[10px] tracking-[0.25em] text-zinc-400 uppercase">GENDER</h5>
        <div className="flex flex-col gap-2 font-semibold text-[11px] text-zinc-600">
          {["all", "men", "women"].map(gen => (
            <label key={gen} className="flex items-center gap-2.5 cursor-pointer hover:text-black transition-colors uppercase">
              <input 
                type="radio"
                name="gender-filter"
                checked={activeGender === gen}
                onChange={() => setActiveGender(gen as any)}
                className="w-4 h-4 accent-brand-primary cursor-pointer"
              />
              <span>{gen}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h5 className="font-display font-black text-[10px] tracking-[0.25em] text-zinc-400 uppercase">MAX PRICE</h5>
          <span className="font-display font-black text-[11px] text-brand-primary">{formatPrice(maxPrice)}</span>
        </div>
        <input 
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-primary cursor-pointer"
        />
        <div className="flex justify-between text-[9px] font-bold text-zinc-400">
          <span>₹1,000</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Colors Swatches Section */}
      <div className="space-y-3">
        <h5 className="font-display font-black text-[10px] tracking-[0.25em] text-zinc-400 uppercase">COLORS</h5>
        <div className="grid grid-cols-5 gap-2">
          {STATIC_COLORS.map(color => {
            const isSelected = selectedColors.includes(color.hex);
            return (
              <button
                key={color.hex}
                onClick={() => toggleColorFilter(color.hex)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-105 border ${
                  isSelected ? "ring-2 ring-brand-primary ring-offset-2 scale-105" : "border-zinc-200"
                } ${color.border ? "shadow-inner" : ""}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {isSelected && (
                  <span className={`text-[9px] font-black ${
                    color.hex === "#FFFFFF" || color.hex === "#F5F5DC" || color.hex === "#C0C0C0" 
                      ? "text-black" : "text-white"
                  }`}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes Section */}
      <div className="space-y-3">
        <h5 className="font-display font-black text-[10px] tracking-[0.25em] text-zinc-400 uppercase">SIZES</h5>
        <div className="grid grid-cols-4 gap-1.5">
          {STATIC_SIZES.map(size => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSizeFilter(size)}
                className={`py-2 text-[10px] font-display font-black border transition-all rounded-sm ${
                  isSelected 
                    ? "bg-brand-black text-white border-brand-black scale-105 shadow-sm" 
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-black"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Item count helper */}
      <div className="pt-2 border-t border-zinc-100 text-center">
        <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
          {filteredProducts.length} ITEMS MATCHING
        </p>
      </div>
    </aside>
  );
};
