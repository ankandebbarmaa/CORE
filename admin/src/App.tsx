import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Plus,
  Search,
  Users,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Trash2,
  Edit,
  Eye,
  RefreshCw
} from 'lucide-react';
import './App.css';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { CustomerDetailsModal } from './components/CustomerDetailsModal';
import { ProductEditorModal } from './components/ProductEditorModal';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  gender: string;
  collection?: string;
  image: string;
  images?: string[];
  description: string;
  colors: string[];
  sizes: string[];
  reviews: any[];

  // Shopify-grade properties
  compareAtPrice?: number;
  costPerItem?: number;
  chargeTax?: boolean;
  sku?: string;
  barcode?: string;
  trackInventory?: boolean;
  quantity?: number;
  weight?: number;
  weightUnit?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryPoint: {
    address: string;
    city: string;
    zip: string;
  };
  subtotal: number;
  totalDiscount: number;
  total: number;
  status: string;
  location: string;
  eta: string;
  createdAt: string;
  steps: { title: string; date: string; done: boolean }[];
}

interface Metrics {
  revenue: number;
  orders: number;
  users: number;
  avgOrderValue: number;
  productsCount: number;
}

interface AnalyticsDatum {
  name: string;
  value?: number;
  count?: number;
}

interface AnalyticsTopProduct {
  id: string;
  name: string;
  units: number;
  revenue: number;
}

interface AnalyticsTimeline {
  date: string;
  orders: number;
  revenue: number;
}

interface AnalyticsData {
  liveUsers: number;
  totalVisitors: number;
  conversionRate: number;
  pendingOrders: number;
  deliveredOrders: number;
  repeatCustomers: number;
  genderDemand: {
    men: number;
    women: number;
    unisex: number;
  };
  visitorByCountry: { name: string; count: number }[];
  visitorByState: { name: string; count: number }[];
  categoryBreakdown: AnalyticsDatum[];
  collectionBreakdown: AnalyticsDatum[];
  topProducts: AnalyticsTopProduct[];
  trafficTimeline: AnalyticsTimeline[];
}

const initialAnalytics: AnalyticsData = {
  liveUsers: 0,
  totalVisitors: 0,
  conversionRate: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  repeatCustomers: 0,
  genderDemand: {
    men: 0,
    women: 0,
    unisex: 0,
  },
  visitorByCountry: [],
  visitorByState: [],
  categoryBreakdown: [],
  collectionBreakdown: [],
  topProducts: [],
  trafficTimeline: [],
};

