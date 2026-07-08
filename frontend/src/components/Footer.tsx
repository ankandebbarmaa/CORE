import React from "react";
import { Instagram, Twitter, Facebook, Youtube, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { useShop } from "../context/ShopContext";

export const Footer: React.FC = () => {
  const { clearFilters, setActiveGender, setActiveCategory, setIsTrackOrderOpen } = useShop();

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
    <footer className="bg-white border-t border-zinc-100 p-12 md:p-20 mt-24">
      {/* Brand Trust Indicators */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-zinc-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-zinc-50 rounded-xl text-brand-primary">
            <ShieldCheck size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="font-bold text-[12px] uppercase tracking-wider text-zinc-950">100% Original Guarantee</h5>
            <p className="text-zinc-400 font-medium text-[11px] leading-relaxed mt-1">
              Every item sourced directly from designers. Premium quality checked and certified.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-zinc-50 rounded-xl text-brand-accent">
            <RefreshCw size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="font-bold text-[12px] uppercase tracking-wider text-zinc-950">Easy 14 Days Returns</h5>
            <p className="text-zinc-400 font-medium text-[11px] leading-relaxed mt-1">
              No questions asked return policy. Return online with simple step-by-step pickup.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-zinc-50 rounded-xl text-brand-secondary">
            <Truck size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="font-bold text-[12px] uppercase tracking-wider text-zinc-950">Free Shipping</h5>
            <p className="text-zinc-400 font-medium text-[11px] leading-relaxed mt-1">
              Complimentary express shipping across India on orders exceeding ₹1,999.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <h2 
            onClick={clearFilters}
            className="text-2xl font-display font-black tracking-[0.25em] text-zinc-950 hover:text-brand-primary transition-colors cursor-pointer select-none inline-block"
          >
            CORE
          </h2>
          <p className="text-zinc-400 font-medium text-[11px] leading-relaxed max-w-[240px]">
            CORE is the ultimate fashion destination for youth streetwear and designer drip, curated for maximum aesthetic expression.
          </p>
          <div className="pt-2">
            <h5 className="font-black uppercase text-[9px] tracking-[0.3em] text-zinc-300 mb-3">Newsletter</h5>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-[240px]">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-lg text-[10px] font-medium outline-none focus:border-zinc-400 w-full"
              />
              <button className="bg-zinc-950 hover:bg-zinc-800 text-white font-black text-[9px] tracking-[0.1em] uppercase px-4 py-2.5 rounded-lg transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Column 2: Online Shopping */}
        <div className="flex flex-col gap-5">
          <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-zinc-400">Online Shopping</h4>
          <nav className="flex flex-col gap-2.5 font-semibold text-[11px] text-zinc-500">
            <button onClick={() => handleGenderSelect("men")} className="text-left hover:text-brand-primary transition-colors">Men's Collection</button>
            <button onClick={() => handleGenderSelect("women")} className="text-left hover:text-brand-accent transition-colors">Women's Collection</button>
            <button onClick={() => handleGenderSelect("all")} className="text-left hover:text-zinc-950 transition-colors">Unisex Drip</button>
            <button onClick={() => handleCategorySelect("tees")} className="text-left hover:text-brand-primary transition-colors">Tees & Tops</button>
            <button onClick={() => handleCategorySelect("hoodies")} className="text-left hover:text-brand-accent transition-colors">Hoodies & Jackets</button>
            <button onClick={() => handleCategorySelect("jeans")} className="text-left hover:text-zinc-950 transition-colors">Cargos & Denim</button>
          </nav>
        </div>

        {/* Column 3: Customer Policies */}
        <div className="flex flex-col gap-5">
          <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-zinc-400">Customer Care</h4>
          <nav className="flex flex-col gap-2.5 font-semibold text-[11px] text-zinc-500">
            <button onClick={() => setIsTrackOrderOpen(true)} className="text-left hover:text-brand-primary transition-colors">Track Order</button>
            <a href="#" className="hover:text-zinc-950 transition-colors">Shipping & Delivery</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Returns & Refund Policy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms Of Use & Service</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy Policy & Safe Shopping</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Contact Support Team</a>
          </nav>
        </div>

        {/* Column 4: Contact & Socials */}
        <div className="flex flex-col gap-5">
          <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-zinc-400">Reach Us</h4>
          <div className="font-semibold text-[11px] text-zinc-500 space-y-1.5">
            <p className="text-zinc-950 font-bold">CORE Head Office</p>
            <p className="leading-relaxed">104, Cyber Heights, Sector 62, Noida, UP, India</p>
            <p className="pt-2">Email: <a href="mailto:help@core.in" className="text-zinc-950 hover:underline">help@core.in</a></p>
            <p>Call: <span className="text-zinc-950 font-bold">+91 1800-CORE-VIBE</span></p>
          </div>
          <div className="pt-2">
            <h5 className="font-black uppercase text-[9px] tracking-[0.3em] text-zinc-300 mb-3">Connect With Us</h5>
            <div className="flex gap-4 text-zinc-400">
              <Instagram className="hover:text-brand-accent cursor-pointer transition-colors hover:scale-110" size={18} />
              <Twitter className="hover:text-brand-primary cursor-pointer transition-colors hover:scale-110" size={18} />
              <Facebook className="hover:text-brand-primary cursor-pointer transition-colors hover:scale-110" size={18} />
              <Youtube className="hover:text-brand-accent cursor-pointer transition-colors hover:scale-110" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom / Payment Badges */}
      <div className="max-w-7xl mx-auto pt-10 mt-6 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
          © 2026 CORE INC. ALL RIGHTS RESERVED.
        </p>

        {/* Custom Premium Payment Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Visa */}
          <div className="h-8 w-14 bg-zinc-50/60 border border-zinc-200/50 rounded-lg flex items-center justify-center p-1.5 hover:bg-zinc-50 transition-colors">
            <svg className="h-full w-full" viewBox="0 0 48 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.1 0.3l-2.6 14.1h-2.9L11 3.5c-0.2-0.8-0.5-1.1-1.2-1.5C8.4 1.2 6.4 0.6 4 0.3v0.5c1.5 0.3 2.9 0.7 3.9 1.3 0.6 0.4 0.8 0.7 1 1.4l2.5 10.9h3L19.2 0.3h-0.1zM34.8 4.7c0-1.6-1-2.8-3.1-2.8-2.4 0-3.8 1.4-3.8 2.8 0 1.4 1.2 2.1 2.2 2.6 1 0.5 1.4 0.8 1.4 1.3 0 0.7-0.9 1.1-1.7 1.1-1.5 0-2.3-0.4-3-0.8l-0.4-0.2-0.4 2.7c0.8 0.4 2.2 0.7 3.7 0.7 3.3 0 5.4-1.6 5.4-4.1 0-1.4-0.8-2.4-2.8-3.3-1.2-0.6-1.9-1-1.9-1.6 0-0.5 0.6-1.1 1.9-1.1 1.1 0 1.9 0.2 2.5 0.5l0.3 0.1 0.4-2.5c-0.7-0.3-1.6-0.5-2.8-0.5M44 0.3h-2.3c-0.7 0-1.3 0.4-1.6 1.1L35 14.4h3l0.6-1.7h3.7l0.4 1.7H46L44 0.3zm-3.8 10l1.6-4.5 0.9 4.5h-2.5zM23.1 0.3h-2.8L18 14.4h3l2.1-14.1z" fill="#1434CB"/>
            </svg>
          </div>

          {/* Mastercard */}
          <div className="h-8 w-14 bg-zinc-50/60 border border-zinc-200/50 rounded-lg flex items-center justify-center p-1 hover:bg-zinc-50 transition-colors">
            <svg className="h-full w-auto" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#EB001B" />
              <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.85" />
            </svg>
          </div>

          {/* RuPay */}
          <div className="h-8 w-16 bg-zinc-50/60 border border-zinc-200/50 rounded-lg flex items-center justify-center p-1.5 hover:bg-zinc-50 transition-colors">
            <svg className="h-full w-full" viewBox="0 0 60 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="13" fontFamily="'Outfit', sans-serif" fontWeight="900" fontStyle="italic" fontSize="13" fill="#0A3E85">RuPay</text>
              <path d="M48 2 L53 2 L51 6 L55 6 L49 14 L50 8 L46 8 Z" fill="#E47C1B" />
            </svg>
          </div>

          {/* UPI */}
          <div className="h-8 w-14 bg-zinc-50/60 border border-zinc-200/50 rounded-lg flex items-center justify-center p-1.5 hover:bg-zinc-50 transition-colors">
            <svg className="h-full w-full" viewBox="0 0 45 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="4" y="13" fontFamily="'Outfit', sans-serif" fontWeight="900" fontStyle="italic" fontSize="13" fill="#097E43">UPI</text>
              <path d="M36 2 L40 2 L38 5 L42 5 L37 12 L38 7 L35 7 Z" fill="#E47C1B" />
            </svg>
          </div>

          {/* NetBanking */}
          <div className="h-8 px-2.5 bg-zinc-50/60 border border-zinc-200/50 rounded-lg flex items-center justify-center gap-1 hover:bg-zinc-50 transition-colors select-none">
            <svg className="h-3.5 w-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 17V7M15 17V7"/>
            </svg>
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-wider">NET BANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
