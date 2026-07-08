import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Wallet, Truck, Check, HelpCircle, Lock, Home, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";

export const CheckoutView: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    totalDiscount,
    total,
    formatPrice,
    
    // Address States
    checkoutName,
    setCheckoutName,
    checkoutEmail,
    setCheckoutEmail,
    checkoutAddress,
    setCheckoutAddress,
    checkoutCity,
    setCheckoutCity,
    checkoutZip,
    setCheckoutZip,
    checkoutStep,
    setCheckoutStep,

    // Payment States
    paymentMethod,
    setPaymentMethod,
    cardName,
    setCardName,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCardCvv,
    upiId,
    setUpiId,

    // Actions
    phoneNumber,
    setPhoneNumber,
    handlePlaceOrder,

    // Coupon Actions
    appliedCoupon,
    setAppliedCoupon,
    isOrdering
  } = useShop();

  // Loading cycling text state
  const [loaderMessage, setLoaderMessage] = useState("Securing connection...");
  
  useEffect(() => {
    if (isOrdering) {
      const messages = [
        "Securing checkout connection...",
        "Connecting to secure payment gateway...",
        "Verifying transaction credentials...",
        "Authorizing payment details...",
        "Registering order with warehouse...",
        "Generating receipt summary..."
      ];
      let idx = 0;
      setLoaderMessage(messages[0]);
      const interval = setInterval(() => {
        idx = (idx + 1) % messages.length;
        setLoaderMessage(messages[idx]);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isOrdering]);

  // Local UI States
  const [addressType, setAddressType] = useState<"home" | "work">("home");
  const [activeAccordion, setActiveAccordion] = useState<"upi" | "card" | "netbanking" | "cod">("card");
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  
  // COD Captcha States
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Generate COD Captcha on mount or reset
  const generateNewCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCaptcha(code);
    setCaptchaInput("");
    setCaptchaVerified(false);
  };

  useEffect(() => {
    if (isCheckoutOpen) {
      generateNewCaptcha();
      setPromoInput(appliedCoupon || "");
      if (appliedCoupon) {
        setPromoSuccess(`Coupon "${appliedCoupon}" is active! 15% discount applied.`);
      } else {
        setPromoSuccess("");
      }
    }
  }, [isCheckoutOpen, appliedCoupon]);

  // Navigation handlers
  const handleBackToPhone = () => setCheckoutStep("phone");
  const handleBackToAddress = () => setCheckoutStep("address");

  const handlePhoneNext = () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number!");
      return;
    }
    setCheckoutStep("address");
  };

  const handleAddressNext = () => {
    if (!checkoutName.trim() || !checkoutEmail.trim() || !checkoutAddress.trim() || !checkoutCity.trim()) {
      alert("Please fill out all shipping details!");
      return;
    }
    if (!/^\d{6}$/.test(checkoutZip)) {
      alert("Please enter a valid 6-digit PIN code!");
      return;
    }
    setCheckoutStep("payment");
  };

  // Coupon handling
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");
    
    if (promoInput.trim().toUpperCase() === "CORE15") {
      setAppliedCoupon("CORE15");
      setPromoSuccess("Coupon 'CORE15' applied successfully! Extra 15% off credited.");
    } else if (promoInput.trim() === "") {
      setPromoError("Please enter a coupon code.");
    } else {
      setPromoError("Invalid coupon code. Try 'CORE15'.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoInput("");
    setPromoSuccess("");
    setPromoError("");
  };

  // Card network detection helper
  const getCardNetwork = (num: string): "visa" | "mastercard" | "unknown" => {
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.startsWith("4")) return "visa";
    if (/^(5[1-5]|2[2-7])/.test(cleanNum)) return "mastercard";
    return "unknown";
  };

  // Capitalize Card input spacing
  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    const formatted = clean.match(/.{1,4}/g)?.join(" ") || clean;
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (clean.length > 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  // Payment method selection synchronized with accordion
  const handleAccordionSelect = (method: "upi" | "card" | "netbanking" | "cod") => {
    setActiveAccordion(method);
    if (method === "card") setPaymentMethod("card");
    else if (method === "upi") setPaymentMethod("upi");
    else setPaymentMethod("cod"); // cod/netbanking fallback in context
  };

  const handlePlaceOrderClick = () => {
    if (paymentMethod === "cod" && activeAccordion === "cod") {
      if (captchaInput !== generatedCaptcha) {
        alert("Incorrect captcha code. Please check the code and try again.");
        generateNewCaptcha();
        return;
      }
    }
    if (activeAccordion === "netbanking" && !selectedBank) {
      alert("Please select a bank for Net Banking payment!");
      return;
    }
    handlePlaceOrder();
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }} 
        transition={{ type: "spring", damping: 30, stiffness: 220 }}
        className="fixed inset-0 z-[200] bg-[#f8f9fa] overflow-y-auto flex flex-col font-sans"
      >
        {/* Main Header / Visual Stepper */}
        <header className="sticky top-0 bg-white border-b border-zinc-150 py-4 px-6 md:px-12 z-30 flex items-center justify-between shadow-xs">
          <button 
            onClick={() => setIsCheckoutOpen(false)} 
            className="flex items-center gap-2 font-display font-extrabold text-[11px] tracking-wider hover:text-brand-primary transition-colors text-zinc-600 uppercase"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Cart</span>
          </button>
          
          {/* Stepper Progress Indicator */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-display border transition-all ${
                checkoutStep === "phone" 
                  ? "bg-brand-primary border-brand-primary text-white ring-4 ring-indigo-50" 
                  : "bg-emerald-500 border-emerald-500 text-white"
              }`}>
                {checkoutStep !== "phone" ? <Check size={10} strokeWidth={3} /> : "1"}
              </div>
              <span className={`text-[10px] font-bold tracking-widest ${checkoutStep === "phone" ? "text-zinc-900" : "text-zinc-400"}`}>
                LOGIN
              </span>
            </div>
            <div className={`h-[1px] w-6 md:w-12 ${checkoutStep !== "phone" ? "bg-emerald-500" : "bg-zinc-200"}`} />
            
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-display border transition-all ${
                checkoutStep === "address" 
                  ? "bg-brand-primary border-brand-primary text-white ring-4 ring-indigo-50" 
                  : checkoutStep === "payment" 
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white border-zinc-200 text-zinc-400"
              }`}>
                {checkoutStep === "payment" ? <Check size={10} strokeWidth={3} /> : "2"}
              </div>
              <span className={`text-[10px] font-bold tracking-widest ${checkoutStep === "address" ? "text-zinc-900" : "text-zinc-400"}`}>
                ADDRESS
              </span>
            </div>
            <div className={`h-[1px] w-6 md:w-12 ${checkoutStep === "payment" ? "bg-emerald-500" : "bg-zinc-200"}`} />
            
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-display border transition-all ${
                checkoutStep === "payment" 
                  ? "bg-brand-primary border-brand-primary text-white ring-4 ring-indigo-50" 
                  : "bg-white border-zinc-200 text-zinc-400"
              }`}>
                3
              </div>
              <span className={`text-[10px] font-bold tracking-widest ${checkoutStep === "payment" ? "text-zinc-900" : "text-zinc-400"}`}>
                PAYMENT
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Lock size={12} className="text-zinc-500" />
            <span className="text-[9px] font-bold tracking-widest uppercase hidden md:inline">SECURE TRANSIT</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto w-full p-4 md:p-8 lg:p-12 flex-grow flex flex-col justify-start">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STEP 1: MOBILE LOGIN */}
              {checkoutStep === "phone" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200/60 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 font-display">Account verification</h3>
                    <p className="text-[12px] text-zinc-400 mt-1">
                      Enter your mobile number to coordinate order delivery and updates.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Mobile Number
                    </label>
                    <div className="flex gap-3">
                      <div className="bg-zinc-50 border border-zinc-200 text-zinc-700 px-4 py-3.5 text-sm font-semibold rounded-xl select-none flex items-center">
                        +91
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="Enter 10-digit number"
                        className="flex-grow px-4 py-3.5 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none font-semibold text-sm tracking-wider transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handlePhoneNext}
                    disabled={phoneNumber.length !== 10}
                    className="w-full bg-zinc-950 hover:bg-brand-primary text-white disabled:bg-zinc-200 disabled:text-zinc-400 py-4 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Proceed to Delivery Address</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* STEP 2: DELIVERY ADDRESS FORM */}
              {checkoutStep === "address" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200/60 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 font-display">Shipping address</h3>
                    <p className="text-[12px] text-zinc-400 mt-1">
                      Please enter your shipping address details accurately to avoid delays.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Rahul Sharma" 
                        value={checkoutName} 
                        onChange={(e) => setCheckoutName(e.target.value)} 
                        className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-medium text-sm transition-all" 
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Email Address (For Invoicing)</label>
                      <input 
                        type="email" 
                        placeholder="e.g. rahul@example.com" 
                        value={checkoutEmail} 
                        onChange={(e) => setCheckoutEmail(e.target.value)} 
                        className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-medium text-sm transition-all" 
                      />
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Street Address</label>
                      <input 
                        type="text" 
                        placeholder="House No, Flat, Building, Area, Street Name" 
                        value={checkoutAddress} 
                        onChange={(e) => setCheckoutAddress(e.target.value)} 
                        className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-medium text-sm transition-all" 
                      />
                    </div>

                    {/* City & Zip Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">City</label>
                        <input 
                          type="text" 
                          placeholder="e.g. New Delhi" 
                          value={checkoutCity} 
                          onChange={(e) => setCheckoutCity(e.target.value)} 
                          className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-medium text-sm transition-all" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pincode / ZIP</label>
                        <input 
                          type="text" 
                          placeholder="6-digit PIN" 
                          value={checkoutZip} 
                          onChange={(e) => setCheckoutZip(e.target.value.replace(/\D/g, "").slice(0, 6))} 
                          className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-semibold text-sm tracking-wider transition-all" 
                        />
                      </div>
                    </div>

                    {/* Address Type Chips */}
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Address Type</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setAddressType("home")}
                          className={`flex-grow py-3 border px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            addressType === "home"
                              ? "bg-zinc-950 border-zinc-950 text-white shadow-xs"
                              : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                          }`}
                        >
                          <Home size={14} />
                          <span>Home (7 AM - 9 PM)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddressType("work")}
                          className={`flex-grow py-3 border px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            addressType === "work"
                              ? "bg-zinc-950 border-zinc-950 text-white shadow-xs"
                              : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                          }`}
                        >
                          <Briefcase size={14} />
                          <span>Work (9 AM - 6 PM)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleBackToPhone} 
                      className="w-1/3 border border-zinc-200 py-3.5 font-bold rounded-xl text-xs text-zinc-500 hover:bg-zinc-50 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleAddressNext} 
                      className="w-2/3 bg-zinc-950 text-white py-3.5 font-bold rounded-xl text-xs hover:bg-brand-primary transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: ACCORDION PAYMENT DETAILS */}
              {checkoutStep === "payment" && (
                <div className="space-y-4">
                  
                  {/* Accordion 1: Credit/Debit Cards */}
                  <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
                    <button
                      onClick={() => handleAccordionSelect("card")}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-display font-bold text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeAccordion === "card" ? "bg-indigo-50 text-brand-primary" : "bg-zinc-100 text-zinc-500"}`}>
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <span className="block font-bold">Credit or Debit Card</span>
                          <span className="text-[11px] text-zinc-400 font-normal">Visa, Mastercard, RuPay, Maestro</span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center">
                        {activeAccordion === "card" && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                      </div>
                    </button>

                    {activeAccordion === "card" && (
                      <div className="px-6 pb-6 pt-2 border-t border-zinc-100 bg-[#fafafa]/50 space-y-4">
                        <div className="space-y-3.5 max-w-md">
                          
                          {/* Card Number */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Card Number</label>
                            <div className="relative">
                              <input 
                                type="text" 
                                placeholder="0000 0000 0000 0000" 
                                value={cardNumber} 
                                onChange={(e) => handleCardNumberChange(e.target.value)} 
                                className="w-full pl-4 pr-12 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-semibold text-sm tracking-wider transition-all" 
                              />
                              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                                {getCardNetwork(cardNumber) === "visa" && (
                                  <svg className="h-3 w-auto" viewBox="0 0 32 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.7 0.2l-1.7 9.4h-1.9L9 2.3C8.9 1.8 8.7 1.6 8.2 1.3 7.0 0.8 5.6 0.4 4 0.2v0.3c1.0 0.2 1.9 0.5 2.6 0.9 0.4 0.3 0.5 0.5 0.7 0.9L9.0 9.6h2.0L12.8 0.2h-0.1zM23.2 3.1c0-1.1-0.7-1.9-2.1-1.9-1.6 0-2.5 0.9-2.5 1.9 0 0.9 0.8 1.4 1.5 1.7 0.7 0.3 0.9 0.5 0.9 0.9 0 0.5-0.6 0.7-1.1 0.7-1.0 0-1.5-0.3-2.0-0.5l-0.3-0.1-0.3 1.8c0.5 0.3 1.5 0.5 2.5 0.5 2.2 0 3.6-1.1 3.6-2.7c0-0.9-0.5-1.6-1.9-2.2-0.8-0.4-1.3-0.7-1.3-1.1 0-0.3 0.4-0.7 1.3-0.7 0.7 0 1.3 0.1 1.7 0.3l0.2 0.1 0.3-1.7c-0.5-0.2-1.1-0.3-1.9-0.3M29.3 0.2h-1.5c-0.5 0-0.9 0.3-1.1 0.7l-3.3 8.7h2.0l0.4-1.1h2.5l0.3 1.1h1.7L29.3 0.2zm-2.5 6.7l1.1-3.0 0.6 3.0h-1.7zM15.4 0.2h-1.9L12 9.6h2.0l1.4-9.4z" fill="#1434CB"/>
                                  </svg>
                                )}
                                {getCardNetwork(cardNumber) === "mastercard" && (
                                  <svg className="h-4.5 w-auto" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10" r="10" fill="#EB001B" />
                                    <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.85" />
                                  </svg>
                                )}
                                {getCardNetwork(cardNumber) === "unknown" && (
                                  <CreditCard size={14} className="text-zinc-300" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expiry & CVV */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Expiry Date</label>
                              <input 
                                type="text" 
                                placeholder="MM/YY" 
                                value={cardExpiry} 
                                onChange={(e) => handleExpiryChange(e.target.value)} 
                                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-semibold text-sm transition-all" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">CVV Code</label>
                              <input 
                                type="password" 
                                placeholder="***" 
                                value={cardCvv} 
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} 
                                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-bold text-sm tracking-wider transition-all text-center" 
                              />
                            </div>
                          </div>

                          {/* Card Holder Name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Cardholder Name</label>
                            <input 
                              type="text" 
                              placeholder="Name on card" 
                              value={cardName} 
                              onChange={(e) => setCardName(e.target.value)} 
                              className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-medium text-sm transition-all" 
                            />
                          </div>

                          <div className="text-[10px] text-zinc-400 font-medium flex items-center gap-1.5 pt-1">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span>Payments secured by 256-bit SSL encryption.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion 2: UPI (GPay / PhonePe) */}
                  <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
                    <button
                      onClick={() => handleAccordionSelect("upi")}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-display font-bold text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeAccordion === "upi" ? "bg-indigo-50 text-brand-primary" : "bg-zinc-100 text-zinc-500"}`}>
                          <Wallet size={18} />
                        </div>
                        <div>
                          <span className="block font-bold">UPI ID (Google Pay, PhonePe, Paytm)</span>
                          <span className="text-[11px] text-zinc-400 font-normal">Pay instantly from your smartphone</span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center">
                        {activeAccordion === "upi" && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                      </div>
                    </button>

                    {activeAccordion === "upi" && (
                      <div className="px-6 pb-6 pt-2 border-t border-zinc-100 bg-[#fafafa]/50 space-y-4">
                        <div className="space-y-3 max-w-md">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Enter UPI ID</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="e.g. username@upi" 
                              value={upiId} 
                              onChange={(e) => setUpiId(e.target.value)} 
                              className="flex-grow px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-semibold text-sm transition-all" 
                            />
                          </div>
                          <p className="text-[10px] text-zinc-400 font-medium">
                            A payment request will be sent to your UPI app. Please verify and pay within 5 minutes.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion 3: Net Banking */}
                  <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
                    <button
                      onClick={() => handleAccordionSelect("netbanking")}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-display font-bold text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeAccordion === "netbanking" ? "bg-indigo-50 text-brand-primary" : "bg-zinc-100 text-zinc-500"}`}>
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7M15 17V7"/></svg>
                        </div>
                        <div>
                          <span className="block font-bold">Net Banking</span>
                          <span className="text-[11px] text-zinc-400 font-normal">Secure transfer from major Indian banks</span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center">
                        {activeAccordion === "netbanking" && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                      </div>
                    </button>

                    {activeAccordion === "netbanking" && (
                      <div className="px-6 pb-6 pt-4 border-t border-zinc-100 bg-[#fafafa]/50 space-y-4">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Popular Banks</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { id: "sbi", label: "SBI" },
                            { id: "hdfc", label: "HDFC" },
                            { id: "icici", label: "ICICI" },
                            { id: "axis", label: "Axis" }
                          ].map(bank => (
                            <button
                              key={bank.id}
                              type="button"
                              onClick={() => setSelectedBank(bank.id)}
                              className={`py-3 px-4 border rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                selectedBank === bank.id
                                  ? "bg-white border-brand-primary text-brand-primary shadow-xs ring-2 ring-indigo-50"
                                  : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                              }`}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full border border-zinc-300 flex items-center justify-center ${
                                selectedBank === bank.id ? "border-brand-primary bg-brand-primary" : ""
                              }`} />
                              <span>{bank.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Dropdown list for other banks */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Or select other bank</span>
                          <select 
                            onChange={(e) => setSelectedBank(e.target.value)}
                            value={["sbi", "hdfc", "icici", "axis"].includes(selectedBank) ? "" : selectedBank}
                            className="w-full max-w-md px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none font-medium text-xs focus:border-brand-primary transition-all text-zinc-700"
                          >
                            <option value="">Choose Bank...</option>
                            <option value="pnb">Punjab National Bank</option>
                            <option value="bob">Bank of Baroda</option>
                            <option value="canara">Canara Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                            <option value="yesbank">Yes Bank</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion 4: Cash on Delivery (Flipkart Captcha Verified) */}
                  <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
                    <button
                      onClick={() => handleAccordionSelect("cod")}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-display font-bold text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeAccordion === "cod" ? "bg-indigo-50 text-brand-primary" : "bg-zinc-100 text-zinc-500"}`}>
                          <Truck size={18} />
                        </div>
                        <div>
                          <span className="block font-bold">Cash on Delivery (COD)</span>
                          <span className="text-[11px] text-zinc-400 font-normal">Pay cash or scan QR code on arrival</span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center">
                        {activeAccordion === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                      </div>
                    </button>

                    {activeAccordion === "cod" && (
                      <div className="px-6 pb-6 pt-4 border-t border-zinc-100 bg-[#fafafa]/50 space-y-4">
                        <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-xl text-[12px] text-zinc-500 font-medium leading-relaxed max-w-lg">
                          🛍️ Please keep cash/QR ready at delivery. To secure your delivery and prevent spam orders, please solve the security code.
                        </div>

                        {/* Numerical Captcha Verification block */}
                        <div className="space-y-3 max-w-sm">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Security Captcha</label>
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-zinc-200 to-zinc-300/80 px-5 py-2.5 rounded-xl font-display font-black text-lg tracking-[0.25em] text-zinc-800 select-none select-all italic shadow-inner border border-zinc-300">
                              {generatedCaptcha}
                            </div>
                            <button
                              type="button"
                              onClick={generateNewCaptcha}
                              className="text-[10px] text-brand-primary underline hover:text-indigo-800 font-bold uppercase tracking-wider"
                            >
                              Refresh
                            </button>
                          </div>
                          
                          <input 
                            type="text" 
                            placeholder="Enter 4-digit code" 
                            value={captchaInput} 
                            onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, "").slice(0, 4))} 
                            className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl outline-none font-bold text-sm tracking-widest text-center" 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Steps */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleBackToAddress} 
                      className="w-1/3 border border-zinc-200 py-3.5 font-bold rounded-xl text-xs text-zinc-500 hover:bg-zinc-50 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePlaceOrderClick}
                      disabled={isOrdering || (activeAccordion === "cod" && captchaInput.length !== 4)}
                      className="w-2/3 bg-brand-accent text-white py-3.5 font-bold rounded-xl text-xs hover:opacity-90 disabled:bg-zinc-200 disabled:text-zinc-400 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Lock size={12} />
                      <span>{isOrdering ? "Processing..." : `Place Order For ${formatPrice(total)}`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price Detail Summary Panel */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Promo Coupon Application */}
              {checkoutStep === "payment" && (
                <div className="bg-white p-5 rounded-2xl border border-zinc-200/60 shadow-sm space-y-4">
                  <h4 className="font-display font-bold text-xs text-zinc-800 uppercase tracking-wider">
                    🎫 Apply Coupon / Promo Code
                  </h4>
                  
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ENTER CODE (e.g. CORE15)" 
                        value={promoInput} 
                        onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }} 
                        className="flex-grow px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-brand-primary focus:bg-white rounded-xl outline-none font-semibold text-xs tracking-wider uppercase transition-all" 
                      />
                      <button 
                        type="submit"
                        className="bg-zinc-950 hover:bg-brand-primary text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-600" />
                        <div>
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                            {appliedCoupon} Applied
                          </span>
                          <span className="text-[10px] text-emerald-600 font-medium">Extra 15% discount has been credited.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs font-bold text-red-500 hover:text-red-700 underline uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-[11px] text-red-500 font-semibold">{promoError}</p>
                  )}
                  {promoSuccess && !appliedCoupon && (
                    <p className="text-[11px] text-emerald-600 font-semibold">{promoSuccess}</p>
                  )}
                  
                  <div className="bg-indigo-50/50 border border-indigo-100/60 p-3.5 rounded-xl text-[11px] text-brand-primary font-semibold flex items-center justify-between">
                    <span>💡 Tip: Use coupon code <strong className="font-extrabold uppercase">CORE15</strong> for 15% discount!</span>
                  </div>
                </div>
              )}

              {/* Price Details Block */}
              <div className="bg-white rounded-2xl border border-zinc-200/60 p-6 shadow-sm space-y-6">
                <h3 className="font-display font-extrabold text-[12px] tracking-wider text-zinc-800 pb-3 border-b border-zinc-150">
                  PRICE DETAILS ({cart.length} {cart.length === 1 ? "Item" : "Items"})
                </h3>
                
                {/* Product Summary list */}
                <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-[12px] text-zinc-500 font-medium">
                      <span className="truncate pr-4">
                        {item.name} <span className="text-zinc-400 font-bold ml-1">x{item.quantity}</span>
                      </span>
                      <span className="text-zinc-800 font-bold whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-150 pt-5 space-y-3.5 text-xs text-zinc-600 font-medium">
                  <div className="flex justify-between">
                    <span>Total MRP</span>
                    <span className="text-zinc-900 font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-brand-accent">
                      <span>Discount on MRP</span>
                      <span>-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 font-bold uppercase tracking-wider">FREE</span>
                  </div>
                  
                  <div className="border-t border-zinc-150 pt-5 flex justify-between font-display font-extrabold text-xl text-zinc-900">
                    <span>Payable Amount</span>
                    <span className="text-zinc-950 font-black">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="bg-[#fcfcfc] border border-zinc-100 rounded-xl p-3.5 space-y-2 text-[10px] text-zinc-400 font-medium leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-500 uppercase tracking-wider">
                    <Truck size={12} className="text-zinc-400" />
                    <span>Express Delivery</span>
                  </div>
                  <p>Estimated Shipping time: 2-3 Business Days. Fast delivery coordinates with leading national logistics.</p>
                </div>
              </div>

            </div>

          </div>
        </div>



        </motion.div>
      )}
    </AnimatePresence>
  );
};
