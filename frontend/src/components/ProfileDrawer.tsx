import React from "react";
import { X, LogOut, Package, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

interface ProfileDrawerProps {
  onMyOrdersClick: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ onMyOrdersClick }) => {
  const {
    isOpen = false, // fallback from App
    isProfileOpen,
    setIsProfileOpen,
    isLoggedIn,
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    otpSent,
    setOtpSent,
    handleLoginSubmit,
    handleLogout,
    userName
  } = useShop();

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />

          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[160] p-8 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-zinc-100">
              <h3 className="text-xl font-display font-black tracking-tight uppercase text-zinc-950">
                {isLoggedIn ? "MY PROFILE" : "MEMBER ACCESS"}
              </h3>
              <button 
                onClick={() => setIsProfileOpen(false)} 
                className="p-2 text-zinc-400 hover:text-black transition-all hover:rotate-90 duration-300"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Conditional */}
            {!isLoggedIn ? (
              /* LOGIN FORM */
              <div className="flex flex-col flex-grow">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-8 leading-relaxed">
                  Join the CORE Protocol to access order tracking history, save billing info, and get early drop access.
                </p>
                
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                       <div className="bg-zinc-100 border border-zinc-200 px-4 py-4 text-[11px] font-black select-none">
                         +91
                       </div>
                       <input 
                         type="tel" 
                         value={phoneNumber}
                         onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                         placeholder="Enter 10-digit number" 
                         className="flex-grow p-4 bg-zinc-50 border border-zinc-200/60 focus:border-brand-primary outline-none font-bold text-[11px] tracking-widest transition-all rounded-sm"
                         disabled={otpSent}
                         required
                       />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                        Verification Code (Use OTP: 1234)
                      </label>
                      <input 
                         type="text" 
                         value={otp}
                         onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                         placeholder="Enter 4-digit OTP" 
                         className="w-full p-4 bg-zinc-50 border border-zinc-200/60 focus:border-brand-primary outline-none font-bold text-[11px] tracking-widest transition-all text-center rounded-sm"
                         required
                         autoFocus
                       />
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-brand-black text-white py-4 font-display font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all shadow-md rounded-sm"
                  >
                    {otpSent ? "VERIFY & LOGIN" : "REQUEST CODE"}
                  </button>

                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-[9px] font-bold text-zinc-400 hover:text-black uppercase tracking-wider block mt-2"
                    >
                      Change Phone Number
                    </button>
                  )}
                </form>
              </div>
            ) : (
              /* LOGGED IN VIEW */
              <div className="flex flex-col flex-grow justify-between">
                <div className="space-y-8">
                  {/* User Profile Info Card */}
                  <div className="flex items-center gap-4 p-5 bg-zinc-50 border border-zinc-150 rounded-sm shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/10">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-xs text-zinc-800 uppercase tracking-widest">
                        {userName}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-400 tracking-wider">
                        +91 {phoneNumber}
                      </p>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="space-y-3.5">
                    <h5 className="font-display font-black text-[10px] tracking-[0.25em] text-zinc-300 uppercase">
                      ACCOUNT PANEL
                    </h5>
                    <button 
                      onClick={() => { setIsProfileOpen(false); onMyOrdersClick(); }}
                      className="w-full py-4 px-4 bg-white hover:bg-zinc-50 border border-zinc-100 rounded-sm text-left font-display font-black text-[10px] tracking-widest uppercase flex items-center gap-3 transition-colors text-zinc-700 hover:text-black"
                    >
                      <Package size={14} />
                      <span>ORDER HISTORY</span>
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full border border-zinc-200 hover:border-brand-accent hover:bg-brand-accent/5 text-zinc-500 hover:text-brand-accent py-4 font-display font-black uppercase text-[10px] tracking-widest transition-colors flex items-center justify-center gap-2 rounded-sm"
                >
                  <LogOut size={14} />
                  <span>LOGOUT ACCOUNT</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
