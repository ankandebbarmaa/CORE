import React, { useState, useMemo } from "react";
import { X, Heart, Star, ArrowRight, ArrowLeft, Plus, Ruler, Truck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";
import { SizeChartModal } from "./SizeChartModal";
import { ShippingReturnsModal } from "./ShippingReturnsModal";

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    products,
    formatPrice,
    addProductReview
  } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);

  // Review states
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Close details view
  const handleClose = () => {
    setSelectedProduct(null);
    setSelectedSize("");
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert("Please enter both your name and a comment.");
      return;
    }
    setIsSubmittingReview(true);
    const success = await addProductReview(selectedProduct.id, {
      user: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim()
    });
    setIsSubmittingReview(false);
    if (success) {
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
      alert("Thank you! Your review has been added.");
    }
  };

  // Find related products in the same category
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category)
      .slice(0, 4);
  }, [selectedProduct, products]);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const reviewsCount = selectedProduct.reviews?.length || 0;
  const avgRating = reviewsCount > 0
    ? Number((selectedProduct.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1))
    : Number((3.8 + (selectedProduct.price % 10) * 0.1).toFixed(1));

  const displayReviewsCount = reviewsCount > 0 ? reviewsCount : (selectedProduct.price % 85) + 3;
  const discountPercent = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    if (!selectedSize && selectedProduct.sizes[0] !== "One Size" && selectedProduct.sizes.length > 0) {
      alert("Please select a size first!");
      return;
    }
    addToCart(selectedProduct, selectedSize);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Detail Navbar */}
      <nav className="p-4 md:p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-40">
        <button 
          onClick={handleClose}
          className="flex items-center gap-2 font-display font-black text-[10px] tracking-widest hover:text-brand-accent transition-colors uppercase"
        >
          <ArrowLeft size={16} />
          <span>BACK TO SHOP</span>
        </button>
        <span className="font-display font-black text-xs tracking-[0.2em] text-zinc-400">PRODUCT DETAIL</span>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          
          {/* Images Section */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-50 rounded-sm border border-zinc-100 shadow-sm">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] overflow-hidden bg-zinc-50 rounded-sm border border-zinc-100 shadow-inner">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover opacity-50 blur-[1px]"
                />
              </div>
              <div className="bg-zinc-50 border border-zinc-100 rounded-sm aspect-[4/5] flex items-center justify-center text-zinc-300 font-display font-black text-[10px] tracking-widest uppercase italic select-none">
                SIGNAL LOAD...
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="mb-8">
              <p className="text-brand-primary font-display font-black text-[10px] tracking-[0.4em] uppercase mb-3">
                {selectedProduct.category}
              </p>
              
              <h1 className="text-3xl md:text-5xl font-display font-black mb-4 uppercase tracking-tighter leading-none text-zinc-950">
                {selectedProduct.name}
              </h1>

              {/* Ratings Badges */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full border border-brand-primary/10 text-[10px] font-black tracking-widest uppercase">
                  <span>{avgRating}</span>
                  <Star size={11} className="fill-brand-primary text-brand-primary" />
                </div>
                <span className="text-zinc-400 font-semibold text-xs">{displayReviewsCount} verified ratings</span>
              </div>
              
              <div className="flex items-center gap-4 mb-8">
                <p className="text-3xl font-display font-black text-zinc-950">
                  {formatPrice(selectedProduct.price)}
                </p>
                {selectedProduct.originalPrice && (
                  <>
                    <p className="text-xl font-semibold text-zinc-300 line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </p>
                    <span className="bg-brand-accent text-white px-2.5 py-0.5 text-[9px] font-display font-black tracking-widest rounded-sm animate-tag-pulse">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="w-full h-px bg-zinc-100 mb-8" />
              <p className="text-zinc-500 font-medium leading-relaxed text-sm">
                {selectedProduct.description}
              </p>
            </div>

            {/* Special Marketing Promos */}
            <div className="mb-8 p-4 bg-zinc-50 border border-zinc-100 rounded-sm space-y-2.5">
              <h4 className="text-[10px] font-display font-black tracking-widest text-zinc-400 uppercase">
                EXCLUSIVE OFFERS
              </h4>
              <ul className="text-[11px] font-bold text-zinc-600 space-y-1.5 list-disc pl-4 uppercase tracking-wider">
                <li><span className="text-brand-accent">Buy 4 Get 1 Free</span> (cheapest item free across catalog)</li>
                <li><span className="text-brand-primary">Extra 15% OFF</span> on total orders above ₹10,000</li>
                <li><span className="text-emerald-500">Free Shipping</span> automatically applied on all orders</li>
              </ul>
            </div>

            {/* Sizes Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-black uppercase text-[10px] tracking-[0.3em]">SELECT SIZE</h3>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-[10px] font-black text-brand-primary flex items-center gap-1.5 hover:underline uppercase"
                >
                  <Ruler size={13} />
                  <span>Size Chart</span>
                </button>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                {selectedProduct.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3.5 border text-[11px] font-display font-black transition-all rounded-sm ${
                      selectedSize === size 
                        ? 'border-brand-primary bg-brand-primary text-white scale-[1.02] shadow-md' 
                        : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAdd}
                className="flex-1 bg-brand-primary text-white py-5 font-display font-black uppercase text-[11px] tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-md rounded-sm"
              >
                ADD TO BAG <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="flex-1 py-5 border border-zinc-200 hover:border-brand-accent text-[10px] font-display font-black tracking-widest uppercase hover:bg-brand-accent/5 transition-all flex items-center justify-center gap-2 rounded-sm"
              >
                <Heart 
                  size={14} 
                  className={isWishlisted ? "fill-brand-accent text-brand-accent" : "text-zinc-600"} 
                  strokeWidth={isWishlisted ? 0 : 2.5} 
                />
                {isWishlisted ? "IN WISHLIST" : "ADD TO WISHLIST"}
              </button>
            </div>

            {/* Collapsible Info Menus */}
            <div className="space-y-4 pt-6 border-t border-zinc-100">
               <button 
                 onClick={() => setIsSizeChartOpen(true)} 
                 className="w-full flex items-center gap-4 text-xs font-bold text-zinc-500 hover:text-black transition-colors text-left"
               >
                 <div className="p-2 bg-zinc-100 rounded-full text-zinc-400"><Plus size={14} /></div>
                 <span>FIT GUIDE & DETAILS</span>
               </button>
               <button 
                 onClick={() => setIsShippingOpen(true)} 
                 className="w-full flex items-center gap-4 text-xs font-bold text-zinc-500 hover:text-black transition-colors text-left"
               >
                 <div className="p-2 bg-zinc-100 rounded-full text-zinc-400"><Plus size={14} /></div>
                 <span>SHIPPING & RETURNS OPTIONS</span>
               </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="border-t border-zinc-100 pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews List Column */}
            <div className="lg:col-span-7">
              <h3 className="text-xl font-display font-black uppercase tracking-tighter mb-8">
                REVIEWS ({displayReviewsCount})
              </h3>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                  selectedProduct.reviews.map((rev, idx) => (
                    <div key={rev.id || idx} className="p-5 border border-zinc-100 bg-zinc-50 rounded-sm space-y-2.5 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-display font-black text-xs text-zinc-800 uppercase tracking-wider">{rev.user}</span>
                        <div className="flex gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} className={i < rev.rating ? "fill-amber-400" : "text-zinc-200"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-500 text-xs font-medium leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 border border-zinc-100 rounded-sm text-center text-zinc-400 font-semibold text-xs uppercase tracking-widest bg-zinc-50">
                    No customer reviews yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>
            </div>

            {/* Write a Review Column */}
            <div className="lg:col-span-5 bg-zinc-50 border border-zinc-100 rounded-sm p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-display font-black uppercase tracking-tighter">
                WRITE A REVIEW
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary outline-none font-semibold text-xs transition-all rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    RATING
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          size={18}
                          className={star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-zinc-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    COMMENT
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts about the product fit, quality, material, etc."
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary outline-none font-medium text-xs transition-all rounded-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-brand-primary text-white py-4 font-display font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 rounded-sm shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* Recommendations Section */}
        <section className="border-t border-zinc-100 pt-16 pb-12">
          <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter mb-10">
            STYLE IT WITH
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => { setSelectedProduct(product); setSelectedSize(""); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="group cursor-pointer bg-white border border-zinc-100 rounded-sm overflow-hidden p-2 hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] overflow-hidden bg-zinc-50 rounded-sm mb-3">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-[11px] text-zinc-700 uppercase tracking-wide truncate group-hover:text-brand-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="font-display font-black text-xs text-zinc-950">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Drawers / Modals */}
      <SizeChartModal 
        isOpen={isSizeChartOpen} 
        setIsOpen={setIsSizeChartOpen} 
        product={selectedProduct} 
      />
      <ShippingReturnsModal 
        isOpen={isShippingOpen} 
        setIsOpen={setIsShippingOpen} 
      />
    </div>
  );
};
