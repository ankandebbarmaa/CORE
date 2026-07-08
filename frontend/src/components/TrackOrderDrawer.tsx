import React from "react";
import { X, Search, CheckCircle2, MapPin, Calendar, Box } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

export const TrackOrderDrawer: React.FC = () => {
  const {
    isTrackOrderOpen,
    setIsTrackOrderOpen,
    trackingId,
    setTrackingId,
    trackingStatus,
    setTrackingStatus,
    handleTrackQuery,
    isLoggedIn,
    userOrders,
    apiBase
  } = useShop();

  const handleRecentOrderTrack = async (orderId: string) => {
    setTrackingId(orderId);
    try {
      const res = await fetch(`${apiBase}/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingStatus(data);
      }
    } catch (err) {
      console.warn("Could not load tracking details:", err);
    }
  };

  // Auto-track the latest order when the drawer is opened
  React.useEffect(() => {
    if (isTrackOrderOpen && isLoggedIn && userOrders.length > 0 && !trackingId) {
      const latestOrder = userOrders[0];
      handleRecentOrderTrack(latestOrder.id);
    }
  }, [isTrackOrderOpen, isLoggedIn, userOrders]);

  return (
    <AnimatePresence>
      {isTrackOrderOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsTrackOrderOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />

          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[160] p-8 flex flex-col shadow-2xl overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-100">
              <h3 className="text-xl font-display font-black tracking-tight uppercase text-zinc-950">
                TRACK SHIPMENT
              </h3>
              <button 
                onClick={() => setIsTrackOrderOpen(false)} 
                className="p-2 text-zinc-400 hover:text-black transition-all hover:rotate-90 duration-300"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Tracking Search Input */}
            <form onSubmit={handleTrackQuery} className="space-y-4 mb-6">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                Enter Tracking Order ID
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="E.g., CR-8941" 
                  className="flex-grow p-4 bg-zinc-50 border border-zinc-200 focus:border-brand-primary outline-none font-bold text-[11px] tracking-widest uppercase rounded-sm"
                  required
                />
                <button 
                  type="submit"
                  className="bg-brand-black hover:bg-brand-primary text-white p-4 rounded-sm flex items-center justify-center transition-colors shadow-sm"
                  title="Search tracking code"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Logged in Recent Orders Quick Selector */}
            {isLoggedIn && userOrders.length > 0 && (
              <div className="mb-8 space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                  Or select from your recent orders
                </label>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto no-scrollbar border border-zinc-150 rounded-sm p-2 bg-zinc-50">
                  {userOrders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => handleRecentOrderTrack(order.id)}
                      className={`text-left p-2.5 rounded-sm border transition-all text-xs flex justify-between items-center bg-white hover:border-brand-primary cursor-pointer ${
                        trackingId === order.id ? "border-brand-primary ring-1 ring-brand-primary" : "border-zinc-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-950 uppercase">{order.id}</span>
                        <span className="text-[9px] text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="font-display font-black text-[9px] uppercase text-brand-primary">
                        {order.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Display Tracking Details */}
            {trackingStatus ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 flex-grow"
              >
                {/* Meta details */}
                <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-sm space-y-3 shadow-sm uppercase font-bold text-[9px] tracking-widest text-zinc-500">
                  <div className="flex items-center gap-2 text-zinc-800">
                    <Box size={14} className="text-brand-primary" />
                    <span>ID: <strong className="text-black text-xs font-display">{trackingStatus.id}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-primary" />
                    <span>Estimated Arrival: <strong className="text-zinc-800 text-[10px]">{trackingStatus.eta || "3-5 Business Days"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-accent animate-bounce" />
                    <span>Current Hub: <strong className="text-brand-accent text-[10px]">{trackingStatus.location || "WAREHOUSE"}</strong></span>
                  </div>
                </div>

                {/* Vertical Step Timeline */}
                <div className="space-y-5 pl-2">
                  <h5 className="font-display font-black text-[10px] tracking-[0.25em] text-zinc-300 uppercase">
                    FULFILLMENT MILESTONES
                  </h5>
                  
                  <div className="relative border-l border-zinc-150 pl-6 space-y-6 ml-2">
                    {trackingStatus.steps?.map((step: any, idx: number) => {
                      const isDone = step.done;
                      return (
                        <div key={idx} className="relative">
                          {/* Indicator Dot */}
                          <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                            isDone ? "border-brand-primary ring-4 ring-brand-primary/10" : "border-zinc-200"
                          }`}>
                            {isDone && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                          </div>

                          {/* Step Content */}
                          <div className="space-y-0.5">
                            <h6 className={`font-display font-black text-[10px] tracking-widest uppercase ${
                              isDone ? "text-brand-primary" : "text-zinc-300"
                            }`}>
                              {step.title}
                            </h6>
                            <p className="text-[9px] font-bold text-zinc-400">
                              {step.date !== "-" ? step.date : "Pending"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="py-16 text-center text-zinc-300 font-semibold text-xs uppercase tracking-widest border border-dashed border-zinc-200 rounded-sm p-4">
                No tracking status loaded. Please search for a valid order ID.
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
