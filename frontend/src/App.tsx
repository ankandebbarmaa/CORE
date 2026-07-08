import React from "react";
import { X, Search, Package, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ShopProvider, useShop } from "./context/ShopContext";

// Modular Component Imports
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HeroCarousel } from "./components/HeroCarousel";
import { CategoryBubbles } from "./components/CategoryBubbles";
import { FilterSidebar } from "./components/FilterSidebar";
import { ProductGrid } from "./components/ProductGrid";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { CartDrawer } from "./components/CartDrawer";
import { WishlistDrawer } from "./components/WishlistDrawer";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { TrackOrderDrawer } from "./components/TrackOrderDrawer";
import { CheckoutView } from "./components/CheckoutView";
import { PromoPopup } from "./components/PromoPopup";
import { MyOrdersView } from "./components/MyOrdersView";
import { OrderSuccessAnimation } from "./components/OrderSuccessAnimation";

const MainLayout: React.FC = () => {
  const [isMyOrdersOpen, setIsMyOrdersOpen] = React.useState(false);
  const {
    activeCategory,
    setActiveCategory,
    activeGender,
    setActiveGender,
    searchQuery,
    setSearchQuery,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsTrackOrderOpen,
    clearFilters,
    filteredProducts
  } = useShop();

  const isDeepBrowsing = activeCategory !== "all" || searchQuery !== "" || activeGender !== "all";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between">
      {/* Navbar header */}
      <Navbar />

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden" 
            />
            <motion.div 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 220 }} 
              className="fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white z-[110] p-6 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10 pb-3 border-b border-zinc-100">
                <h2 className="text-xl font-display font-black tracking-[0.2em] text-zinc-950">CORE</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-2 text-zinc-400 hover:text-black transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col gap-5 flex-grow">
                <div className="flex gap-2">
                  {["men", "women"].map(gen => (
                    <button 
                      key={gen} 
                      onClick={() => { clearFilters(); setActiveGender(gen as any); setIsMobileMenuOpen(false); }} 
                      className={`flex-grow py-3 font-display font-black uppercase text-[10px] tracking-widest rounded-sm border transition-all ${
                        activeGender === gen ? 'bg-brand-primary text-white border-brand-primary shadow-sm' : 'border-zinc-200 text-zinc-400'
                      }`}
                    >
                      {gen}
                    </button>
                  ))}
                </div>

                <div className="h-px bg-zinc-100 my-2" />
                
                {["all", "tees", "hoodies", "jeans", "shirts"].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => { clearFilters(); setActiveCategory(cat); setIsMobileMenuOpen(false); }} 
                    className={`text-left text-sm font-display font-black uppercase tracking-widest py-1.5 transition-colors ${
                      activeCategory === cat ? 'text-brand-accent' : 'text-zinc-400 hover:text-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                <button 
                  onClick={() => { setIsTrackOrderOpen(true); setIsMobileMenuOpen(false); }} 
                  className="flex items-center gap-3 text-left text-sm font-display font-black uppercase tracking-widest text-zinc-500 hover:text-brand-primary border-t border-zinc-150 pt-5 mt-4"
                >
                  <Package size={18} />
                  <span>TRACK ORDER</span>
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                 <p className="text-[9px] font-bold uppercase text-zinc-300 tracking-[0.25em] mb-2">
                   CORE ARCHIVES STREETWEAR
                 </p>
                 <span className="text-[8px] text-zinc-400 uppercase font-medium">Inspired by Ajio, Myntra, and Snitch</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {/* Banner Carousels & Highlights (only on home main feed) */}
        {!isDeepBrowsing ? (
          <>
            <HeroCarousel />
            <CategoryBubbles />

            {/* Special Marketing Steals Banners (Ajio style) */}
            <section className="py-10 px-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Promo Card 1 */}
                <div 
                  onClick={() => setActiveCategory("shirts")}
                  className="cursor-pointer group relative h-60 md:h-72 overflow-hidden rounded-sm bg-zinc-800 border border-zinc-100 shadow-md flex items-center p-8 md:p-12 text-white"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1596755094514-f87034a26aa4?auto=format&fit=crop&q=80&w=800" 
                    alt="Shirts Promo"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  
                  <div className="relative z-10 space-y-3">
                    <span className="bg-brand-accent px-2 py-0.5 rounded-sm font-display font-black text-[9px] tracking-widest uppercase">
                      STEALS OF THE DAY
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter leading-none">
                      LINEN COMFORT
                    </h3>
                    <p className="text-brand-secondary font-display font-bold text-[10px] tracking-widest">
                      FLAT 40% OFF ZONE
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-white hover:text-brand-accent transition-colors pt-2 uppercase">
                      <span>SHOP COLLECTION</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>

                {/* Promo Card 2 */}
                <div 
                  onClick={() => setActiveCategory("jeans")}
                  className="cursor-pointer group relative h-60 md:h-72 overflow-hidden rounded-sm bg-zinc-800 border border-zinc-100 shadow-md flex items-center p-8 md:p-12 text-white"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800" 
                    alt="Jeans Promo"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  
                  <div className="relative z-10 space-y-3">
                    <span className="bg-brand-primary px-2 py-0.5 rounded-sm font-display font-black text-[9px] tracking-widest uppercase">
                      TREND ALERT
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter leading-none">
                      TACTICAL CARGOS
                    </h3>
                    <p className="text-brand-secondary font-display font-bold text-[10px] tracking-widest">
                      BUY 4 GET 1 FREE APPLIED
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-white hover:text-brand-primary transition-colors pt-2 uppercase">
                      <span>SHOP DENIM</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </>
        ) : (
          /* Deep Category / Search Header */
          <section className="relative h-[25vh] md:h-[35vh] flex flex-col items-center justify-center overflow-hidden border-b border-zinc-100">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff3f6c] via-[#4f46e5] to-[#0052ff] opacity-90" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white space-y-4">
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none">
                {searchQuery ? `SEARCH: "${searchQuery}"` : (activeGender !== "all" ? `${activeGender}'s ${activeCategory === "all" ? "collection" : activeCategory}` : activeCategory)}
              </h2>
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={clearFilters}
                  className="flex items-center gap-2 font-black text-[9px] tracking-[0.2em] text-white hover:text-white/80 transition-all underline underline-offset-4 uppercase"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Mobile quick scroll filter headers */}
        <div className="lg:hidden p-4 border-b flex gap-2.5 overflow-x-auto bg-white sticky top-[68px] z-40 no-scrollbar shadow-sm">
          {["all", "tees", "hoodies", "jeans", "shirts", "New Arrival", "Summer Arrival"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`whitespace-nowrap px-5 py-2 rounded-full font-display font-black uppercase text-[9px] tracking-widest border transition-all ${
                activeCategory === cat 
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                  : 'bg-zinc-50 text-zinc-500 border-zinc-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Product Feed Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto p-6 md:p-12 lg:py-16 scroll-mt-24">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Sidebar filter panel (Desktop) */}
            <div className="hidden lg:block">
              <FilterSidebar />
            </div>

            {/* Right Product Grid */}
            <div className="flex-grow space-y-8">
              {/* Grid Header Info */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
                  <Sparkles size={12} className="text-brand-accent animate-pulse" />
                  <span>{filteredProducts.length} PRODUCTS DETECTED</span>
                </p>
                
                {/* Mobile direct filter toggle button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden border border-zinc-200 rounded-sm px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Filters
                </button>
              </div>

              {/* Grid listing */}
              <ProductGrid />
            </div>
          </div>
        </section>
      </main>

      {/* Footer info */}
      <Footer />

      {/* Overlay Drawers & Modals */}
      <ProductDetailsModal />
      <CartDrawer />
      <WishlistDrawer />
      <ProfileDrawer onMyOrdersClick={() => setIsMyOrdersOpen(true)} />
      <TrackOrderDrawer />
      <CheckoutView />
      <PromoPopup />
      <MyOrdersView isOpen={isMyOrdersOpen} setIsOpen={setIsMyOrdersOpen} />
      <OrderSuccessAnimation />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
