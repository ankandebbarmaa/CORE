import React from "react";
import { Check, ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

// Colorful confetti shapes
const CONFETTI_COLORS = ["#ff3f6c", "#4f46e5", "#00ff66", "#ffb800", "#00d2ff"];
const CONFETTI_PARTICLES = Array.from({ length: 50 }).map((_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: Math.random() * 8 + 6,
  x: Math.random() * 100, // percentage width
  delay: Math.random() * 0.5,
  duration: Math.random() * 2 + 2,
  angle: Math.random() * 360,
  spinSpeed: Math.random() * 1080 - 540
}));

export const OrderSuccessAnimation: React.FC = () => {
  const {
    showOrderSuccess,
    setShowOrderSuccess,
    latestPlacedOrder,
    setIsTrackOrderOpen,
    setTrackingId,
    setTrackingStatus,
    formatPrice,
    apiBase
  } = useShop();

  const handleTrackClick = async () => {
    if (!latestPlacedOrder) return;
    const orderId = latestPlacedOrder.id;
    setTrackingId(orderId);
    
    // Fetch tracking details immediately
    try {
      const res = await fetch(`${apiBase}/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingStatus(data);
      }
    } catch (err) {
      console.warn("Could not load tracking status automatically:", err);
    }
    
    setShowOrderSuccess(false);
    setIsTrackOrderOpen(true);
  };

  return (
    <AnimatePresence>
      {showOrderSuccess && latestPlacedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowOrderSuccess(false)}
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md overflow-y-auto"
        >
          {/* Confetti Animation Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            {CONFETTI_PARTICLES.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ 
                  x: `${particle.x}vw`, 
                  y: "-5vh", 
                  rotate: 0,
                  opacity: 1
                }}
                animate={{ 
                  y: "105vh", 
                  rotate: particle.angle + particle.spinSpeed,
                  opacity: [1, 1, 0.8, 0]
                }}
                transition={{ 
                  delay: particle.delay, 
                  duration: particle.duration, 
                  ease: "easeOut" 
                }}
                style={{
                  position: "absolute",
                  width: particle.size,
                  height: particle.size * (Math.random() > 0.5 ? 1.5 : 1),
                  backgroundColor: particle.color,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px"
                }}
              />
            ))}
          </div>

          {/* Modal Success Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center relative border border-zinc-100 z-10 my-auto"
          >
            {/* Animated Bouncing Checkmark Circle with Pulser */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-500/25 ring-8 ring-emerald-500/5 relative"
              >
                {/* Outer shockwave ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ delay: 0.8, duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border border-emerald-500/30"
                />
                
                {/* SVG drawn path checkmark */}
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M20 6L9 17L4 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
            </div>

            <h3 className="text-2xl font-display font-black tracking-tight text-zinc-950 mb-2 uppercase">
              ORDER PLACED!
            </h3>
            <p className="text-zinc-500 text-xs font-semibold mb-6">
              Thank you for shopping with CORE. Your transaction was completed successfully.
            </p>

            <div className="bg-zinc-50 border border-zinc-150/60 rounded-xl p-4 mb-6 flex justify-between items-center text-left text-[11px] font-bold tracking-wider uppercase text-zinc-500">
              <span>Order ID:</span>
              <span className="text-zinc-950 font-display font-black text-xs">
                {latestPlacedOrder.id || "N/A"}
              </span>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleTrackClick}
                className="w-full bg-brand-primary text-white py-3.5 font-display font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 rounded-xl shadow-md cursor-pointer"
              >
                <Truck size={14} />
                <span>Track order</span>
              </button>
              <button
                onClick={() => setShowOrderSuccess(false)}
                className="w-full border border-zinc-200 text-zinc-600 hover:text-black py-3.5 font-display font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-colors rounded-xl cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
