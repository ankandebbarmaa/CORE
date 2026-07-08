import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Product, CartItem } from "../types";
import { PRODUCTS } from "../constants";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1594931984428-2287ab67073b?auto=format&fit=crop&q=80&w=800";

const categoryImageFallbacks: Record<string, string> = {
  hoodies: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
  tees: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
  footwear: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
  jeans: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
  shirts: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
  accessories: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
};

const getCategoryFallbackImage = (category?: string) => categoryImageFallbacks[category || ""] || FALLBACK_IMAGE;

const buildProductDescription = (rawProduct: any) => {
  if (typeof rawProduct?.description === "string" && rawProduct.description.trim().length > 0) {
    return rawProduct.description;
  }
  const name = rawProduct?.name || "CORE Essential";
  const category = rawProduct?.category || "streetwear";
  const gender = rawProduct?.gender || "unisex";
  return `${name} is a premium ${gender} ${category} crafted for everyday comfort, confident fits, and long-lasting wear.`;
};

const normalizeProduct = (rawProduct: any): Product => {
  const normalizedImage = typeof rawProduct?.image === "string" && rawProduct.image.trim().length > 0
    ? rawProduct.image
    : (Array.isArray(rawProduct?.images) && typeof rawProduct.images[0] === "string" && rawProduct.images[0].trim().length > 0
      ? rawProduct.images[0]
      : getCategoryFallbackImage(rawProduct?.category));

  return {
    ...rawProduct,
    image: normalizedImage,
    sizes: Array.isArray(rawProduct?.sizes) && rawProduct.sizes.length > 0 ? rawProduct.sizes : ["One Size"],
    colors: Array.isArray(rawProduct?.colors) ? rawProduct.colors : [],
    reviews: Array.isArray(rawProduct?.reviews) ? rawProduct.reviews : [],
    description: buildProductDescription(rawProduct),
  } as Product;
};

interface ShopContextType {
  products: Product[];
  filteredProducts: Product[];
  cart: CartItem[];
  wishlist: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeGender: "all" | "men" | "women";
  setActiveGender: (gen: "all" | "men" | "women") => void;
  activeMood: string | null;
  setActiveMood: (mood: string | null) => void;
  
  // Advanced filters (Ajio/Myntra/Snitch-style)
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedColors: string[];
  toggleColorFilter: (color: string) => void;
  selectedSizes: string[];
  toggleSizeFilter: (size: string) => void;
  clearFilters: () => void;

  // Drawer / view states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  showPromoPopup: boolean;
  setShowPromoPopup: (show: boolean) => void;
  
  // Selection
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  // Cart operations
  addToCart: (product: Product, size?: string) => void;
  toggleWishlist: (id: string, e?: React.MouseEvent) => void;
  updateQuantity: (id: string, delta: number) => void;
  subtotal: number;
  totalDiscount: number;
  total: number;

