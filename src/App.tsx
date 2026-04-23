import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, Search, X, Plus, Minus, Trash2, ArrowRight, ArrowLeft, 
  Heart, Star, ChevronRight, ChevronDown, Instagram, Twitter, Facebook, Youtube,
  MoreVertical, Menu, User, Package, LogOut, CheckCircle2, Truck, Box
} from "lucide-react";
import { Product, CartItem } from "./types";
import { PRODUCTS } from "./constants";

const ImageWithFallback = ({ src, alt, className, ...props }: any) => {
  const [error, setError] = useState(false);
  const fallbackSrc = "https://images.unsplash.com/photo-1594931984428-2287ab67073b?auto=format&fit=crop&q=80&w=800";

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeGender, setActiveGender] = useState<"all" | "men" | "women">("all");
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  // Profile States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userName, setUserName] = useState("Protocol Member");

  // Track Order States
  const [trackingId, setTrackingId] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<any>(null);

  useEffect(() => {
    // Show popup after a delay, but more reliably
    const timer = setTimeout(() => {
      setShowPromoPopup(true);
    }, 4000);
    return () => clearTimeout(timer);
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
      
      const matchesMood = !activeMood || 
                         p.description.toLowerCase().includes(activeMood.toLowerCase()) ||
                         p.name.toLowerCase().includes(activeMood.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesGender && matchesMood;
    });
  }, [searchQuery, activeCategory, activeGender, activeMood]);

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
  const isDeepBrowsing = activeCategory !== "all" || searchQuery !== "" || activeGender !== "all" || activeMood !== null;

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    // Mock tracking logic
    setTrackingStatus({
      id: trackingId,
      status: "In Transit",
      location: "BENGALURU HUB",
      eta: "DEC 28, 2024",
      steps: [
        { title: "ORDER PLACED", date: "DEC 22", done: true },
        { title: "PACKED", date: "DEC 23", done: true },
        { title: "SHIPPED", date: "DEC 24", done: true },
        { title: "IN TRANSIT", date: "DEC 25", done: false },
        { title: "OUT FOR DELIVERY", date: "DEC 28", done: false },
      ]
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpSent) {
      if (otp === "1234") {
        setIsLoggedIn(true);
        setIsProfileOpen(false);
      } else {
        alert("Invalid Access Code. Try 1234");
      }
    } else {
      if (phoneNumber.length === 10) {
        setOtpSent(true);
      } else {
        alert("Enter a valid 10-digit number");
      }
    }
  };

  const Footer = () => (
    <footer className="bg-white border-t border-zinc-100 p-12 md:p-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div>
          <h2 className="text-2xl font-display font-black tracking-[0.2em] mb-6">CORE</h2>
          <p className="text-zinc-400 font-medium text-[11px] leading-relaxed max-w-[200px]">
            Premium streetwear essentials. Minimal design, high quality.
          </p>
        </div>
        <div className="flex flex-col gap-6">
           <h4 className="font-bold uppercase text-[9px] tracking-[0.3em] text-zinc-300">Information</h4>
           <nav className="flex flex-col gap-3 font-medium text-[11px] text-zinc-500">
             <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-black transition-colors">Refund Policy</a>
             <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-black transition-colors">Shipping Policy</a>
           </nav>
        </div>
        <div className="flex flex-col gap-6">
           <h4 className="font-bold uppercase text-[9px] tracking-[0.3em] text-zinc-300">Socials</h4>
           <div className="flex gap-6 text-zinc-400">
              <Instagram className="hover:text-black cursor-pointer transition-colors" size={20} />
              <Twitter className="hover:text-black cursor-pointer transition-colors" size={20} />
           </div>
        </div>
        <div>
           <h4 className="font-bold uppercase text-[9px] tracking-[0.3em] text-zinc-300 mb-6">Contact</h4>
           <p className="text-zinc-500 font-medium text-[11px]">help@core.in</p>
           <p className="text-zinc-500 font-medium text-[11px] mt-1">+91 1800-CORE-VIBE</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">© 2024 CORE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-pointer">
           <ImageWithFallback src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
           <ImageWithFallback src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
        </div>
      </div>
    </footer>
  );

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="p-4 md:p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white z-50">
          <button 
            onClick={() => { setSelectedProduct(null); setSelectedSize(""); window.scrollTo(0, 0); }}
            className="flex items-center gap-2 font-display font-black text-[10px] tracking-widest hover:text-zinc-500 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>BACK TO SHOP</span>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative scale-90 md:scale-100">
              <ShoppingBag size={24} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>
              )}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-4 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <ImageWithFallback 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full aspect-[4/5] object-cover rounded-sm bg-zinc-50"
              />
              <div className="grid grid-cols-2 gap-4">
                <ImageWithFallback src={selectedProduct.image} className="w-full aspect-[4/5] object-cover rounded-sm bg-zinc-50 opacity-50" />
                <div className="bg-zinc-50 rounded-sm aspect-[4/5] flex items-center justify-center text-zinc-300 font-display font-bold text-[10px] tracking-widest uppercase italic">SIGNAL LOAD...</div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col pt-4">
                  <div className="mb-10">
                    <p className="text-zinc-400 font-display font-bold text-[10px] tracking-[0.4em] uppercase mb-4">{selectedProduct.category}</p>
                    <h1 className="text-3xl md:text-5xl font-display font-black mb-4 uppercase tracking-tighter leading-tight">{selectedProduct.name}</h1>
                    <div className="flex items-center gap-4 mb-8">
                      <p className="text-2xl font-display font-black">{formatPrice(selectedProduct.price)}</p>
                      {selectedProduct.originalPrice && (
                        <p className="text-lg font-medium text-zinc-300 line-through">{formatPrice(selectedProduct.originalPrice)}</p>
                      )}
                      {selectedProduct.originalPrice && (
                        <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                          SALE
                        </span>
                      )}
                    </div>
                    <div className="w-full h-px bg-zinc-100 mb-8" />
                    <p className="text-zinc-500 font-medium leading-relaxed text-sm">{selectedProduct.description}</p>
                  </div>

              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-black uppercase text-[10px] tracking-[0.3em]">Select Size</h3>
                  <button className="text-[10px] font-bold text-zinc-400 underline underline-offset-4 hover:text-black transition-colors">SIZE CHART</button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                  {selectedProduct.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 md:py-4 border text-[11px] font-display font-black transition-all rounded-sm ${selectedSize === size ? 'border-black bg-black text-white' : 'border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-12">
                <button 
                  onClick={() => addToCart(selectedProduct, selectedSize)}
                  className="w-full bg-black text-white py-6 font-display font-black uppercase text-[11px] tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-4"
                >
                  ADD TO BAG <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className="w-full py-5 border border-zinc-200 text-[10px] font-display font-black tracking-widest uppercase hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                >
                  <Heart size={14} className={wishlist.includes(selectedProduct.id) ? "fill-black text-black" : "text-black"} strokeWidth={wishlist.includes(selectedProduct.id) ? 0 : 2} />
                  {wishlist.includes(selectedProduct.id) ? "IN WISHLIST" : "ADD TO WISHLIST"}
                </button>
              </div>

              <div className="space-y-6 pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                   <div className="p-2 bg-zinc-100 rounded-full"><Plus size={14} /></div>
                   <span>PRODUCT DETAILS</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                   <div className="p-2 bg-zinc-100 rounded-full"><Plus size={14} /></div>
                   <span>SHIPPING & RETURNS</span>
                </div>
              </div>
            </div>
          </div>

          <section className="border-t border-zinc-100 pt-24 pb-12">
            <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter mb-12">STYLE IT WITH</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {recommendedProducts.map(product => (
                <div key={product.id} onClick={() => { setSelectedProduct(product); setSelectedSize(""); window.scrollTo(0, 0); }} className="group cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden bg-zinc-50 rounded-sm mb-4">
                    <ImageWithFallback src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-[11px] uppercase tracking-wide group-hover:text-zinc-500 transition-colors">{product.name}</h4>
                    <p className="font-display font-black text-xs">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
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

      <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 px-6 py-4 flex flex-col items-center gap-4">
        <div className="w-full flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center bg-zinc-100 px-4 py-2 rounded-lg w-64 border border-zinc-200">
              <Search size={16} className="text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-[12px] w-full font-medium"
              />
            </div>
          </div>
          
          <h1 onClick={() => { setActiveCategory("all"); setActiveGender("all"); setSearchQuery(""); }} className="text-3xl font-display font-black cursor-pointer tracking-[0.2em] relative -left-4">CORE</h1>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors"
            >
              <User size={22} strokeWidth={1.5} />
              <span className="hidden sm:block font-bold text-[10px] tracking-[0.2em] uppercase">
                {isLoggedIn ? "PROFILE" : "LOGIN"}
              </span>
            </button>
            <button onClick={() => setIsWishlistOpen(true)} className="relative hover:scale-110 transition-transform">
              <Heart size={24} strokeWidth={1.5} className={wishlist.length > 0 ? "fill-black text-black" : "text-black"} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{wishlist.length}</span>
              )}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:scale-110 transition-transform">
              <ShoppingBag size={24} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden lg:flex gap-10 font-display font-bold uppercase text-[10px] tracking-[0.2em] items-center py-2">
          {["all", "men", "women"].map(gen => (
            <button key={gen} onClick={() => setActiveGender(gen as any)} className={`transition-all relative py-1 ${activeGender === gen ? 'text-black' : 'text-zinc-400 hover:text-black'}`}>
              {gen}
              {activeGender === gen && <motion.div layoutId="nav-line" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />}
            </button>
          ))}
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          {["tees", "hoodies", "footwear", "jeans", "shirts"].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`transition-all ${activeCategory === cat ? 'text-black' : 'text-zinc-400 hover:text-black'}`}>
              {cat}
            </button>
          ))}
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          <button 
            onClick={() => setIsTrackOrderOpen(true)}
            className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors"
          >
            <Package size={14} />
            <span>TRACK ORDER</span>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[110] p-8 flex flex-col lg:hidden shadow-2xl">
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-2xl font-display font-black tracking-[0.2em]">CORE</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400"><X size={24} strokeWidth={1.5} /></button>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex gap-2">
                  {["men", "women"].map(gen => (
                    <button key={gen} onClick={() => { setActiveGender(gen as any); setIsMobileMenuOpen(false); }} className={`flex-1 py-4 font-display font-black uppercase text-[10px] tracking-widest rounded-sm border transition-all ${activeGender === gen ? 'bg-black text-white border-black' : 'border-zinc-100 text-zinc-400'}`}>
                      {gen}
                    </button>
                   ))}
                </div>

                <div className="h-px bg-zinc-50 my-4" />
                
                {["all", "tees", "hoodies", "footwear", "jeans", "shirts"].map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setIsMobileMenuOpen(false); }} className={`text-left text-lg font-display font-black uppercase tracking-tight ${activeCategory === cat ? 'text-black' : 'text-zinc-300'}`}>
                    {cat}
                  </button>
                ))}

                <button 
                  onClick={() => { setIsTrackOrderOpen(true); setIsMobileMenuOpen(false); }} 
                  className="flex items-center gap-4 text-left text-lg font-display font-black uppercase tracking-tight text-zinc-400 hover:text-black border-t border-zinc-50 pt-6 mt-4"
                >
                  <Package size={24} />
                  <span>TRACK ORDER</span>
                </button>
              </div>

              <div className="mt-auto pt-10 border-t border-zinc-50">
                 <p className="text-[9px] font-bold uppercase text-zinc-300 tracking-[0.3em] mb-4">Core Streetwear Essentials</p>
                 <div className="flex gap-6 text-zinc-400">
                    <Instagram size={18} />
                    <Twitter size={18} />
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        {/* Conditional Hero Section: Multi-Banner Layout */}
        {!isDeepBrowsing ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 h-[90vh] md:h-[85vh] border-b border-zinc-100">
              <div className="relative overflow-hidden group cursor-pointer border-r border-zinc-100">
                <ImageWithFallback src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <h3 className="text-white text-5xl font-display font-black tracking-tighter leading-none mb-4">SUMMER<br/>SHIRTS</h3>
                  <button className="bg-white text-black px-6 py-3 font-display font-bold text-[10px] tracking-widest uppercase hover:bg-black hover:text-white transition-colors">STARTING AT ₹799</button>
                </div>
              </div>
              <div className="relative overflow-hidden group cursor-pointer border-r border-zinc-100">
                <ImageWithFallback src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <h3 className="text-white text-5xl font-display font-black tracking-tighter leading-none mb-4">EVERYDAY<br/>TROUSERS</h3>
                  <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest mb-6">Built for comfort, designed for style</p>
                  <button className="text-white border-b-2 border-white pb-1 font-display font-bold text-[10px] tracking-widest uppercase hover:text-white/70 transition-colors">EXPLORE NOW</button>
                </div>
              </div>
              <div className="relative overflow-hidden group cursor-pointer">
                <ImageWithFallback src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <h3 className="text-white text-5xl font-display font-black tracking-tighter leading-none mb-4">MUST-HAVE<br/>DENIMS</h3>
                  <div className="flex gap-4 mb-4">
                    <span className="text-white font-bold text-[10px] tracking-widest uppercase">BAGGY</span>
                    <span className="text-white font-bold text-[10px] tracking-widest uppercase opacity-50">RELAXED</span>
                  </div>
                  <button className="bg-white text-black px-6 py-3 font-display font-bold text-[10px] tracking-widest uppercase hover:bg-black hover:text-white transition-colors">SHOP DENIM</button>
                </div>
              </div>
            </section>

            {/* Gender Section (Bonkers Corner Style) */}
            <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh] border-b border-zinc-100">
              <div 
                onClick={() => { setActiveGender("men"); setActiveCategory("all"); setActiveMood(null); window.scrollTo(0, 0); }}
                className="relative group cursor-pointer overflow-hidden border-r border-zinc-100"
              >
                <ImageWithFallback src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Men" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-10 group-hover:translate-y-0 uppercase">Men</h3>
                  <button className="px-10 py-4 bg-white text-black font-display font-black text-[11px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100">EXPLORE ARCHIVE</button>
                </div>
              </div>
              <div 
                onClick={() => { setActiveGender("women"); setActiveCategory("all"); setActiveMood(null); window.scrollTo(0, 0); }}
                className="relative group cursor-pointer overflow-hidden"
              >
                <ImageWithFallback src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Women" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-10 group-hover:translate-y-0 uppercase">Women</h3>
                  <button className="px-10 py-4 bg-white text-black font-display font-black text-[11px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100">SHOP NEW DROP</button>
                </div>
              </div>
            </section>

            {/* Featured Categories (Snitch Style) */}
            <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
              <h2 className="text-center font-display font-black uppercase tracking-[0.3em] text-sm mb-16">Featured Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { name: "SHIRTS", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600", cat: "shirts" },
                    { name: "JEANS", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600", cat: "jeans" },
                    { name: "HOODIES", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600", cat: "hoodies" },
                    { name: "FOOTWEAR", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600", cat: "footwear" },
                    { name: "TEES", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", cat: "tees" },
                  ].map((cat, i) => (
                    <div key={i} onClick={() => setActiveCategory(cat.cat)} className="group cursor-pointer">
                      <div className="aspect-[4/5] overflow-hidden bg-zinc-100 rounded-sm mb-4">
                        <ImageWithFallback src={cat.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <p className="text-center font-display font-black text-[10px] tracking-widest uppercase">{cat.name}</p>
                    </div>
                  ))}
              </div>
            </section>

            {/* Match the Mood */}
            <section className="bg-zinc-50 py-24 border-y border-zinc-100">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-center font-display font-black uppercase tracking-[0.3em] text-sm mb-16">Match the Mood</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {[
                    { title: "LUXURY", sub: "REFINED", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600" },
                    { title: "BASICS", sub: "DAILY", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600" },
                    { title: "FORMAL", sub: "DRIP", img: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80&w=600" },
                    { title: "SUMMER", sub: "ESCAPE", img: "https://images.unsplash.com/photo-1603252109303-12751441dd157?auto=format&fit=crop&q=80&w=600" },
                    { title: "HOLIDAY", sub: "PICKS", img: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=600" },
                  ].map((mood, i) => (
                    <div 
                      key={i} 
                      onClick={() => { setActiveMood(mood.title); window.scrollTo(0, 0); }}
                      className="relative aspect-[3/4] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                    >
                      <ImageWithFallback src={mood.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <h4 className="text-3xl font-display font-black tracking-tighter mb-1">{mood.title}</h4>
                        <p className="text-[9px] font-bold tracking-[0.4em] opacity-80">{mood.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Category/Search Header Header with Banner */
          <section className="relative h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image based on category */}
            <div className="absolute inset-0">
               <ImageWithFallback 
                 src={
                   activeCategory === "hoodies" ? "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1920" :
                   activeCategory === "tees" ? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1920" :
                   activeCategory === "footwear" ? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1920" :
                   activeCategory === "jeans" ? "https://images.unsplash.com/photo-1620331307338-782f9191e600?auto=format&fit=crop&q=80&w=1920" :
                   activeCategory === "shirts" ? "https://images.unsplash.com/photo-1596755094514-f87034a26aa4?auto=format&fit=crop&q=80&w=1920" :
                   "https://images.unsplash.com/photo-1554412930-c74f6645391c?auto=format&fit=crop&q=80&w=1920"
                 } 
                 className="w-full h-full object-cover" 
               />
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter leading-none mb-6">
                  {searchQuery ? "Result" : (activeGender !== "all" ? `${activeGender}` : activeCategory)}
                </h2>
                <div className="flex flex-col items-center gap-6">
                  <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">Architectural Streetwear Collective</p>
                  <button 
                    onClick={() => { setActiveCategory("all"); setActiveGender("all"); setActiveMood(null); setSearchQuery(""); window.scrollTo(0, 0); }}
                    className="flex items-center gap-2 font-bold text-[10px] tracking-[0.2em] text-white hover:text-white/70 transition-colors underline underline-offset-8"
                  >
                    RETURN TO ARCHIVE
                  </button>
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
                <p className="text-black font-black text-xs uppercase tracking-widest mt-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-black"></span>
                  {filteredProducts.length} ITEMS FOUND
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { setSelectedProduct(product); window.scrollTo(0, 0); }} 
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 mb-4 transition-all rounded-sm">
                  <ImageWithFallback src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => toggleWishlist(product.id, e)} className="p-2 bg-white shadow-sm rounded-full hover:scale-110 transition-transform">
                      <Heart size={16} className={wishlist.includes(product.id) ? "fill-black text-black" : "text-black"} strokeWidth={wishlist.includes(product.id) ? 0 : 1.5} />
                    </button>
                  </div>
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-white text-black px-2 py-0.5 font-display font-black text-[9px] tracking-widest uppercase">
                      SALE
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-[12px] uppercase tracking-wide group-hover:text-zinc-500 transition-colors">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-[13px]">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-zinc-400 text-[11px] line-through font-medium">{formatPrice(product.originalPrice)}</span>
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

      <WishlistDrawer
        isWishlistOpen={isWishlistOpen}
        setIsWishlistOpen={setIsWishlistOpen}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        formatPrice={formatPrice}
        addToCart={addToCart}
      />

      <TrackOrderDrawer 
        isOpen={isTrackOrderOpen}
        setIsOpen={setIsTrackOrderOpen}
        trackingId={trackingId}
        setTrackingId={setTrackingId}
        handleTrack={handleTrackOrder}
        trackingStatus={trackingStatus}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        setIsOpen={setIsProfileOpen}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        otp={otp}
        setOtp={setOtp}
        otpSent={otpSent}
        setOtpSent={setOtpSent}
        handleLogin={handleLogin}
        userName={userName}
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl relative rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 aspect-[4/5] md:aspect-auto overflow-hidden bg-zinc-100">
                <ImageWithFallback src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Model" />
              </div>
              
              <div className="md:w-1/2 p-10 md:p-12 flex flex-col justify-center relative">
                <button 
                  onClick={() => setShowPromoPopup(false)}
                  className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-black transition-all"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
                
                <p className="font-display font-black text-[9px] tracking-[0.4em] text-zinc-400 mb-6 uppercase">Privileged Access</p>
                <h3 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-8 leading-tight uppercase">THE<br/>PROTOCOL<br/>OFFER</h3>
                
                <div className="space-y-4 mb-10">
                   <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                     Buy 4 Get 1 Free<br/>
                     + Extra 15% Savings
                   </p>
                   <div className="py-4 px-6 border border-zinc-100 bg-zinc-50 text-center font-display font-black text-xl tracking-[0.2em] uppercase">
                     CORE15
                   </div>
                </div>

                <button 
                  onClick={() => setShowPromoPopup(false)}
                  className="w-full bg-black text-white py-5 font-display font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-xl"
                >
                  COLLECT ACCESS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isCheckout && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-0 z-[200] bg-white overflow-y-auto p-6 md:p-12 lg:p-24 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex-grow">
              <button onClick={() => setIsCheckout(false)} className="flex items-center gap-2 font-display font-black text-[10px] tracking-widest mb-16 hover:opacity-50 transition-all uppercase">
                <ArrowLeft size={16} />
                <span>Return to Bag</span>
              </button>
              
              <h2 className="text-4xl md:text-6xl font-display font-black mb-20 uppercase tracking-tighter">Checkout</h2>
              
              <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
                <div className="space-y-16">
                   <div className="space-y-8">
                      <h3 className="font-display font-black text-[10px] uppercase tracking-[0.4em] text-zinc-300">01. Shipping Details</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="FULL NAME" className="w-full p-5 bg-zinc-50 border border-zinc-100 focus:border-black rounded-sm outline-none font-bold text-[11px] tracking-widest uppercase transition-all" />
                        <input type="email" placeholder="EMAIL ADDRESS" className="w-full p-5 bg-zinc-50 border border-zinc-100 focus:border-black rounded-sm outline-none font-bold text-[11px] tracking-widest uppercase transition-all" />
                      </div>
                   </div>
                   <div className="space-y-8">
                      <h3 className="font-display font-black text-[10px] uppercase tracking-[0.4em] text-zinc-300">02. Delivery Point</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="SHIPPING ADDRESS" className="w-full p-5 bg-zinc-50 border border-zinc-100 focus:border-black rounded-sm outline-none font-bold text-[11px] tracking-widest uppercase transition-all" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="CITY" className="w-full p-5 bg-zinc-50 border border-zinc-100 focus:border-black rounded-sm outline-none font-bold text-[11px] tracking-widest uppercase transition-all" />
                          <input type="text" placeholder="ZIP CODE" className="w-full p-5 bg-zinc-50 border border-zinc-100 focus:border-black rounded-sm outline-none font-bold text-[11px] tracking-widest uppercase transition-all" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-zinc-50 p-10 md:p-12 lg:p-16 rounded-sm h-fit sticky top-24 border border-zinc-100">
                   <h3 className="font-display font-black uppercase tracking-[0.4em] text-[10px] mb-12">Order Summary</h3>
                   <div className="space-y-6 mb-12 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar font-bold uppercase text-[10px] tracking-widest">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-zinc-500">
                           <span className="flex-grow truncate">{item.name} <span className="text-[8px] opacity-40 ml-2">x{item.quantity}</span></span>
                           <span className="text-black ml-4 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                   </div>
                    <div className="border-t border-zinc-200 pt-10 space-y-4 mb-10 text-[10px] tracking-widest font-bold uppercase">
                       <div className="flex justify-between text-zinc-400">
                         <span>Subtotal</span>
                         <span>{formatPrice(subtotal)}</span>
                       </div>
                       {totalDiscount > 0 && (
                         <div className="flex justify-between text-black">
                           <span>Promotional Adjustments</span>
                           <span>-{formatPrice(totalDiscount)}</span>
                         </div>
                       )}
                       <div className="flex justify-between text-zinc-400">
                         <span>Shipping</span>
                         <span className="text-black">FREE</span>
                       </div>
                       <div className="flex justify-between font-display font-black text-4xl tracking-tighter text-black pt-8 border-t border-zinc-200 mt-8 normal-case uppercase italic-none">
                         <span>TOTAL</span>
                         <span>{formatPrice(total)}</span>
                       </div>
                    </div>
                   <button className="w-full bg-black text-white py-6 font-display font-bold uppercase text-[11px] tracking-widest hover:opacity-90 transition-all transition-transform active:scale-[0.98]">PLACE ORDER</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileDrawer({ isOpen, setIsOpen, isLoggedIn, setIsLoggedIn, phoneNumber, setPhoneNumber, otp, setOtp, otpSent, setOtpSent, handleLogin, userName }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[350]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[360] p-8 md:p-12 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-display font-black tracking-tight uppercase">
                {isLoggedIn ? "Your Account" : "Access Archive"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-black transition-all">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {!isLoggedIn ? (
              <div className="flex flex-col flex-grow">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 mb-10 leading-relaxed">
                  Join the protocol for priority drops, exclusive access, and seamless fulfillment.
                </p>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Phone Number</label>
                    <div className="flex gap-2">
                       <div className="bg-zinc-50 border border-zinc-100 px-4 py-4 text-[11px] font-black">+91</div>
                       <input 
                         type="tel" 
                         value={phoneNumber}
                         onChange={(e) => setPhoneNumber(e.target.value)}
                         placeholder="00000 00000" 
                         className="flex-grow p-4 bg-zinc-50 border border-zinc-100 focus:border-black outline-none font-bold text-[11px] tracking-widest transition-all"
                         disabled={otpSent}
                       />
                    </div>
                  </div>

                  {otpSent && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Verification Code (Try 1234)</label>
                      <input 
                         type="text" 
                         value={otp}
                         onChange={(e) => setOtp(e.target.value)}
                         placeholder="XXXX" 
                         className="w-full p-4 bg-zinc-50 border border-zinc-100 focus:border-black outline-none font-bold text-[11px] tracking-widest transition-all text-center"
                       />
                    </motion.div>
                  )}

                  <button className="w-full bg-black text-white py-5 font-display font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all shadow-xl">
                    {otpSent ? "AUTHORIZE ACCESS" : "SEND CODE"}
                  </button>
                </form>
                
                {otpSent && (
                  <button onClick={() => setOtpSent(false)} className="mt-6 text-[9px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-all text-center underline underline-offset-4">Change Phone Number</button>
                )}
              </div>
            ) : (
              <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-6 mb-12 p-6 bg-zinc-50 border border-zinc-100 rounded-sm">
                   <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl font-black">
                     {userName[0]}
                   </div>
                   <div>
                      <h4 className="font-display font-black uppercase text-lg tracking-tight">{userName}</h4>
                      <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">+91 {phoneNumber}</p>
                   </div>
                </div>

                <div className="space-y-2 mb-12 flex-grow">
                   {[
                     { icon: ShoppingBag, label: "Your Orders" },
                     { icon: Heart, label: "My Wishlist" },
                     { icon: Package, label: "Global Tracking" },
                     { icon: Star, label: "Core Protocol points" },
                   ].map((item, idx) => (
                     <button key={idx} className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-all group border-b border-zinc-50">
                        <div className="flex items-center gap-4">
                           <item.icon size={18} className="text-zinc-300 group-hover:text-black transition-colors" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-black">{item.label}</span>
                        </div>
                        <ChevronRight size={14} className="text-zinc-200 group-hover:text-black translate-x-0 group-hover:translate-x-1 transition-all" />
                     </button>
                   ))}
                </div>

                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full border border-zinc-200 py-5 font-display font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-all flex items-center justify-center gap-4 text-zinc-400 hover:text-black"
                >
                  <LogOut size={16} />
                  LOGOUT PROTOCOL
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TrackOrderDrawer({ isOpen, setIsOpen, trackingId, setTrackingId, handleTrack, trackingStatus }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[450]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-[460] p-8 md:p-12 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-display font-black tracking-tight uppercase">Global Tracking</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-black transition-all">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 mb-10 leading-relaxed">
              Enter your unique shipment signal to track your fulfillment in real-time.
            </p>

            <form onSubmit={handleTrack} className="flex gap-2 mb-12">
              <input 
                type="text" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="ORDER ID (e.g. CR-5021)" 
                className="flex-grow p-5 bg-zinc-50 border border-zinc-100 focus:border-black outline-none font-bold text-[11px] tracking-widest transition-all"
              />
              <button className="bg-black text-white px-8 font-display font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all">
                SIGNAL
              </button>
            </form>

            <div className="flex-grow overflow-y-auto no-scrollbar">
              {trackingStatus ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-sm">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Order Signal</span>
                        <span className="text-[11px] font-black uppercase tracking-tight text-black">{trackingStatus.id}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Current Status</span>
                        <span className="text-[11px] font-black uppercase tracking-tight text-green-600 flex items-center gap-2">
                           <Truck size={14} />
                           {trackingStatus.status}
                        </span>
                     </div>
                  </div>

                  <div className="relative pl-10 space-y-12">
                     <div className="absolute left-[13px] top-2 bottom-2 w-px bg-zinc-100" />
                     {trackingStatus.steps.map((step: any, idx: number) => (
                       <div key={idx} className="relative">
                          <div className={`absolute -left-[37px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${step.done ? 'bg-black border-black border-4' : 'bg-white border-zinc-200'}`}>
                             {step.done && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div>
                             <h4 className={`text-[11px] font-black uppercase tracking-widest ${step.done ? 'text-black' : 'text-zinc-300'}`}>{step.title}</h4>
                             <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">{step.date} • {trackingStatus.location}</p>
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="p-6 border border-zinc-100 border-dashed rounded-sm text-center">
                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Expected Arrival: <span className="text-black font-black">{trackingStatus.eta}</span></p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                   <Box size={100} strokeWidth={0.5} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function WishlistDrawer({ isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, formatPrice, addToCart }: any) {
  const wishlistItems = useMemo(() => {
    return PRODUCTS.filter(p => wishlist.includes(p.id));
  }, [wishlist]);

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsWishlistOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[260] p-8 md:p-12 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-display font-black tracking-tight uppercase">Wishlist</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mt-2">{wishlistItems.length} items saved</p>
              </div>
              <button onClick={() => setIsWishlistOpen(false)} className="p-2 text-zinc-400 hover:text-black transition-all">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {wishlistItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-200 text-center">
                  <Heart size={80} strokeWidth={0.5} />
                  <p className="font-display font-black uppercase tracking-[0.2em] mt-8">Empty Signal</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {wishlistItems.map((product: any) => (
                    <div key={product.id} className="flex gap-6 group">
                      <div className="w-24 aspect-[4/5] overflow-hidden bg-zinc-50 rounded-sm flex-shrink-0">
                        <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col pt-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-bold text-[12px] uppercase tracking-wide">{product.name}</h4>
                          <button onClick={() => toggleWishlist(product.id)} className="text-zinc-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <p className="font-display font-black text-xs text-zinc-900 mt-1">{formatPrice(product.price)}</p>
                        
                        <button 
                          onClick={() => addToCart(product, product.sizes.includes("One Size") ? "One Size" : undefined)}
                          className="mt-4 w-full border border-black py-2 font-display font-black text-[9px] tracking-widest uppercase hover:bg-black hover:text-white transition-all"
                        >
                          MOVE TO BAG
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CartDrawer({ isCartOpen, setIsCartOpen, cart, updateQuantity, subtotal, totalDiscount, total, setIsCheckout, formatPrice }: any) {
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[160] p-8 md:p-12 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-display font-black tracking-tight uppercase">Your Bag</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mt-2">{cart.length} items collected</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-zinc-400 hover:text-black transition-all"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-200 text-center">
                  <ShoppingBag size={80} strokeWidth={0.5} />
                  <p className="font-display font-black uppercase tracking-[0.2em] mt-8">Your bag is empty</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item: any) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 aspect-[4/5] overflow-hidden bg-zinc-50 rounded-sm flex-shrink-0">
                        <ImageWithFallback src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col pt-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-bold text-[12px] uppercase tracking-wide">{item.name}</h4>
                          <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-zinc-300 hover:text-black"><Trash2 size={14} /></button>
                        </div>
                        <p className="font-display font-black text-xs text-zinc-900 mt-1">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center gap-4 mt-auto">
                           <div className="flex items-center gap-4 bg-zinc-50 px-3 py-1.5 rounded-sm border border-zinc-100">
                              <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-black text-zinc-400"><Minus size={12} /></button>
                              <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-black text-zinc-400"><Plus size={12} /></button>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-12 pt-8 border-t border-zinc-100">
                 <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-xs font-bold text-zinc-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-xs font-bold text-black">
                        <span>Discounts</span>
                        <span>-{formatPrice(totalDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-display font-black text-2xl tracking-tight text-black pt-4">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                 </div>
                 
                 <button 
                  onClick={() => { setIsCartOpen(false); setIsCheckout(true); }}
                  className="w-full bg-black text-white py-5 font-display font-bold uppercase text-[11px] tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-4"
                 >
                   CHECKOUT <ArrowRight size={16} />
                 </button>
                 
                 <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest text-center mt-6">Secure checkout powered by Protocol</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
