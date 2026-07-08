import React from "react";
import { useShop } from "../context/ShopContext";

interface Bubble {
  name: string;
  category: string;
  image: string;
  color: string;
}

const BUBBLES: Bubble[] = [
  {
    name: "Tees",
    category: "tees",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200",
    color: "border-[#ff3f6c]"
  },
  {
    name: "Hoodies",
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=200",
    color: "border-[#4f46e5]"
  },
  {
    name: "Jeans",
    category: "jeans",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200",
    color: "border-[#00ff66]"
  },
  {
    name: "Shirts",
    category: "shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=200",
    color: "border-[#f59e0b]"
  },
  {
    name: "New Drop",
    category: "New Arrival",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=200",
    color: "border-[#d946ef]"
  },
  {
    name: "Summer",
    category: "Summer Arrival",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=200",
    color: "border-[#06b6d4]"
  }
];

export const CategoryBubbles: React.FC = () => {
  const { activeCategory, setActiveCategory, clearFilters } = useShop();

  const handleBubbleClick = (category: string) => {
    if (activeCategory === category) {
      clearFilters();
    } else {
      clearFilters();
      setActiveCategory(category);
    }
    const target = document.getElementById("catalog-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full bg-white py-8 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="font-display font-black uppercase text-[10px] tracking-[0.3em] text-zinc-400 text-center mb-6">
          SHOP BY CATEGORY
        </h3>
        
        <div className="flex gap-6 md:gap-10 overflow-x-auto justify-start md:justify-center py-2 no-scrollbar select-none">
          {BUBBLES.map((bubble, i) => {
            const isActive = activeCategory === bubble.category;
            return (
              <div 
                key={i} 
                onClick={() => handleBubbleClick(bubble.category)}
                className="flex flex-col items-center gap-2.5 cursor-pointer group flex-shrink-0"
              >
                <div 
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 transition-all duration-300 transform group-hover:scale-105 ${
                    isActive ? `${bubble.color} shadow-lg ring-2 ring-zinc-100` : "border-zinc-200 group-hover:border-zinc-500"
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-zinc-50">
                    <img 
                      src={bubble.image} 
                      alt={bubble.name} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
                <span className={`text-[10px] sm:text-[11px] font-display font-black tracking-widest uppercase transition-colors ${
                  isActive ? "text-brand-primary" : "text-zinc-600 group-hover:text-black"
                }`}>
                  {bubble.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
