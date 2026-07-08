import React from "react";
import { ShoppingBag, Heart, User, Search, Menu, Package, X } from "lucide-react";
import { motion } from "motion/react";
import { useShop } from "../context/ShopContext";

export const Navbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeGender,
    setActiveGender,
    activeCategory,
    setActiveCategory,
    clearFilters,
    cart,
    wishlist,
    isLoggedIn,
    setIsProfileOpen,
    setIsWishlistOpen,
    setIsCartOpen,
    setIsTrackOrderOpen,
    setIsMobileMenuOpen
  } = useShop();

  const handleGenderSelect = (gender: "all" | "men" | "women") => {
    clearFilters();
    setActiveGender(gender);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Ticker Banner */}
      <div className="bg-zinc-950 text-white py-2.5 text-center text-[10px] font-black uppercase tracking-[0.2em] relative z-[60] overflow-hidden">
        <motion.div 
          animate={{ x: [20, -20, 20] }} 
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        >
          🔥 PROTOCOL DEALS: BUY 4 GET 1 FREE + EXTRA 15% OFF ON ₹10,000+ • CODE: CORE15
        </motion.div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 px-6 py-4 flex flex-col items-center gap-4 transition-all duration-300">
        <div className="w-full flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center bg-zinc-50 hover:bg-zinc-100 px-4 py-2.5 rounded-full w-64 border border-zinc-200/50 transition-colors">
              <Search size={16} className="text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search for products, brands, trends, styles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-[12px] w-full font-medium placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-black">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          
          <h1 
            onClick={clearFilters} 
            className="text-3xl font-display font-black cursor-pointer tracking-[0.25em] text-zinc-950 hover:text-brand-primary transition-colors select-none"
          >
            CORE
          </h1>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 text-zinc-500 hover:text-brand-accent transition-colors group"
            >
              <User size={22} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              <span className="hidden sm:block font-black text-[10px] tracking-[0.2em] uppercase">
                {isLoggedIn ? "ACCOUNT" : "LOGIN"}
              </span>
            </button>
            
            <button 
              onClick={() => setIsWishlistOpen(true)} 
              className="relative hover:scale-110 transition-transform text-zinc-500 hover:text-brand-accent"
            >
              <Heart 
                size={23} 
                strokeWidth={1.5} 
                className={wishlist.length > 0 ? "fill-brand-accent text-brand-accent" : ""} 
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative hover:scale-110 transition-transform text-zinc-500 hover:text-brand-primary"
            >
              <ShoppingBag size={23} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <nav className="hidden lg:flex gap-8 font-display font-bold uppercase text-[10px] tracking-[0.2em] items-center py-1.5">
          {["all", "men", "women"].map(gen => (
            <button 
              key={gen} 
              onClick={() => handleGenderSelect(gen as any)} 
              className={`transition-all relative py-1 ${activeGender === gen ? 'text-brand-primary font-black scale-105' : 'text-zinc-400 hover:text-black'}`}
            >
              {gen}
              {activeGender === gen && (
                <motion.div layoutId="nav-line" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
          ))}
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          {["tees", "hoodies", "jeans", "shirts"].map(cat => (
            <button 
              key={cat} 
              onClick={() => handleCategorySelect(cat)} 
              className={`transition-all ${activeCategory === cat ? 'text-brand-accent font-black scale-105' : 'text-zinc-400 hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          <button 
            onClick={() => setIsTrackOrderOpen(true)}
            className="flex items-center gap-2 text-zinc-400 hover:text-brand-primary transition-colors font-black"
          >
            <Package size={14} />
            <span>TRACK ORDER</span>
          </button>
        </nav>
      </header>
    </>
  );
};
