import React, { useState, useEffect } from "react";
import { X, Package, Trash2, Calendar, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

interface MyOrdersViewProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({ isOpen, setIsOpen }) => {
  const {
    userOrders,
    fetchUserOrders,
    cancelOrder,
    phoneNumber,
    formatPrice,
    setTrackingId,
    setTrackingStatus,
    setIsTrackOrderOpen,
    apiBase
  } = useShop();

  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  useEffect(() => {
    if (isOpen && phoneNumber) {
      fetchUserOrders();
    }
  }, [isOpen, phoneNumber]);

  // Separate active (pending shipment) and past (delivered or cancelled) orders
  const activeOrders = userOrders.filter(
    o => o.status !== "Delivered" && o.status !== "Cancelled"
  );
  
  const pastOrders = userOrders.filter(
    o => o.status === "Delivered" || o.status === "Cancelled"
  );

  const displayedOrders = activeTab === "active" ? activeOrders : pastOrders;

  const handleTrackClick = async (orderId: string) => {
    setTrackingId(orderId);
    setIsOpen(false); // Close My Orders history drawer

    // Fetch tracking details
    try {
      const res = await fetch(`${apiBase}/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingStatus(data);
      }
    } catch (err) {
      console.warn("Could not load tracking details:", err);
    }
    setIsTrackOrderOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed": return "text-blue-500 bg-blue-50 border-blue-100";
      case "Packed": return "text-indigo-500 bg-indigo-50 border-indigo-100";
      case "Shipped": return "text-purple-500 bg-purple-50 border-purple-100";
      case "In Transit": return "text-amber-500 bg-amber-50 border-amber-100";
      case "Out for Delivery": return "text-orange-500 bg-orange-50 border-orange-100";
      case "Delivered": return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case "Cancelled": return "text-rose-500 bg-rose-50 border-rose-100";
      default: return "text-zinc-500 bg-zinc-50 border-zinc-100";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />

          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white z-[160] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <div>
                <h3 className="text-xl font-display font-black tracking-tight uppercase text-zinc-950">
                  MY ORDERS
                </h3>
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 mt-1 uppercase">
                  Order history for +91 {phoneNumber}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-zinc-400 hover:text-black transition-colors hover:rotate-90 duration-300"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Tabs Controller */}
            <div className="flex border-b border-zinc-150 text-[10px] font-black uppercase tracking-widest bg-zinc-50/50">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-4 text-center border-b-2 transition-all ${
                  activeTab === "active" 
                    ? "border-brand-primary text-brand-primary bg-white font-black" 
                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}
              >
                Active Orders ({activeOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`flex-1 py-4 text-center border-b-2 transition-all ${
                  activeTab === "past" 
                    ? "border-brand-primary text-brand-primary bg-white font-black" 
                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}
              >
                Past History ({pastOrders.length})
              </button>
            </div>

            {/* Orders Feed */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar bg-zinc-50/30">
              {displayedOrders.length > 0 ? (
                displayedOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-zinc-150 rounded-sm shadow-sm p-6 space-y-6"
                  >
                    {/* Top Row: Meta info */}
                    <div className="flex flex-wrap justify-between items-center gap-3 border-b border-zinc-100 pb-4">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">ORDER ID</span>
                        <h4 className="font-display font-black text-xs text-zinc-950 uppercase tracking-wide">
                          {order.id}
                        </h4>
                      </div>
                      
                      {/* Status pill */}
                      <span className={`px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                        getStatusColor(order.status)
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Middle Row: Items preview (Flipkart style) */}
                    <div className="space-y-4">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-12 h-16 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-100 flex-shrink-0">
                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                          </div>
                          <div className="flex-grow flex flex-col justify-between py-0.5">
                            <div className="space-y-0.5">
                              <h5 className="font-display font-bold text-[11px] text-zinc-800 uppercase tracking-wide truncate max-w-xs">
                                {item.name}
                              </h5>
                              <p className="text-[9px] font-bold text-zinc-400">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <span className="font-display font-black text-xs text-zinc-950">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Metadata & Status tracker timeline */}
                    <div className="pt-4 border-t border-zinc-100 space-y-4 font-bold text-[9px] tracking-widest uppercase text-zinc-500">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-zinc-400" />
                          <span>Estimated Arrival: <strong className="text-zinc-700">{order.eta || "3-5 Days"}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-zinc-400" />
                          <span>Location: <strong className="text-zinc-700">{order.location || "WAREHOUSE"}</strong></span>
                        </div>
                      </div>

                      {/* Timeline steps overview */}
                      {order.status !== "Cancelled" && (
                        <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-sm">
                          <p className="text-[8px] font-black tracking-widest text-zinc-400 mb-3 uppercase">
                            DELIVERY TIMELINE STATUS
                          </p>
                          <div className="flex justify-between items-center gap-1 text-[8px] tracking-normal font-bold">
                            {order.steps?.slice(0, 4).map((step: any, sIdx: number) => (
                              <div key={sIdx} className="flex flex-col items-center gap-1 flex-1 text-center relative">
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  step.done ? "border-brand-primary bg-brand-primary text-white" : "border-zinc-200 bg-white"
                                }`}>
                                  {step.done && <span className="text-[7px]">✓</span>}
                                </div>
                                <span className={`text-[7px] font-black uppercase mt-1 truncate max-w-[65px] ${
                                  step.done ? "text-brand-primary" : "text-zinc-300"
                                }`}>
                                  {step.title.split(" ")[0]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Controls */}
                      <div className="flex gap-3 pt-2">
                        {order.status !== "Cancelled" && (
                          <button
                            onClick={() => handleTrackClick(order.id)}
                            className="flex-1 border border-zinc-200 hover:border-brand-primary text-zinc-600 hover:text-brand-primary py-3 rounded-sm font-display font-black text-[9px] tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5"
                          >
                            Track Status
                          </button>
                        )}
                        
                        {/* Cancel button: only active if Placed */}
                        {order.status === "Placed" && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="flex-1 border border-zinc-200 hover:border-brand-accent text-zinc-400 hover:text-brand-accent py-3 rounded-sm font-display font-black text-[9px] tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 hover:bg-brand-accent/5"
                          >
                            <Trash2 size={13} />
                            <span>Cancel Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                /* No Orders found */
                <div className="py-24 text-center flex flex-col items-center justify-center space-y-4 bg-white border border-dashed border-zinc-200 rounded-sm">
                  <div className="text-zinc-200">
                    <Package size={48} strokeWidth={1} />
                  </div>
                  <h4 className="font-display font-black uppercase text-xs tracking-widest text-zinc-400">
                    No orders recorded
                  </h4>
                  <p className="text-[11px] font-bold text-zinc-400 max-w-xs leading-relaxed uppercase tracking-wider">
                    {activeTab === "active" ? "You don't have any active shipments." : "You don't have any past orders yet."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