  // Profile
  isLoggedIn: boolean;
  setIsLoggedIn: (login: boolean) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  otpSent: boolean;
  setOtpSent: (sent: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleLogout: () => void;

  // Checkout Form
  checkoutName: string;
  setCheckoutName: (val: string) => void;
  checkoutEmail: string;
  setCheckoutEmail: (val: string) => void;
  checkoutAddress: string;
  setCheckoutAddress: (val: string) => void;
  checkoutCity: string;
  setCheckoutCity: (val: string) => void;
  checkoutZip: string;
  setCheckoutZip: (val: string) => void;
  checkoutStep: "phone" | "address" | "payment";
  setCheckoutStep: (step: "phone" | "address" | "payment") => void;
  paymentMethod: "card" | "upi" | "cod";
  setPaymentMethod: (method: "card" | "upi" | "cod") => void;
  cardName: string;
  setCardName: (val: string) => void;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
  cardCvv: string;
  setCardCvv: (val: string) => void;
  upiId: string;
  setUpiId: (val: string) => void;
  handlePlaceOrder: () => Promise<void>;
  appliedCoupon: string | null;
  setAppliedCoupon: (val: string | null) => void;
  isOrdering: boolean;

  // Track Order
  trackingId: string;
  setTrackingId: (val: string) => void;
  trackingStatus: any;
  setTrackingStatus: (status: any) => void;
  handleTrackQuery: (e: React.FormEvent) => Promise<void>;

  // User Orders Ledger
  userOrders: any[];
  showOrderSuccess: boolean;
  setShowOrderSuccess: (val: boolean) => void;
  fetchUserOrders: (phone?: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  addProductReview: (productId: string, reviewData: { user: string; rating: number; comment: string }) => Promise<boolean>;

  // Utilities
  formatPrice: (price: number) => string;
  apiBase: string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS.map(normalizeProduct));
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("core_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("core_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeGender, setActiveGender] = useState<"all" | "men" | "women">("all");
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Open Drawer/Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  // Selected Product (Detail View)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Profile Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem("core_is_logged_in") === "true";
    } catch {
      return false;
    }
  });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    try {
      return localStorage.getItem("core_phone_number") || "";
    } catch {
      return "";
    }
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem("core_user_name") || "Protocol Member";
    } catch {
      return "Protocol Member";
    }
  });

  // Track Order States
  const [trackingId, setTrackingId] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<any>(null);

  // Checkout States
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutZip, setCheckoutZip] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"phone" | "address" | "payment">("phone");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  // User Orders & Success states
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<any | null>(null);

  // Fetch products and record visits
  useEffect(() => {
    const sessionStorageKey = "core_session_id";
    let sessionId = localStorage.getItem(sessionStorageKey);
    if (!sessionId) {
      sessionId = `sess-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      localStorage.setItem(sessionStorageKey, sessionId);
    }

    const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-IN";
    const localeCountryCode = locale.includes("-") ? locale.split("-")[1] : "IN";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
    const stateGuess = timezone.includes("/") ? timezone.split("/")[1].replace(/_/g, " ") : "Unknown";
    const countryGuess = localeCountryCode === "IN" ? "India" : localeCountryCode;

    fetch(`${API_BASE}/api/analytics/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        state: stateGuess,
        country: countryGuess,
        device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
        source: "storefront"
      })
    }).catch(() => {
      // Analytics failure shouldn't block shopping flow
    });

    fetch(`${API_BASE}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error("API server unreachable");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.map(normalizeProduct));
        }
      })
      .catch(err => {
        console.warn("Falling back to local static catalog:", err);
      });
  }, []);

  // Promo pop-up trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromoPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Sync profile phone verification state during checkout
  useEffect(() => {
    if (isLoggedIn && phoneNumber) {
      setCheckoutStep("address");
    }
  }, [isLoggedIn, phoneNumber]);

  // Fetch user orders on mount/auth load
  useEffect(() => {
    if (isLoggedIn && phoneNumber) {
      fetchUserOrders(phoneNumber);
    }
  }, [isLoggedIn, phoneNumber]);

  // Sync cart and wishlist with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("core_cart", JSON.stringify(cart));
    } catch (err) {
      console.warn("localStorage sync error (cart):", err);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("core_wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.warn("localStorage sync error (wishlist):", err);
    }
  }, [wishlist]);

  // Color selection toggle
  const toggleColorFilter = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  // Size selection toggle
  const toggleSizeFilter = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveGender("all");
    setActiveMood(null);
    setSelectedSort("default");
    setMaxPrice(10000);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  // Filter & Sort Products (Ajio / Myntra style)
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const searchStr = searchQuery.toLowerCase().trim();
      
      const matchesSearch = !searchStr || 
                           p.name.toLowerCase().includes(searchStr) || 
                           p.category.toLowerCase().includes(searchStr) ||
                           p.description.toLowerCase().includes(searchStr) ||
                           p.id.toLowerCase().includes(searchStr);
      
      let matchesCategory = activeCategory === "all" || p.category === activeCategory;
      if (activeCategory === "Summer Arrival") {
        matchesCategory = p.description.toLowerCase().includes("summer");
      } else if (activeCategory === "New Arrival") {
        matchesCategory = p.description.toLowerCase().includes("new arrival") || Boolean(p.isNewArrival);
      } else if (activeCategory === "Linen Shirt Man") {
        matchesCategory = p.name.toLowerCase().includes("linen");
      }

      const matchesGender = activeGender === "all" ? true : (p.gender === activeGender);
      
      const matchesMood = !activeMood || 
                         p.description.toLowerCase().includes(activeMood.toLowerCase()) ||
                         p.name.toLowerCase().includes(activeMood.toLowerCase());
                         
      const matchesPrice = p.price <= maxPrice;
      
      // Color matching (checks if any selected filter matches the product's colors)
      const matchesColor = selectedColors.length === 0 || 
                          p.colors.some(c => selectedColors.includes(c));
      
      // Size matching (checks if any selected filter matches the product's sizes)
      const matchesSize = selectedSizes.length === 0 || 
                         p.sizes.some(s => selectedSizes.includes(s));
      
      return matchesSearch && matchesCategory && matchesGender && matchesMood && matchesPrice && matchesColor && matchesSize;
    });

    // Sort matching
    if (selectedSort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (selectedSort === "rating") {
      const getAvgRating = (p: Product) => 
        p.reviews.length > 0 ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length : 0;
      result = [...result].sort((a, b) => getAvgRating(b) - getAvgRating(a));
    } else if (selectedSort === "new") {
      result = [...result].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, activeCategory, activeGender, activeMood, selectedSort, maxPrice, selectedColors, selectedSizes]);

  // Cart operations
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
      return [
        ...prev,
        {
          ...product,
          image: product.image || FALLBACK_IMAGE,
          id,
          baseProductId: product.id,
          quantity: 1,
          name: size ? `${product.name} (${size})` : product.name,
        },
      ];
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

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const calculateDiscounts = () => {
    let discountAmount = 0;
    const itemsList: Product[] = [];
    cart.forEach(item => {
      for(let i = 0; i < item.quantity; i++) itemsList.push(item);
    });

    // Buy 4 Get 1 Free (Cheapest is free)
    itemsList.sort((a, b) => a.price - b.price);
    const freeItemsCount = Math.floor(itemsList.length / 5);
    for(let i = 0; i < freeItemsCount; i++) {
      discountAmount += itemsList[i].price;
    }

    // Additional 15% off if subtotal after BOGO is > ₹10,000
    if ((subtotal - discountAmount) > 10000) {
      discountAmount += (subtotal - discountAmount) * 0.15;
    }

    // Coupon discount logic
    if (appliedCoupon === "CORE15") {
      discountAmount += (subtotal - discountAmount) * 0.15;
    }

    return discountAmount;
  };

  const totalDiscount = calculateDiscounts();
  const total = Math.max(0, subtotal - totalDiscount);

  // Fetch user orders matching phone number
  const fetchUserOrders = async (phoneToUse?: string) => {
    const targetPhone = phoneToUse || phoneNumber;
    if (!targetPhone) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/phone/${targetPhone}`);
      if (res.ok) {
        const data = await res.json();
        setUserOrders(data);
      }
    } catch (err) {
      console.error("Error fetching user orders:", err);
    }
  };

  // Cancel an active order
  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
        method: "PUT"
      });
      if (res.ok) {
        alert("Order cancelled successfully.");
        await fetchUserOrders();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  // Add a product review
  const addProductReview = async (productId: string, reviewData: { user: string; rating: number; comment: string }) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error("Failed to submit review");
      const savedReview = await res.json();

      // Update local state
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          const updatedReviews = [...(p.reviews || []), savedReview];
          return {
            ...p,
            reviews: updatedReviews
          };
        }
        return p;
      }));

      // Also update selectedProduct so the modal shows it immediately
      setSelectedProduct(prev => {
        if (prev && prev.id === productId) {
          return {
            ...prev,
            reviews: [...(prev.reviews || []), savedReview]
          };
        }
        return prev;
      });

      return true;
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Unable to post review. Please check connection.");
      return false;
    }
  };

  // Authentication Flow
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpSent) {
      if (otp === "1234") {
        setIsLoggedIn(true);
        setIsProfileOpen(false);
        try {
          localStorage.setItem("core_is_logged_in", "true");
          localStorage.setItem("core_phone_number", phoneNumber);
          localStorage.setItem("core_user_name", userName);
        } catch (err) {
          console.warn("localStorage write error:", err);
        }
        // Fetch orders immediately
        fetchUserOrders(phoneNumber);
      } else {
        alert("Invalid verification code. Use 1234");
      }
    } else {
      if (/^\d{10}$/.test(phoneNumber)) {
        setOtpSent(true);
      } else {
        alert("Enter a valid 10-digit phone number");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPhoneNumber("");
    setOtp("");
    setOtpSent(false);
    setUserOrders([]);
    try {
      localStorage.removeItem("core_is_logged_in");
      localStorage.removeItem("core_phone_number");
      localStorage.removeItem("core_user_name");
    } catch (err) {
      console.warn("localStorage clear error:", err);
    }
  };

  // Place Order API
  const handlePlaceOrder = async () => {
    const isValidPhone = /^\d{10}$/.test(phoneNumber);
    if (!isValidPhone) {
      alert("Verify phone number before checkout.");
      setCheckoutStep("phone");
      return;
    }

    if (!checkoutName || !checkoutEmail || !checkoutAddress || !checkoutCity || !checkoutZip) {
      alert("Please enter all address details.");
      setCheckoutStep("address");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardName || cardNumber.replace(/\s/g, "").length < 13 || !cardExpiry || cardCvv.length < 3) {
        alert("Enter valid credit/debit card details.");
        return;
      }
    }

    if (paymentMethod === "upi" && !upiId.includes("@")) {
      alert("Please enter a valid UPI ID (e.g. user@okaxis).");
      return;
    }

    const orderPayload = {
      items: cart.map(item => ({
        id: item.baseProductId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingDetails: {
        name: checkoutName,
        email: checkoutEmail,
        phone: phoneNumber
      },
      deliveryPoint: {
        address: checkoutAddress,
        city: checkoutCity,
        zip: checkoutZip
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "authorized"
      },
      subtotal,
      totalDiscount,
      total
    };

    setIsOrdering(true);

    const tempOrderId = `CR-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update state instantly so the UI transitions immediately
    setLatestPlacedOrder({
      id: tempOrderId,
      total,
      eta: "3-5 Business Days",
      items: orderPayload.items
    });

    setCart([]);
    setIsCheckoutOpen(false);
    setShowOrderSuccess(true);
    setIsOrdering(false);

    // Log user in automatically on checkout success
    setIsLoggedIn(true);
    try {
      localStorage.setItem("core_is_logged_in", "true");
      localStorage.setItem("core_phone_number", phoneNumber);
      localStorage.setItem("core_user_name", checkoutName || "Protocol Member");
    } catch (err) {
      console.warn("localStorage sync error:", err);
    }

    // Reset checkout forms
    setCheckoutName("");
    setCheckoutEmail("");
    setCheckoutAddress("");
    setCheckoutCity("");
    setCheckoutZip("");
    setCheckoutStep("phone");
    setPaymentMethod("card");
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setUpiId("");
    setAppliedCoupon(null);

    // Fire network request in the background
    fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    })
      .then(async res => {
        if (res.ok) {
          const responseData = await res.json();
          // Update order ID with the real database one
          if (responseData && responseData.orderId) {
            setLatestPlacedOrder(prev => {
              if (prev && prev.id === tempOrderId) {
                return {
                  ...prev,
                  id: responseData.orderId,
                  eta: responseData.eta || prev.eta
                };
              }
              return prev;
            });
            // Fetch updated orders
            fetchUserOrders(phoneNumber);
          }
        }
      })
      .catch(err => {
        console.warn("Background order post failed:", err);
        fetchUserOrders(phoneNumber);
      });
  };

  // Track Order API
  const handleTrackQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api/orders/${trackingId.trim()}`);
      if (!res.ok) {
        alert("Order tracking code not found in records.");
        setTrackingStatus(null);
        return;
      }
      const data = await res.json();
      setTrackingStatus(data);
    } catch (err) {
      console.error("Error loading order tracking details:", err);
      alert("Signal error connecting to tracking services.");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <ShopContext.Provider value={{
      products,
      filteredProducts,
      cart,
      wishlist,
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      activeGender,
      setActiveGender,
      activeMood,
      setActiveMood,
      
      selectedSort,
      setSelectedSort,
      maxPrice,
      setMaxPrice,
      selectedColors,
      toggleColorFilter,
      selectedSizes,
      toggleSizeFilter,
      clearFilters,

      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isTrackOrderOpen,
      setIsTrackOrderOpen,
      isProfileOpen,
      setIsProfileOpen,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      showPromoPopup,
      setShowPromoPopup,

      selectedProduct,
      setSelectedProduct,

      addToCart,
      toggleWishlist,
      updateQuantity,
      subtotal,
      totalDiscount,
      total,

      isLoggedIn,
      setIsLoggedIn,
      phoneNumber,
      setPhoneNumber,
      otp,
      setOtp,
      otpSent,
      setOtpSent,
      userName,
      setUserName,
      handleLoginSubmit,
      handleLogout,

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
      handlePlaceOrder,

      trackingId,
      setTrackingId,
      trackingStatus,
      setTrackingStatus,
      handleTrackQuery,

      // User Orders Ledger
      userOrders,
      showOrderSuccess,
      setShowOrderSuccess,
      latestPlacedOrder,
      fetchUserOrders,
      cancelOrder,
      addProductReview,

      appliedCoupon,
      setAppliedCoupon,

      formatPrice,
      isOrdering,
      apiBase: API_BASE
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
