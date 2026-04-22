import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, Search, X, Plus, Minus, Trash2, ArrowRight, ArrowLeft, 
  Heart, Star, ChevronRight, ChevronDown, Instagram, Twitter, Facebook, Youtube,
  MoreVertical, Menu
} from "lucide-react";
import { Product, CartItem } from "./types";
import { PRODUCTS } from "./constants";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeGender, setActiveGender] = useState<"all" | "men" | "women">("all");
  const [isCheckout, setIsCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPromo");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPromoPopup(true);
        sessionStorage.setItem("hasSeenPromo", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const searchStr = searchQuery.toLowerCase().trim();
      
      // Improved search: matches name, category, description, and tags
      const matchesSearch = !searchStr || 
                           p.name.toLowerCase().includes(searchStr) || 
                           p.category.toLowerCase().includes(searchStr) ||
                           p.description.toLowerCase().includes(searchStr) ||
                           p.id.toLowerCase().includes(searchStr);
      
      let matchesCategory = activeCategory === "all" || p.category === activeCategory;
      
      if (activeCategory === "Summer Arrival") {
        matchesCategory = p.description.toLowerCase().includes("summer");
      } else if (activeCategory === "New Arrival") {
        matchesCategory = p.description.toLowerCase().includes("new arrival");
      } else if (activeCategory === "Linen Shirt Man") {
        matchesCategory = p.name.toLowerCase().includes("linen");
      }

      const matchesGender = activeGender === "all" ? true : (p.gender === activeGender);
      
      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [searchQuery, activeCategory, activeGender]);

  const recommendedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return PRODUCTS.filter(p => p.id !== selectedProduct.id && (p.category === selectedProduct.category)).slice(0, 4);
  }, [selectedProduct]);

  const addToCart = (product: Product, size?: string) => {
    if (!size && product.sizes[0] !== "One Size" && product.sizes.length > 0) {
      alert("Please select a size first");
      return;
    }
    setCart(prev => {
      const id = size ? `${product.id}-${size}` : product.id;
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, id, quantity: 1, name: size ? `${product.name} (${size})` : product.name }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Buy 4 Get 1 Free logic: Cheapest items are free for every 5 items in cart
  const calculateDiscounts = () => {
    let discountAmount = 0;
    const itemsList: Product[] = [];
    cart.forEach(item => {
      for(let i = 0; i < item.quantity; i++) itemsList.push(item);
    });

    // Sort by price ascending to free the cheapest ones
    itemsList.sort((a, b) => a.price - b.price);
    const freeItemsCount = Math.floor(itemsList.length / 5);
    for(let i = 0; i < freeItemsCount; i++) {
      discountAmount += itemsList[i].price;
    }

    // Additional 15% off if subtotal after BOGO is still > ₹10,000
    if ((subtotal - discountAmount) > 10000) {
      discountAmount += (subtotal - discountAmount) * 0.15;
    }

    return discountAmount;
  };

  const totalDiscount = calculateDiscounts();
  const total = subtotal - totalDiscount;

  const heroImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1539109132381-31a1a9a23991?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920"
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Determine if we should show the hero/marquee
  const isDeepBrowsing = activeCategory !== "all" || searchQuery !== "" || activeGender !== "all";

  const Footer = () => (
    <footer className="bg-zinc-950 text-white p-12 md:p-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        <div>
          <h2 className="text-4xl font-black italic mb-8 tracking-tighter">CORE</h2>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
            Internship Project Store • 2024 Protocol
          </p>
        </div>
        <div className="flex flex-col gap-6">
           <h4 className="font-bold uppercase text-[10px] tracking-[0.4em] text-zinc-400">Links</h4>
           <nav className="flex flex-col gap-4 font-bold uppercase text-[11px]">
             <a href="#" className="hover:text-brand-accent transition-colors">Archive</a>
             <a href="#" className="hover:text-brand-accent transition-colors">New Drop</a>
             <a href="#" className="hover:text-brand-accent transition-colors">Size Guide</a>
           </nav>
        </div>
        <div className="flex flex-col gap-6">
           <h4 className="font-bold uppercase text-[10px] tracking-[0.4em] text-zinc-400">Socials</h4>
           <div className="flex gap-8">
              <Instagram className="hover:text-brand-accent cursor-pointer transition-colors" size={24} />
              <Twitter className="hover:text-brand-accent cursor-pointer transition-colors" size={24} />
              <Facebook className="hover:text-brand-accent cursor-pointer transition-colors" size={24} />
           </div>
        </div>
        <div>
           <h4 className="font-bold uppercase text-[10px] tracking-[0.4em] text-zinc-400 mb-8">Access</h4>
           <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Signal: help@core.in</p>
           <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-2">Line: +91 999 888 7777</p>
        </div>
      </div>
    </footer>
  );

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-50">
          <button 
            onClick={() => { setSelectedProduct(null); setSelectedSize(""); window.scrollTo(0, 0); }}
            className="flex items-center gap-2 font-black hover:text-brand-accent transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">BACK TO ALL PRODUCTS</span>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 font-black">
              <ShoppingBag size={20} />
              <span>BAG ({cart.length})</span>
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 md:p-12">
          <div className="lg:flex lg:gap-16 mb-24">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full aspect-[3/4] object-cover rounded-xl shadow-sm border"
              />
            </div>

            <div className="lg:w-1/2 flex flex-col pt-4">
                  <div className="mb-10">
                    <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter italic">{selectedProduct.name}</h1>
                    <div className="flex items-center gap-4 mb-6">
                      <p className="text-3xl font-black text-brand-accent italic">{formatPrice(selectedProduct.price)}</p>
                      {selectedProduct.originalPrice && (
                        <p className="text-xl font-bold text-zinc-300 line-through italic">{formatPrice(selectedProduct.originalPrice)}</p>
                      )}
                      {selectedProduct.originalPrice && (
                        <span className="bg-brand-accent text-white px-2 py-1 text-[10px] font-black rounded-sm uppercase tracking-widest">
                          {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-600 leading-relaxed mb-8">{selectedProduct.description}</p>
                  </div>

              <div className="mb-8">
                <h3 className="font-black mb-4 uppercase text-xs tracking-widest flex justify-between">
                  <span>SELECT SIZE</span>
                  <span className="text-zinc-400 font-bold underline cursor-pointer">Fit Guide</span>
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {selectedProduct.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 border-2 font-black transition-all rounded-md ${selectedSize === size ? 'border-black bg-black text-white' : 'border-zinc-200 hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mb-12">
                <button 
                  onClick={() => addToCart(selectedProduct, selectedSize)}
                  className="flex-grow bg-black text-white py-6 font-black uppercase text-sm tracking-widest hover:bg-brand-accent transition-all rounded-md shadow-xl active:scale-95"
                >
                  ADD TO LOADOUT
                </button>
                <button 
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-6 border-2 rounded-md transition-all ${wishlist.includes(selectedProduct.id) ? 'bg-brand-accent border-brand-accent text-white' : 'border-zinc-300'}`}
                >
                  <Heart className={wishlist.includes(selectedProduct.id) ? "fill-current" : ""} />
                </button>
              </div>

              <div className="border-t pt-10">
                <h3 className="font-black mb-8 uppercase text-xs tracking-widest">Customer Signal ({selectedProduct.reviews.length})</h3>
                <div className="space-y-6">
                  {selectedProduct.reviews.map(review => (
                    <div key={review.id} className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm uppercase">{review.user}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-zinc-600 text-sm italic font-medium">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <section className="border-t pt-24 pb-12">
              <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-12">Recommended Items</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {recommendedProducts.map(product => (
                  <div key={product.id} onClick={() => { setSelectedProduct(product); setSelectedSize(""); window.scrollTo(0, 0); }} className="group cursor-pointer">
                    <div className="aspect-[3/4] overflow-hidden rounded-xl border mb-6 bg-zinc-50 group-hover:shadow-2xl transition-all">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-black uppercase text-[11px] tracking-tight">{product.name}</h4>
                      <p className="font-black text-sm text-brand-accent italic">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
        
        <Footer />
        <CartDrawer isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} cart={cart} updateQuantity={updateQuantity} total={total} setIsCheckout={setIsCheckout} formatPrice={formatPrice} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-zinc-950 text-white py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] relative z-[60] overflow-hidden">
        <motion.div animate={{ x: [20, -20, 20] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
          PROTOCOL OFFER: BUY 4 GET 1 FREE + EXTRA 15% OFF ON ₹10,000+ • CODE: CORE15
        </motion.div>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b p-4 md:p-6 lg:px-12 flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 onClick={() => { setActiveCategory("all"); setActiveGender("all"); setSearchQuery(""); }} className="text-3xl md:text-4xl font-black italic cursor-pointer tracking-tighter">CORE</h1>
          <nav className="hidden lg:flex gap-8 font-black uppercase text-[11px] tracking-[0.2em] items-center">
            {["all", "men", "women"].map(gen => (
              <button key={gen} onClick={() => setActiveGender(gen as any)} className={`transition-all ${activeGender === gen ? 'text-brand-accent scale-110' : 'text-zinc-500 hover:text-black'}`}>
                {gen}
              </button>
            ))}
            <div className="w-px h-4 bg-zinc-200 mx-2" />
            {["hoodies", "tees", "footwear"].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`transition-all ${activeCategory === cat ? 'text-brand-accent' : 'text-zinc-500 hover:text-black'}`}>
                {cat}
              </button>
            ))}
            
            <div className="relative p-2" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
              <button className={`flex items-center gap-2 transition-all ${["Summer Arrival", "New Arrival", "Linen Shirt Man"].includes(activeCategory) ? 'text-brand-accent underline underline-offset-8' : 'text-zinc-500 hover:text-black'}`}>
                COLLECTIONS <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[80%] left-0 bg-white border-2 border-black p-4 w-64 flex flex-col gap-4 shadow-[15px_15px_0_rgba(0,0,0,0.05)] z-[60]">
                    <button onClick={() => { setActiveCategory("Summer Arrival"); setIsDropdownOpen(false); }} className={`text-left font-black text-[10px] hover:text-brand-accent py-1 ${activeCategory === "Summer Arrival" ? "text-brand-accent" : ""}`}>SUMMER ARRIVAL</button>
                    <button onClick={() => { setActiveCategory("New Arrival"); setIsDropdownOpen(false); }} className={`text-left font-black text-[10px] hover:text-brand-accent py-1 ${activeCategory === "New Arrival" ? "text-brand-accent" : ""}`}>NEW ARRIVAL</button>
                    <button onClick={() => { setActiveCategory("Linen Shirt Man"); setIsDropdownOpen(false); }} className={`text-left font-black text-[10px] hover:text-brand-accent py-1 ${activeCategory === "Linen Shirt Man" ? "text-brand-accent" : ""}`}>LINEN SHIRT MAN</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-6 flex-grow justify-end">
          <div className="flex items-center bg-zinc-50 px-3 md:px-6 py-2 rounded-full border-2 border-zinc-100 focus-within:border-black transition-all w-full max-w-[120px] sm:max-w-xs md:max-w-md lg:max-w-sm">
            <Search size={14} className="text-zinc-400 mr-2 md:mr-3 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="SEARCH..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-[9px] md:text-[10px] w-full uppercase font-black placeholder:text-zinc-300"
            />
            {searchQuery && <X size={12} className="cursor-pointer text-zinc-400 ml-1" onClick={() => setSearchQuery("")} />}
          </div>
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-black text-white p-3 md:px-6 md:py-3 rounded-full font-black text-[10px] md:text-xs hover:bg-brand-accent transition-all shadow-xl active:scale-95 flex-shrink-0">
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">({cart.length})</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-[110] p-8 flex flex-col lg:hidden border-r shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black italic tracking-tighter">CORE</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-zinc-100 rounded-full"><X size={20} /></button>
              </div>
              
              <div className="flex flex-col gap-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-2">GENDER</h3>
                <div className="flex gap-4">
                  {["men", "women"].map(gen => (
                    <button key={gen} onClick={() => { setActiveGender(gen as any); setIsMobileMenuOpen(false); }} className={`flex-1 py-4 border-2 font-black uppercase italic text-sm rounded-xl ${activeGender === gen ? 'bg-black text-white border-black' : 'border-zinc-200'}`}>
                      {gen}
                    </button>
                  ))}
                </div>

                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mt-6 mb-2">Sections</h3>
                {["all", "hoodies", "tees", "footwear"].map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setIsMobileMenuOpen(false); }} className={`text-left text-xl font-black uppercase italic ${activeCategory === cat ? 'text-brand-accent' : 'text-zinc-950'}`}>
                    {cat}
                  </button>
                ))}
                
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mt-10 mb-2">Collections</h3>
                <button onClick={() => { setActiveCategory("Summer Arrival"); setIsMobileMenuOpen(false); }} className={`text-left text-xl font-black uppercase italic ${activeCategory === "Summer Arrival" ? "text-brand-accent" : "text-zinc-950"}`}>Summer Arrival</button>
                <button onClick={() => { setActiveCategory("New Arrival"); setIsMobileMenuOpen(false); }} className={`text-left text-xl font-black uppercase italic ${activeCategory === "New Arrival" ? "text-brand-accent" : "text-zinc-950"}`}>New Arrival</button>
                <button onClick={() => { setActiveCategory("Linen Shirt Man"); setIsMobileMenuOpen(false); }} className={`text-left text-xl font-black uppercase italic ${activeCategory === "Linen Shirt Man" ? "text-brand-accent" : "text-zinc-950"}`}>Linen Shirt Man</button>
              </div>

              <div className="mt-auto pt-10 border-t space-y-4">
                 <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-loose">Internship Project Store • Protocol 2024</p>
                 <div className="flex gap-4">
                    <Instagram size={18} />
                    <Twitter size={18} />
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        {/* Conditional Hero Section: Only show if NOT deep browsing */}
        {!isDeepBrowsing ? (
          <>
            <section className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-zinc-900 border-b-4 border-black">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={heroIndex} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img src={heroImages[heroIndex]} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                </motion.div>
              </AnimatePresence>

              <button onClick={() => setHeroIndex(p => (p-1+heroImages.length)%heroImages.length)} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-20 md:h-20 border-2 border-white/30 hover:border-white rounded-full flex items-center justify-center transition-all bg-white/5 backdrop-blur-md text-white group"><ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" /></button>
              <button onClick={() => setHeroIndex(p => (p+1)%heroImages.length)} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-20 md:h-20 border-2 border-white/30 hover:border-white rounded-full flex items-center justify-center transition-all bg-white/5 backdrop-blur-md text-white group"><ArrowRight size={32} className="group-hover:translate-x-1 transition-transform" /></button>

              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 z-10 pointer-events-none">
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-black tracking-[0.6em] uppercase mb-6 text-brand-accent">INTERNSHIP PROJECT STORE 2024</motion.p>
                <motion.h2 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl md:text-[10rem] font-black mb-10 tracking-tighter leading-none italic uppercase drop-shadow-2xl">CORE<br/>ESSENTIALS</motion.h2>
                <div className="pointer-events-auto">
                  <button className="bg-white text-black px-16 py-7 font-black uppercase text-xs hover:bg-brand-accent hover:text-white transition-all rounded-sm shadow-2xl active:scale-95">EXPLORE COLLECTION</button>
                </div>
              </div>
            </section>

            {/* Small Text-Only Marquee Section */}
            <section className="py-4 bg-black overflow-hidden border-b-2 border-black">
              <div className="flex whitespace-nowrap">
                <motion.div 
                  animate={{ x: [0, -1000] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="flex gap-12 items-center"
                >
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center gap-12">
                      <span className="text-white font-black uppercase italic tracking-[0.2em] text-[10px]">
                        WE ARE OFFERING FREE DELIVERY TODAY • LIMITED TIME • EXPEDITED SHIPPING •
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Men/Women Split Section */}
            <section className="py-12 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setActiveGender("men")}
                  className="group relative h-[60vh] overflow-hidden rounded-3xl cursor-pointer border-4 border-black"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Men Collection"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-12">
                    <h3 className="text-white text-6xl font-black italic tracking-tighter mb-4">MEN</h3>
                    <p className="text-white/80 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      EXPLORE CURATED STREETWEAR <ArrowRight size={16} />
                    </p>
                  </div>
                </div>
                <div 
                  onClick={() => setActiveGender("women")}
                  className="group relative h-[60vh] overflow-hidden rounded-3xl cursor-pointer border-4 border-black"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Women Collection"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-12 text-right items-end">
                    <h3 className="text-white text-6xl font-black italic tracking-tighter mb-4">WOMEN</h3>
                    <p className="text-white/80 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                       <ArrowLeft size={16} /> NEW DROP NOW LIVE
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Sticky Discount Banner */}
            <section className="bg-brand-accent p-12 lg:p-24 overflow-hidden relative border-y-4 border-black">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                <div className="text-white max-w-2xl">
                  <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-none">BUY 4 GET 1 FREE</h2>
                  <p className="text-xl font-black uppercase tracking-[0.2em] mb-4">LIMITED PROTOCOL DEPLOYMENT</p>
                  <p className="text-white/70 font-bold max-w-lg">Add any 5 items to your loadout and the cheapest one will be automatically deducted. Extra 15% off applied instantly on orders over ₹10,000.</p>
                </div>
                <div className="bg-white p-12 rounded-3xl border-4 border-black shadow-[20px_20px_0_rgba(0,0,0,1)] rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                  <p className="text-black font-black text-4xl mb-2 tracking-tighter italic whitespace-nowrap">CODE: CORE15</p>
                  <div className="w-full h-1 bg-black/10 my-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Apply at checkout for extra savings</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none -rotate-12 translate-x-20">
                <h2 className="text-[20rem] font-black italic text-white leading-none">CORE</h2>
              </div>
            </section>
          </>
        ) : (
          /* Category/Search Header Header */
          <section className="py-20 md:py-24 bg-zinc-50 border-b-2 border-black">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-5xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-6 break-words">
                  {searchQuery ? "Search Results" : activeGender !== "all" ? activeGender : activeCategory}
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button 
                    onClick={() => { setActiveCategory("all"); setActiveGender("all"); setSearchQuery(""); window.scrollTo(0, 0); }}
                    className="flex items-center gap-2 font-black text-[10px] hover:text-brand-accent transition-colors bg-white px-6 py-3 rounded-full border-2 border-black"
                  >
                    <ArrowLeft size={16} /> RESET VIEW
                  </button>
                  {searchQuery && (
                    <span className="px-6 py-3 rounded-full bg-black text-white font-black text-[8px] md:text-[10px] tracking-[0.2em] uppercase">
                      Query: {searchQuery}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        <div className="lg:hidden p-4 border-b flex gap-3 overflow-x-auto bg-white sticky top-[72px] z-40 no-scrollbar">
          {["all", "Summer Arrival", "New Arrival", "Linen Shirt Man", "tees", "hoodies", "footwear"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-6 py-2.5 rounded-full font-black uppercase text-[10px] border-2 transition-all ${activeCategory === cat ? 'bg-black text-white border-black' : 'bg-white text-zinc-500 border-zinc-100'}`}>
              {cat}
            </button>
          ))}
        </div>

        <section className="p-6 md:p-16 lg:px-24 min-h-[60vh]">
          {/* Header section adjusted for deep browsing */}
          {!isDeepBrowsing && (
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  Collection
                </h3>
                <p className="text-brand-accent font-black text-xs uppercase tracking-widest mt-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-brand-accent"></span>
                  {filteredProducts.length} ITEMS FOUND
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-12">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { setSelectedProduct(product); window.scrollTo(0, 0); }} 
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-zinc-50 mb-4 md:mb-6 border-2 border-transparent transition-all group-hover:border-black group-hover:shadow-[20px_20px_60px_rgba(0,0,0,0.1)]">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <button onClick={(e) => toggleWishlist(product.id, e)} className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 bg-white/90 rounded-full shadow-lg border-2 border-transparent hover:border-brand-accent transition-all">
                    <Heart size={16} className={wishlist.includes(product.id) ? "fill-brand-accent text-brand-accent" : "text-black/20"} />
                  </button>
                </div>
                    <div className="flex flex-col md:flex-row justify-between items-start px-2 gap-1">
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <h4 className="font-black text-[10px] md:text-[12px] uppercase tracking-tight group-hover:text-brand-accent transition-colors truncate leading-tight">{product.name}</h4>
                        <p className="text-zinc-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[10px] md:text-sm italic text-zinc-900 whitespace-nowrap">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-[8px] md:text-[10px] font-bold text-zinc-300 line-through italic leading-none">{formatPrice(product.originalPrice)}</p>
                        )}
                      </div>
                    </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-40 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-8">
                <Search size={32} className="text-zinc-200" strokeWidth={1} />
              </div>
              <p className="font-black uppercase tracking-[0.3em] text-zinc-300 text-sm">Negative Entry: No Signal Detected</p>
              <p className="text-[10px] font-bold text-zinc-400 mt-4 max-w-xs mx-auto">Try adjusting your filters or checking your search parameters for better telemetry.</p>
              <button 
                onClick={() => { setActiveCategory("all"); setSearchQuery(""); }} 
                className="mt-12 bg-black text-white px-10 py-4 font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:bg-brand-accent transition-all active:scale-95 shadow-xl"
              >
                Reset Visuals
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <CartDrawer 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen} 
        cart={cart} 
        updateQuantity={updateQuantity} 
        subtotal={subtotal} 
        totalDiscount={totalDiscount}
        total={total} 
        setIsCheckout={setIsCheckout} 
        formatPrice={formatPrice} 
      />

      {/* Promotional Pop-up */}
      <AnimatePresence>
        {showPromoPopup && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowPromoPopup(false)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl relative rounded-3xl overflow-hidden border-8 border-black shadow-[30px_30px_0_rgba(0,0,0,1)]"
            >
              <button 
                onClick={() => setShowPromoPopup(false)}
                className="absolute top-6 right-6 p-2 bg-zinc-100 rounded-full hover:bg-black hover:text-white transition-all z-20"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-12 bg-brand-accent text-white flex flex-col justify-center">
                  <h3 className="text-5xl font-black italic tracking-tighter mb-4 leading-none">UNLOCK SAVINGS</h3>
                  <p className="font-black uppercase tracking-[0.2em] text-xs mb-8">Limited Protocol Access</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-accent font-black text-xs italic">1</div>
                      <p className="font-bold text-sm">Buy 4 Get 1 Free Today</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-accent font-black text-xs italic">2</div>
                      <p className="font-bold text-sm">Extra 15% OFF (Auto-Applied)</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-accent font-black text-xs italic">3</div>
                      <p className="font-bold text-sm">Free Express Transit</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-4">Copy Promo Code</p>
                  <div className="border-4 border-dashed border-zinc-200 p-6 rounded-2xl text-center mb-8 bg-zinc-50">
                    <span className="text-3xl font-black italic tracking-tighter">CORE15</span>
                  </div>
                  <button 
                    onClick={() => setShowPromoPopup(false)}
                    className="bg-black text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-brand-accent transition-all active:scale-95"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isCheckout && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-0 z-[200] bg-white overflow-y-auto p-6 md:p-12 lg:p-24 flex flex-col max-w-screen">
            <div className="max-w-7xl mx-auto w-full flex-grow">
              <button onClick={() => setIsCheckout(false)} className="flex items-center gap-2 font-black mb-16 hover:text-brand-accent group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs uppercase tracking-widest">BACK TO BAG</span>
              </button>
              
              <h2 className="text-7xl md:text-9xl font-black mb-20 italic underline decoration-brand-accent decoration-8 underline-offset-[20px]">CHECKOUT</h2>
              
              <div className="grid lg:grid-cols-2 gap-32">
                <div className="space-y-16">
                   <div className="space-y-8">
                      <h3 className="font-black text-[11px] uppercase tracking-[0.5em] text-zinc-300 mb-10">01. SHIPPING INFORMATION</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="FULL NAME" className="w-full p-6 bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl outline-none uppercase font-black text-xs transition-all" />
                        <input type="email" placeholder="EMAIL ADDRESS" className="w-full p-6 bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl outline-none uppercase font-black text-xs transition-all" />
                      </div>
                   </div>
                   <div className="space-y-8">
                      <h3 className="font-black text-[11px] uppercase tracking-[0.5em] text-zinc-300 mb-10">02. DELIVERY ADDRESS</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="SHIPPING ADDRESS" className="w-full p-6 bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl outline-none uppercase font-black text-xs transition-all" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="CITY" className="w-full p-6 bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl outline-none uppercase font-black text-xs transition-all" />
                          <input type="text" placeholder="ZIP CODE" className="w-full p-6 bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl outline-none uppercase font-black text-xs transition-all" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-zinc-950 text-white p-12 lg:p-16 rounded-3xl h-fit sticky top-24 shadow-2xl border-4 border-black">
                   <h3 className="font-black uppercase tracking-[0.5em] text-[10px] text-brand-accent mb-12">Order Summary</h3>
                   <div className="space-y-4 mb-12 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-xs items-center group">
                           <span className="font-black opacity-30 italic">{item.quantity}×</span>
                           <span className="flex-grow ml-5 font-black truncate text-zinc-200 group-hover:text-white transition-colors">{item.name}</span>
                           <span className="font-black text-brand-accent">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                   </div>
                    <div className="border-t-2 border-white/5 pt-12 space-y-4 mb-12">
                       <div className="flex justify-between text-zinc-500 font-black text-[10px] tracking-widest uppercase">
                         <span>Items Subtotal</span>
                         <span>{formatPrice(subtotal)}</span>
                       </div>
                       {totalDiscount > 0 && (
                         <div className="flex justify-between text-brand-accent font-black text-[10px] tracking-widest uppercase">
                           <span>Total Discounts Applied</span>
                           <span>-{formatPrice(totalDiscount)}</span>
                         </div>
                       )}
                       <div className="flex justify-between text-zinc-500 font-black text-[10px] tracking-widest uppercase">
                         <span>Shipping</span>
                         <span className="text-green-500">FREE</span>
                       </div>
                       <div className="flex justify-between text-6xl md:text-7xl font-black italic pt-12 tracking-tighter text-brand-accent">
                         <span>TOTAL</span>
                         <span>{formatPrice(total)}</span>
                       </div>
                       {totalDiscount > 0 && (
                         <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] italic text-right mt-2 animate-pulse">
                           SAVED {formatPrice(totalDiscount)} WITH EXCLUSIVE OFFERS
                         </p>
                       )}
                    </div>
                   <button className="w-full bg-brand-accent text-white py-10 rounded-xl font-black uppercase text-sm tracking-widest transition-all hover:bg-white hover:text-black active:scale-95 shadow-2xl">PLACE ORDER</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CartDrawer({ isCartOpen, setIsCartOpen, cart, updateQuantity, subtotal, totalDiscount, total, setIsCheckout, formatPrice }: any) {
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[150]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-xl bg-white z-[160] p-10 md:p-16 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h3 className="text-6xl font-black underline italic tracking-tighter leading-none">ORDER</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mt-2 italic decoration-brand-accent decoration-2 underline-offset-4">Cart Status Active</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-4 bg-zinc-100 rounded-full hover:bg-black hover:text-white transition-all shadow-lg active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center scale-90">
                  <ShoppingBag size={120} strokeWidth={0.5} />
                  <p className="font-black uppercase tracking-[0.5em] mt-10">LOADOUT EMPTY</p>
                  <p className="text-xs font-bold mt-2">NO SIGNALS DETECTED IN BAG</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {cart.map((item: any) => (
                    <div key={item.id} className="flex gap-8 group">
                      <div className="w-32 aspect-[3/4] overflow-hidden rounded-xl border-2 border-zinc-100 group-hover:border-black transition-all flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-grow flex flex-col py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-lg uppercase tracking-tighter italic">{item.name}</h4>
                          <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-zinc-300 hover:text-brand-accent"><Trash2 size={16} /></button>
                        </div>
                        <p className="font-black text-brand-accent italic mb-6">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center gap-6 mt-auto">
                           <div className="flex items-center gap-5 bg-zinc-50 px-4 py-2 rounded-lg border">
                              <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-brand-accent"><Minus size={14} /></button>
                              <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-brand-accent"><Plus size={14} /></button>
                           </div>
                           <p className="font-black text-xs uppercase tracking-widest text-zinc-300">Sum: {formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-16 border-t-4 border-black pt-12">
                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between font-black uppercase text-[11px] tracking-widest opacity-40">
                      <span>Sub-Loadout</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between font-black uppercase text-[11px] tracking-widest text-brand-accent">
                        <span>Protocol Savings (B4G1 + 15%)</span>
                        <span className="animate-pulse">-{formatPrice(totalDiscount)}</span>
                      </motion.div>
                    )}
                    <div className="flex justify-between font-black text-5xl md:text-7xl italic tracking-tighter text-black mt-4">
                      <span>TOTAL</span>
                      <span className={totalDiscount > 0 ? "text-brand-accent" : ""}>{formatPrice(total)}</span>
                    </div>
                 </div>
                 
                 <button 
                  onClick={() => { setIsCartOpen(false); setIsCheckout(true); }}
                  className="w-full bg-black text-white py-10 font-black uppercase text-sm tracking-[0.3em] hover:bg-brand-accent transition-all rounded-xl shadow-[20px_20px_0px_rgba(0,0,0,0.05)] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-4 group"
                 >
                   PHASE TO CHECKOUT <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                 </button>
                 
                 <div className="mt-8 flex justify-center items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-300">
                    <span>SSL SECURE</span>
                    <div className="w-1 h-1 bg-zinc-200 rounded-full"/>
                    <span>EXPRESS TRANSIT</span>
                    <div className="w-1 h-1 bg-zinc-200 rounded-full"/>
                    <span>NO RECOIL RETURNS</span>
                 </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