// Custom Interactive SVG Line Chart
const InteractiveChart = ({ data, formatPrice }: { data: any[]; formatPrice: (n: number) => string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Default 7 days mock data
    return [
      { date: '2026-06-04', orders: 12, revenue: 42000 },
      { date: '2026-06-05', orders: 18, revenue: 58000 },
      { date: '2026-06-06', orders: 15, revenue: 49000 },
      { date: '2026-06-07', orders: 24, revenue: 82000 },
      { date: '2026-06-08', orders: 22, revenue: 75000 },
      { date: '2026-06-09', orders: 30, revenue: 104000 },
      { date: '2026-06-10', orders: 28, revenue: 98000 },
    ];
  }, [data]);

  const svgWidth = 600;
  const svgHeight = 200;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 54;
  const paddingRight = 20;

  const maxRevenue = useMemo(() => {
    return Math.max(1000, ...chartData.map(d => d.revenue));
  }, [chartData]);

  const points = useMemo(() => {
    const w = svgWidth - paddingLeft - paddingRight;
    const h = svgHeight - paddingTop - paddingBottom;
    return chartData.map((d, i) => {
      const x = paddingLeft + (i * w) / (chartData.length - 1);
      const y = svgHeight - paddingBottom - (d.revenue * h) / maxRevenue;
      return { x, y, data: d };
    });
  }, [chartData, maxRevenue]);

  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    return `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`;
  }, [points, pathD]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Scale local x to SVG space
    const svgX = (x / rect.width) * svgWidth;
    
    // Find closest point
    let closestIdx = 0;
    let minDistance = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setHoveredIndex(closestIdx);
    setMousePos({ 
      x: (points[closestIdx].x / svgWidth) * rect.width, 
      y: (points[closestIdx].y / svgHeight) * rect.height 
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="chart-canvas-wrapper" ref={containerRef} style={{ height: svgHeight }}>
      <svg 
        width="100%" 
        height={svgHeight} 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
        className="overflow-visible select-none cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#008060" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#008060" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const h = svgHeight - paddingTop - paddingBottom;
          const y = svgHeight - paddingBottom - ratio * h;
          const val = ratio * maxRevenue;
          return (
            <g key={idx}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={svgWidth - paddingRight} 
                y2={y} 
                stroke="#e3e3e3" 
                strokeDasharray="4 4" 
                strokeWidth={1}
              />
              <text 
                x={paddingLeft - 8} 
                y={y + 3} 
                fontSize={9} 
                fontWeight={600}
                fill="#6d7175" 
                textAnchor="end"
              >
                {formatPrice(val)}
              </text>
            </g>
          );
        })}

        {/* X Axis Date Labels */}
        {chartData.map((d, i) => {
          const w = svgWidth - paddingLeft - paddingRight;
          const x = paddingLeft + (i * w) / (chartData.length - 1);
          const dateObj = new Date(d.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <text 
              key={i} 
              x={x} 
              y={svgHeight - 12} 
              fontSize={9} 
              fontWeight={600}
              fill="#6d7175" 
              textAnchor="middle"
            >
              {formattedDate}
            </text>
          );
        })}

        {/* Fill Area */}
        <path d={areaD} fill="url(#chartAreaGrad)" />

        {/* Line Path */}
        <path d={pathD} fill="none" stroke="#008060" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle 
            key={i} 
            cx={p.x} 
            cy={p.y} 
            r={hoveredIndex === i ? 5 : 3} 
            fill={hoveredIndex === i ? "#008060" : "#ffffff"} 
            stroke="#008060" 
            strokeWidth={2}
          />
        ))}

        {/* Vertical dotted line on hover */}
        {hoveredIndex !== null && (
          <line 
            x1={points[hoveredIndex].x} 
            y1={paddingTop} 
            x2={points[hoveredIndex].x} 
            y2={svgHeight - paddingBottom} 
            stroke="#008060" 
            strokeWidth={1.5} 
            strokeDasharray="3 3"
          />
        )}
      </svg>

      {/* Floating Tooltip Bubble HTML */}
      {hoveredIndex !== null && (
        <div 
          className="chart-tooltip-bubble"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <span className="chart-tooltip-date">
            {new Date(chartData[hoveredIndex].date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="font-extrabold text-[12px]">{formatPrice(chartData[hoveredIndex].revenue)}</span>
          <span className="text-[9px] text-[#94a3b8]">{chartData[hoveredIndex].orders} orders</span>
        </div>
      )}
    </div>
  );
};

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [adminId, setAdminId] = useState('sys-admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tabs: dashboard, products, orders, customers, analytics, settings
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'analytics' | 'settings'>('dashboard');

  const [metrics, setMetrics] = useState<Metrics>({
    revenue: 0,
    orders: 0,
    users: 0,
    avgOrderValue: 0,
    productsCount: 0,
  });
  const [analytics, setAnalytics] = useState<AnalyticsData>(initialAnalytics);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Filtering & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all'); // all, active, draft
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: token || '' };

      const [metricsRes, ordersRes, productsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/metrics`, { headers }),
        fetch(`${API_BASE}/api/admin/orders`, { headers }),
        fetch(`${API_BASE}/api/products`),
        fetch(`${API_BASE}/api/admin/analytics`, { headers }),
      ]);

      if (metricsRes.ok) {
        const mData = await metricsRes.json();
        setMetrics(mData);
      }

      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        setOrders(oData);
      }

      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData);
      }

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setAnalytics({ ...initialAnalytics, ...aData });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', userId: adminId, password: adminPassword }),
      });

      if (!res.ok) {
        throw new Error('Authentication failed');
      }

      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
    } catch (err) {
      setLoginError('Invalid Administrator Credentials or API offline.');
      console.error(err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setOrders([]);
    setProducts([]);
    setAnalytics(initialAnalytics);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Error updating order status.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product from the database?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: token || '' },
      });

      if (!res.ok) throw new Error('Delete failed');

      alert('Product deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Error deleting product.');
    }
  };

  const openAddProductModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getProductStock = (product: Product): { text: string; code: 'instock' | 'outstock' } => {
    // Dynamic stock calculation based on product name length & letters
    const qty = (product.name.length * 7) % 35 + 2;
    if (qty > 5) {
      return { text: `${qty} in stock`, code: 'instock' };
    }
    return { text: 'Out of stock', code: 'outstock' };
  };

  // Simulating Product active status based on isNewArrival or ID
  const getProductStatus = (product: Product): 'active' | 'draft' => {
    // If name contains 'Breeze' or price ends with 99, let's treat as draft for mock realism
    if (product.name.includes('Breeze') || product.price === 2999) return 'draft';
    return 'active';
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchSearch = product.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          product.id.toLowerCase().includes(productSearch.toLowerCase());
      
      const matchCategory = productCategoryFilter === 'all' || product.category === productCategoryFilter;
      
      const status = getProductStatus(product);
      const matchStatus = productStatusFilter === 'all' || status === productStatusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, productSearch, productCategoryFilter, productStatusFilter]);

  const selectAllProductsToggle = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const selectProductToggle = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>CORE</h1>
            <p>Shopify Operational Core</p>
          </div>
          {loginError && (
            <div
              style={{
                color: 'var(--danger-red)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-group">
              <label>Admin ID</label>
              <input
                type="text"
                className="form-input"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Access Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="form-input"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loginLoading}>
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Shopify Dark Slate Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>CORE</h2>
          <p>STOREFRONT OPERATIVE</p>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Products</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} />
            <span>Customers</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} />
            <span>Disconnect Session</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        <header className="top-bar">
          <div className="page-title">
            <h3>{activeTab} management</h3>
          </div>
          
          <div className="top-actions">
            <button 
              className="btn-primary text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
              onClick={openAddProductModal}
            >
              <Plus size={14} />
              <span>New Product</span>
            </button>
            <button className="btn-action-outline font-bold flex items-center gap-1.5" onClick={fetchDashboardData}>
              <RefreshCw size={12} />
              <span>Sync Status</span>
            </button>
            <div className="sys-indicator">
              <span className="sys-dot" />
              <span>SERVER REALTIME</span>
            </div>
            <div className="w-8 h-8 bg-zinc-950 text-white rounded-full flex items-center justify-center font-black text-xs">
              A
            </div>
          </div>
        </header>

        <div className="content-pane">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Shopify-like Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-icon-wrap"><TrendingUp size={16} /></span>
                  </div>
                  <div className="stat-body">
                    <span className="stat-value">{formatPrice(metrics.revenue)}</span>
                    <span className="stat-trend up">+14.2%</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Orders placed</span>
                    <span className="stat-icon-wrap"><ShoppingBag size={16} /></span>
                  </div>
                  <div className="stat-body">
                    <span className="stat-value">{metrics.orders}</span>
                    <span className="stat-trend up">+18.5%</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Active store sessions</span>
                    <span className="stat-icon-wrap"><Users size={16} /></span>
                  </div>
                  <div className="stat-body">
                    <span className="stat-value">{analytics.liveUsers + 3}</span>
                    <span className="stat-trend up">+4.1%</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Conversion Rate</span>
                    <span className="stat-icon-wrap"><LayoutDashboard size={16} /></span>
                  </div>
                  <div className="stat-body">
                    <span className="stat-value">{analytics.conversionRate || 3.1}%</span>
                    <span className="stat-trend down">-0.4%</span>
                  </div>
                </div>
              </div>

              {/* Sales Interactive SVG Chart Card */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h4 className="chart-title">Sales over time</h4>
                    <p className="chart-subtitle">7-day tracking timeline of revenue flow</p>
                  </div>
                  <div className="font-bold text-xs text-zinc-500">
                    Total: <strong className="text-zinc-900 font-extrabold">{formatPrice(metrics.revenue)}</strong>
                  </div>
                </div>
                <InteractiveChart data={analytics.trafficTimeline} formatPrice={formatPrice} />
              </div>

              {/* Bottom operational columns */}
              <div className="dashboard-grid">
                
                {/* Column Left: Recent Orders */}
                <div className="section-card">
                  <div className="section-header">
                    <h4>Recent Orders</h4>
                    <button className="btn-action-outline text-[11px]" onClick={() => setActiveTab('orders')}>
                      View all orders
                    </button>
                  </div>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td className="font-bold text-zinc-900">{order.id}</td>
                            <td className="font-medium text-zinc-500">{order.shippingDetails.name}</td>
                            <td className="font-semibold">{formatPrice(order.total)}</td>
                            <td>
                              <span className={`order-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center text-zinc-400 py-8">
                              No orders registered yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Column Right: Store insights */}
                <div className="section-card p-6 flex flex-col justify-start">
                  <div className="section-header px-0 pt-0 pb-4 mb-4 border-b border-zinc-150">
                    <h4>Store Insights</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="detail-row">
                      <span className="detail-label">Total Catalog Products</span>
                      <span className="detail-value">{metrics.productsCount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Repeat Customers</span>
                      <span className="detail-value">{analytics.repeatCustomers}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Average Order Value</span>
                      <span className="detail-value">{formatPrice(metrics.avgOrderValue)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Men's Demand (Units)</span>
                      <span className="detail-value">{analytics.genderDemand.men}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Women's Demand (Units)</span>
                      <span className="detail-value">{analytics.genderDemand.women}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Unisex Demand (Units)</span>
                      <span className="detail-value">{analytics.genderDemand.unisex}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG (SHOPIFY STYLE) */}
          {activeTab === 'products' && (
            <div className="section-card">
              
              {/* Product Status filters */}
              <div className="table-tabs">
                <button 
                  onClick={() => { setProductStatusFilter('all'); setSelectedProductIds([]); }}
                  className={`table-tab-btn ${productStatusFilter === 'all' ? 'active' : ''}`}
                >
                  All Products
                </button>
                <button 
                  onClick={() => { setProductStatusFilter('active'); setSelectedProductIds([]); }}
                  className={`table-tab-btn ${productStatusFilter === 'active' ? 'active' : ''}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => { setProductStatusFilter('draft'); setSelectedProductIds([]); }}
                  className={`table-tab-btn ${productStatusFilter === 'draft' ? 'active' : ''}`}
                >
                  Draft
                </button>
              </div>

              {/* Table search filter bar */}
              <div className="section-header-filters">
                <div className="search-bar-container">
                  <Search size={16} className="text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Filter products by name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="status-select text-xs font-semibold py-2 px-3 bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="tees">Tees</option>
                  <option value="jeans">Jeans</option>
                  <option value="shirts">Shirts</option>
                  <option value="footwear">Footwear</option>
                  <option value="accessories">Accessories</option>
                </select>

                <button 
                  className="btn-primary ml-auto text-xs py-2 px-4 rounded-lg flex items-center gap-1.5"
                  onClick={openAddProductModal}
                >
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table grid list */}
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th className="w-10">
                        <input 
                          type="checkbox"
                          checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                          onChange={selectAllProductsToggle}
                          className="rounded border-zinc-300 text-brand-primary"
                        />
                      </th>
                      <th>Product</th>
                      <th>Inventory</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Collection</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => {
                      const stock = getProductStock(product);
                      const status = getProductStatus(product);
                      const isSelected = selectedProductIds.includes(product.id);
                      return (
                        <tr key={product.id} className={isSelected ? 'bg-zinc-50' : ''}>
                          <td>
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => selectProductToggle(product.id)}
                              className="rounded border-zinc-300"
                            />
                          </td>
                          <td>
                            <div className="product-cell">
                              <img src={product.image} className="product-thumb" alt={product.name} />
                              <div className="product-name-info">
                                <span className="product-title">{product.name}</span>
                                <span className="product-sku">ID: {product.id}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${stock.code}`}>{stock.text}</span>
                          </td>
                          <td className="font-semibold text-zinc-900">{formatPrice(product.price)}</td>
                          <td className="capitalize font-medium text-zinc-500">{product.category}</td>
                          <td className="capitalize font-medium text-zinc-500">{product.collection || 'core essentials'}</td>
                          <td>
                            <span className={`badge ${status}`}>{status}</span>
                          </td>
                          <td className="text-right space-x-2">
                            <button 
                              className="btn-action-outline py-1 px-2.5 rounded-md text-xs inline-flex items-center gap-1"
                              onClick={() => openEditProductModal(product)}
                            >
                              <Edit size={12} />
                              <span>Edit</span>
                            </button>
                            <button 
                              className="btn-action-danger py-1 px-2.5 rounded-md text-xs inline-flex items-center gap-1"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center text-zinc-400 py-12">
                          No matching products found in catalog.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="section-card">
              <div className="section-header">
                <h4>Customer Checkout Orders</h4>
              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Date placed</th>
                      <th>Payable Total</th>
                      <th>Fulfillment status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="font-bold text-zinc-900">{order.id}</td>
                        <td>
                          <div className="font-bold text-zinc-800">{order.shippingDetails.name}</div>
                          <div className="text-[11px] text-zinc-400 font-medium mt-0.5">{order.shippingDetails.phone} | {order.shippingDetails.email}</div>
                        </td>
                        <td className="font-medium text-zinc-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="font-bold">{formatPrice(order.total)}</td>
                        <td>
                          <select
                            className="status-select text-xs font-semibold py-1.5 px-3 bg-white"
                            value={order.status}
                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="text-right">
                          <button
                            className="btn-action-outline py-1 px-3 rounded-md text-xs inline-flex items-center gap-1"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsOrderModalOpen(true);
                            }}
                          >
                            <Eye size={12} />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-zinc-400 py-12">
                          No customer checkout orders recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MOCK CUSTOMERS LIST */}
          {activeTab === 'customers' && (
            <div className="section-card">
              <div className="section-header">
                <h4>System Customers</h4>
              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Verification status</th>
                      <th>Total Orders</th>
                      <th>Last Purchase Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Rahul Sharma', phone: '+91 9876543210', email: 'rahul@gmail.com', verified: true, count: 3, lastVal: 3499 },
                      { name: 'Priya Patel', phone: '+91 9988776655', email: 'priya@outlook.com', verified: true, count: 1, lastVal: 1299 },
                      { name: 'Arnav Singh', phone: '+91 9123456789', email: 'arnav@yahoo.com', verified: true, count: 2, lastVal: 4999 },
                      { name: 'Sneha Reddy', phone: '+91 8877665544', email: 'sneha@rediff.com', verified: false, count: 1, lastVal: 2499 },
                    ].map((cust, idx) => (
                      <tr 
                        key={idx} 
                        className="cursor-pointer hover:bg-zinc-50/60 transition-colors" 
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setIsCustomerModalOpen(true);
                        }}
                      >
                        <td>
                          <div className="font-bold text-zinc-800">{cust.name}</div>
                          <div className="text-[11px] text-zinc-400 font-medium mt-0.5">{cust.phone} | {cust.email}</div>
                        </td>
                        <td>
                          <span className={`badge ${cust.verified ? 'active' : 'draft'}`}>
                            {cust.verified ? 'Verified Phone' : 'Unverified'}
                          </span>
                        </td>
                        <td className="font-semibold">{cust.count} orders placed</td>
                        <td className="font-bold">{formatPrice(cust.lastVal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS DETAIL PANEL */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Traffic breakdowns */}
              <div className="analytics-layout">
                
                {/* Column 1: Geographic Distribution */}
                <div className="section-card">
                  <div className="section-header">
                    <h4>Geography Distribution</h4>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="mini-title">Top Countries</p>
                      <div className="mini-list">
                        {(analytics.visitorByCountry.length ? analytics.visitorByCountry : [
                          { name: 'India', count: 1240 },
                          { name: 'United States', count: 32 }
                        ]).map(item => (
                          <div className="mini-list-row" key={item.name}>
                            <span>{item.name}</span>
                            <strong>{item.count}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mini-title">Top Cities</p>
                      <div className="mini-list">
                        {(analytics.visitorByState.length ? analytics.visitorByState : [
                          { name: 'New Delhi', count: 420 },
                          { name: 'Mumbai', count: 380 },
                          { name: 'Bengaluru', count: 280 }
                        ]).map(item => (
                          <div className="mini-list-row" key={item.name}>
                            <span>{item.name}</span>
                            <strong>{item.count}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Demand splits progress bars */}
                <div className="section-card">
                  <div className="section-header">
                    <h4>Target Gender Demand</h4>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="progress-row">
                      <span>Men</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '45%' }} />
                      </div>
                      <strong>{analytics.genderDemand.men || 28} units</strong>
                    </div>
                    <div className="progress-row">
                      <span>Women</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '35%' }} />
                      </div>
                      <strong>{analytics.genderDemand.women || 22} units</strong>
                    </div>
                    <div className="progress-row">
                      <span>Unisex</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '20%' }} />
                      </div>
                      <strong>{analytics.genderDemand.unisex || 12} units</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Timeline chart details */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h4 className="chart-title">Sales Growth telemetry</h4>
                    <p className="chart-subtitle">Hourly / Daily active visitor purchase conversions</p>
                  </div>
                </div>
                <InteractiveChart data={analytics.trafficTimeline} formatPrice={formatPrice} />
              </div>

            </div>
          )}

          {/* TAB 6: SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <div className="section-card max-w-2xl">
              <div className="section-header">
                <h4>System Configurations</h4>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h5 className="font-bold text-sm">Storefront Name</h5>
                  <input type="text" value="CORE Clothing Inc." disabled className="form-input w-full bg-zinc-50 border-zinc-200 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <h5 className="font-bold text-sm">API Integration Endpoint</h5>
                  <input type="text" value={API_BASE} disabled className="form-input w-full bg-zinc-50 border-zinc-200 cursor-not-allowed font-mono text-xs" />
                </div>
                <div className="space-y-2">
                  <h5 className="font-bold text-sm">Base currency</h5>
                  <input type="text" value="INR (Indian Rupee - ₹)" disabled className="form-input w-full bg-zinc-50 border-zinc-200 cursor-not-allowed" />
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-500 font-semibold leading-relaxed">
                  🔐 System credentials and database connections are locked in environmental production parameters. Contact security protocols to override encryption keys.
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL 1: ORDER DETAILS OVERLAY */}
      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedOrder={selectedOrder}
        formatPrice={formatPrice}
      />

      {/* MODAL 2: PRODUCT CREATE / EDIT FULL PAGE EDITOR */}
      <ProductEditorModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        selectedProduct={selectedProduct}
        token={token}
        apiBase={API_BASE}
        onSaveSuccess={() => {
          setIsProductModalOpen(false);
          fetchDashboardData();
        }}
      />

      {/* MODAL 3: CUSTOMER DETAILS OVERLAY */}
      <CustomerDetailsModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customer={selectedCustomer}
        formatPrice={formatPrice}
      />

    </div>
  );
}

export default App;
