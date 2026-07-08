import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

interface Banner {
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  image: string;
  category: string;
  theme: string; // color styling
}

const BANNERS: Banner[] = [
  {
    title: "SUMMER ARRIVALS",
    subtitle: "COOL BREEZE LINENS & SHIRTS",
    badge: "FLAT 40% OFF",
    description: "Upgrade your wardrobe with lightweight, breathable styles tailored for comfort.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600",
    category: "shirts",
    theme: "from-[#ff3f6c]/30 to-[#4f46e5]/40"
  },
  {
    title: "STREET CULTURE",
    subtitle: "OVERSIZED HOODIES & TEES",
    badge: "GEN-Z HOT DRIPS",
    description: "Premium cotton drops featuring boxy fits, drop shoulders, and high density prints.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1600",
    category: "hoodies",
    theme: "from-[#0052ff]/30 to-[#00ff66]/20"
  },
  {
    title: "TACTICAL DENIMS",
    subtitle: "RELAXED & TACTICAL JEANS",
    badge: "BUY 4 GET 1 FREE",
    description: "Urban utility cargowear and vintage acid wash denims built for daily city modular life.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1600",
    category: "jeans",
    theme: "from-[#ff9f00]/30 to-[#ff3f6c]/40"
  }
];

export const HeroCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const { setActiveCategory, clearFilters } = useShop();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex(prev => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setIndex(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleShopNow = (cat: string) => {
    clearFilters();
    setActiveCategory(cat);
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-zinc-900 border-b border-zinc-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <img 
            src={BANNERS[index].image} 
            alt={BANNERS[index].title} 
            className="w-full h-full object-cover object-top select-none"
          />
          {/* Custom Vibrant Gradients Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-r ${BANNERS[index].theme} via-black/40 to-black/70`} />

          {/* Interactive Banner Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 max-w-7xl mx-auto text-white">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4 md:space-y-6 max-w-2xl"
            >
              <div className="inline-block bg-brand-accent text-white px-3 py-1 font-display font-black text-[10px] tracking-[0.2em] rounded-sm uppercase select-none animate-tag-pulse">
                {BANNERS[index].badge}
              </div>
              <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-none uppercase">
                {BANNERS[index].title}
              </h2>
              <p className="text-brand-secondary font-display font-bold text-xs md:text-sm tracking-[0.25em] uppercase">
                {BANNERS[index].subtitle}
              </p>
              <p className="text-zinc-300 font-medium text-xs md:text-sm leading-relaxed max-w-md hidden sm:block">
                {BANNERS[index].description}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleShopNow(BANNERS[index].category)}
                  className="bg-white text-zinc-900 px-8 py-3.5 md:px-10 md:py-4 font-display font-black text-[10px] tracking-[0.2em] uppercase hover:bg-brand-accent hover:text-white transition-all hover:scale-105 active:scale-95 duration-300 shadow-xl"
                >
                  SHOP NOW
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all border border-white/10 hidden md:block hover:scale-105"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all border border-white/10 hidden md:block hover:scale-105"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${index === i ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
};
