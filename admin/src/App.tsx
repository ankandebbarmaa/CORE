import { useMemo, useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Plus,
  X,
} from 'lucide-react';
import './App.css';

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
  reviews: unknown[];
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

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [adminId, setAdminId] = useState('sys-admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

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

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pOriginalPrice, setPOriginalPrice] = useState('');
  const [pCategory, setPCategory] = useState('hoodies');
  const [pGender, setPGender] = useState('unisex');
  const [pCollection, setPCollection] = useState('core essentials');
  const [pImage, setPImage] = useState('');
  const [pImagePreview, setPImagePreview] = useState('');
  const [pImageUploaded, setPImageUploaded] = useState(false);
  const [pDescription, setPDescription] = useState('');
  const [pColors, setPColors] = useState('');
  const [pSizes, setPSizes] = useState('');

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: token || '' };

      const [metricsRes, ordersRes, productsRes, analyticsRes] = await Promise.all([
        fetch('http://localhost:4000/api/admin/metrics', { headers }),
        fetch('http://localhost:4000/api/admin/orders', { headers }),
        fetch('http://localhost:4000/api/products'),
        fetch('http://localhost:4000/api/admin/analytics', { headers }),
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
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
      const res = await fetch(`http://localhost:4000/api/admin/orders/${orderId}/status`, {
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
      const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
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
    setPId('');
    setPName('');
    setPPrice('');
    setPOriginalPrice('');
    setPCategory('hoodies');
    setPGender('unisex');
    setPCollection('core essentials');
    setPImage('');
    setPImagePreview('');
    setPDescription('');
    setPColors('#000000, #FFFFFF');
    setPSizes('S, M, L, XL');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setSelectedProduct(product);
    setPId(product.id);
    setPName(product.name);
    setPPrice(product.price.toString());
    setPOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setPCategory(product.category);
    setPGender(product.gender);
    setPCollection(product.collection || 'core essentials');
    setPImage(product.image);
    setPImagePreview(product.image);
    setPDescription(product.description);
    setPColors(product.colors.join(', '));
    setPSizes(product.sizes.join(', '));
    setIsProductModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      setPImage(result);
      setPImagePreview(result);
      setPImageUploaded(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImageToServer = async () => {
    if (!pImage) return;
    try {
      const res = await fetch('http://localhost:4000/api/uploads/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify({ image: pImage }),
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data && data.url) {
        setPImage(data.url);
        setPImagePreview(data.url);
        setPImageUploaded(true);
        alert('Image uploaded successfully.');
      } else {
        throw new Error('Invalid upload response');
      }
    } catch (err) {
      console.error(err);
      alert('Image upload failed.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pName || !pPrice || !pImage) {
      alert('Please fill out Name, Price, and Product Image.');
      return;
    }

    const payload = {
      id: selectedProduct ? pId : undefined,
      name: pName,
      price: parseFloat(pPrice),
      originalPrice: pOriginalPrice ? parseFloat(pOriginalPrice) : undefined,
      category: pCategory,
      gender: pGender,
      collection: pCollection,
      image: pImage,
      images: [pImage],
      description: pDescription,
      colors: pColors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: pSizes.split(',').map(s => s.trim()).filter(Boolean),
    };

    const url = selectedProduct
      ? `http://localhost:4000/api/products/${pId}`
      : 'http://localhost:4000/api/products';

    const method = selectedProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save product failed');

      alert(selectedProduct ? 'Product updated successfully.' : 'Product created successfully.');
      setIsProductModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Error saving product.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const maxTimelineRevenue = useMemo(
    () => Math.max(1, ...analytics.trafficTimeline.map(t => t.revenue)),
    [analytics.trafficTimeline]
  );

  const maxCategoryDemand = useMemo(
    () => Math.max(1, ...analytics.categoryBreakdown.map(c => c.value || 0)),
    [analytics.categoryBreakdown]
  );

  const totalGenderDemand =
    analytics.genderDemand.men + analytics.genderDemand.women + analytics.genderDemand.unisex;

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>CORE SYSTEMS</h1>
            <p>Control Interface Access</p>
          </div>
          {loginError && (
            <div
              style={{
                color: '#ff453a',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Admin Protocol ID</label>
              <input
                type="text"
                className="form-input"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Access Encryption Key</label>
              <input
                type="password"
                placeholder="************"
                className="form-input"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loginLoading}>
              {loginLoading ? 'ENCRYPTING...' : 'INITIATE TERMINAL'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>CORE CTRL</h2>
          <p>STOREFRONT DECISION CORE</p>
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
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            DISCONNECT SESSION
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="page-title">
            <h3>{activeTab} Management</h3>
          </div>
          <div className="top-actions">
            <button className="btn-action-outline" onClick={fetchDashboardData}>
              Refresh Data
            </button>
            <div className="sys-indicator">
              <span className="sys-dot" />
              <span>API SERVER ONLINE</span>
            </div>
          </div>
        </header>

        <div className="content-pane">
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Sales</div>
                  <div className="stat-value">{formatPrice(metrics.revenue)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">{metrics.orders}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Live Users</div>
                  <div className="stat-value">{analytics.liveUsers}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Visitors</div>
                  <div className="stat-value">{analytics.totalVisitors}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending Orders</div>
                  <div className="stat-value">{analytics.pendingOrders}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Delivered Orders</div>
                  <div className="stat-value">{analytics.deliveredOrders}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Conversion Rate</div>
                  <div className="stat-value">{analytics.conversionRate}%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Average Basket</div>
                  <div className="stat-value">{formatPrice(metrics.avgOrderValue)}</div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="section-card">
                  <div className="section-header">
                    <h4>Recent Order Signals</h4>
                    <button className="btn-action-outline" onClick={() => setActiveTab('orders')}>
                      View All
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
                        {orders.slice(0, 6).map(order => (
                          <tr key={order.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.id}</td>
                            <td>{order.shippingDetails.name}</td>
                            <td>{formatPrice(order.total)}</td>
                            <td>
                              <span className={`order-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                              No orders recorded in system.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="section-card">
                  <div className="section-header">
                    <h4>Growth Intelligence</h4>
                  </div>
                  <div className="detail-row">
                    <span>Catalog Products</span>
                    <span>{metrics.productsCount}</span>
                  </div>
                  <div className="detail-row">
                    <span>Unique Buyers</span>
                    <span>{metrics.users}</span>
                  </div>
                  <div className="detail-row">
                    <span>Repeat Customers</span>
                    <span>{analytics.repeatCustomers}</span>
                  </div>
                  <div className="detail-row">
                    <span>Men Demand Units</span>
                    <span>{analytics.genderDemand.men}</span>
                  </div>
                  <div className="detail-row">
                    <span>Women Demand Units</span>
                    <span>{analytics.genderDemand.women}</span>
                  </div>
                  <div className="detail-row">
                    <span>Unisex Demand Units</span>
                    <span>{analytics.genderDemand.unisex}</span>
                  </div>
                  <div className="analytics-chip-wrap">
                    <div className="analytics-chip">Realtime Live Tracking</div>
                    <div className="analytics-chip">State and Country Traffic</div>
                    <div className="analytics-chip">Collection Performance</div>
                    <div className="analytics-chip">Website Funnel Snapshot</div>
                  </div>
                </div>
              </div>

              <div className="analytics-layout">
                <div className="section-card">
                  <div className="section-header">
                    <h4>Visitor Geography</h4>
                  </div>
                  <div className="analytics-2-col">
                    <div>
                      <p className="mini-title">Top Countries</p>
                      <div className="mini-list">
                        {(analytics.visitorByCountry.length ? analytics.visitorByCountry : [{ name: 'No data yet', count: 0 }]).map(
                          item => (
                            <div className="mini-list-row" key={`country-${item.name}`}>
                              <span>{item.name}</span>
                              <strong>{item.count}</strong>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="mini-title">Top States / Cities</p>
                      <div className="mini-list">
                        {(analytics.visitorByState.length ? analytics.visitorByState : [{ name: 'No data yet', count: 0 }]).map(
                          item => (
                            <div className="mini-list-row" key={`state-${item.name}`}>
                              <span>{item.name}</span>
                              <strong>{item.count}</strong>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="section-card">
                  <div className="section-header">
                    <h4>Demand Split (Male / Female / Unisex)</h4>
                  </div>
                  <div className="progress-row">
                    <span>Men</span>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${totalGenderDemand ? (analytics.genderDemand.men / totalGenderDemand) * 100 : 0}%` }}
                      />
                    </div>
                    <strong>{analytics.genderDemand.men}</strong>
                  </div>
                  <div className="progress-row">
                    <span>Women</span>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${totalGenderDemand ? (analytics.genderDemand.women / totalGenderDemand) * 100 : 0}%` }}
                      />
                    </div>
                    <strong>{analytics.genderDemand.women}</strong>
                  </div>
                  <div className="progress-row">
                    <span>Unisex</span>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${totalGenderDemand ? (analytics.genderDemand.unisex / totalGenderDemand) * 100 : 0}%` }}
                      />
                    </div>
                    <strong>{analytics.genderDemand.unisex}</strong>
                  </div>

                  <p className="mini-title" style={{ marginTop: '20px' }}>
                    Category Demand
                  </p>
                  {(analytics.categoryBreakdown.length ? analytics.categoryBreakdown : [{ name: 'No data', value: 0 }])
                    .slice(0, 6)
                    .map(item => (
                      <div className="progress-row" key={`category-${item.name}`}>
                        <span>{item.name}</span>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${((item.value || 0) / maxCategoryDemand) * 100}%` }}
                          />
                        </div>
                        <strong>{item.value || 0}</strong>
                      </div>
                    ))}
                </div>
              </div>

              <div className="analytics-layout" style={{ marginTop: '18px' }}>
                <div className="section-card">
                  <div className="section-header">
                    <h4>7 Day Sales Timeline</h4>
                  </div>
                  <div className="timeline-bars">
                    {(analytics.trafficTimeline.length
                      ? analytics.trafficTimeline
                      : [{ date: 'N/A', orders: 0, revenue: 0 }]
                    ).map(item => (
                      <div key={item.date} className="timeline-row">
                        <div className="timeline-date">{item.date.slice(5)}</div>
                        <div className="timeline-track">
                          <div
                            className="timeline-fill"
                            style={{ width: `${(item.revenue / maxTimelineRevenue) * 100}%` }}
                          />
                        </div>
                        <div className="timeline-meta">
                          <span>{item.orders} orders</span>
                          <strong>{formatPrice(item.revenue)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-card">
                  <div className="section-header">
                    <h4>Top Products & Collections</h4>
                  </div>
                  <p className="mini-title">Top Selling Products</p>
                  <div className="mini-list">
                    {(analytics.topProducts.length
                      ? analytics.topProducts
                      : [{ id: 'N/A', name: 'No data yet', units: 0, revenue: 0 }]
                    ).map(product => (
                      <div className="mini-list-row" key={`top-${product.id}`}>
                        <span>{product.name}</span>
                        <strong>
                          {product.units} units / {formatPrice(product.revenue)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <p className="mini-title" style={{ marginTop: '18px' }}>
                    Collection Performance
                  </p>
                  <div className="mini-list">
                    {(analytics.collectionBreakdown.length
                      ? analytics.collectionBreakdown
                      : [{ name: 'core essentials', value: 0 }]
                    )
                      .slice(0, 6)
                      .map(collection => (
                        <div className="mini-list-row" key={`col-${collection.name}`}>
                          <span>{collection.name}</span>
                          <strong>{collection.value || 0} units</strong>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="section-card">
              <div className="section-header">
                <h4>Catalog Product List</h4>
                <button className="btn-sm-primary" onClick={openAddProductModal}>
                  <Plus size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Add Product
                </button>
              </div>
              <div className="table-container">
                <table className="custom-table products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Collection</th>
                      <th>Gender</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <img src={product.image} className="product-thumb" alt={product.name} />
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{product.id}</td>
                        <td style={{ fontWeight: '500' }}>{product.name}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                        <td style={{ textTransform: 'capitalize' }}>{product.collection || 'core essentials'}</td>
                        <td style={{ textTransform: 'capitalize' }}>{product.gender}</td>
                        <td>
                          <button className="btn-action-outline" onClick={() => openEditProductModal(product)}>
                            Edit
                          </button>
                          <button className="btn-action-danger" onClick={() => handleDeleteProduct(product.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="section-card">
              <div className="section-header">
                <h4>System Customer Orders</h4>
              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Buyer Name</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Fulfillment status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.id}</td>
                        <td>
                          <div>{order.shippingDetails.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.shippingDetails.email}</div>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 'bold' }}>{formatPrice(order.total)}</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn-action-outline"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsOrderModalOpen(true);
                            }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
                          No customer checkout signals registered.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {isOrderModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={() => setIsOrderModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Order Breakdown: {selectedOrder.id}</h4>
              <button className="modal-close" onClick={() => setIsOrderModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span>Status Badge</span>
                <span>
                  <span className={`order-badge ${selectedOrder.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {selectedOrder.status}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span>Customer Name</span>
                <span>{selectedOrder.shippingDetails.name}</span>
              </div>
              <div className="detail-row">
                <span>Customer Email</span>
                <span>{selectedOrder.shippingDetails.email}</span>
              </div>
              <div className="detail-row">
                <span>Customer Phone</span>
                <span>{selectedOrder.shippingDetails.phone}</span>
              </div>
              <div className="detail-row">
                <span>Shipping Address</span>
                <span>{selectedOrder.deliveryPoint.address}</span>
              </div>
              <div className="detail-row">
                <span>City and Zip</span>
                <span>
                  {selectedOrder.deliveryPoint.city}, {selectedOrder.deliveryPoint.zip}
                </span>
              </div>
              <div className="detail-row">
                <span>Current Location</span>
                <span>{selectedOrder.location}</span>
              </div>
              <div className="detail-row">
                <span>ETA Promised</span>
                <span>{selectedOrder.eta}</span>
              </div>

              <div className="detail-items-list">
                <h5>Items Checked Out</h5>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="detail-item-row">
                    <img src={item.image} className="product-thumb" alt={item.name} />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        ID: {item.id} / Price: {formatPrice(item.price)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>x{item.quantity}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <div className="detail-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.totalDiscount > 0 && (
                  <div className="detail-row">
                    <span>Discounts</span>
                    <span style={{ color: '#ff453a' }}>-{formatPrice(selectedOrder.totalDiscount)}</span>
                  </div>
                )}
                <div className="detail-row" style={{ borderBottom: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                  <span>Net Total Charged</span>
                  <span style={{ color: 'var(--accent-bright)' }}>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-action-outline" onClick={() => setIsOrderModalOpen(false)}>
                Dismiss Details
              </button>
            </div>
          </div>
        </div>
      )}

      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="modal-header">
                <h4>{selectedProduct ? `Edit Product: ${pId}` : 'Add New Product'}</h4>
                <button type="button" className="modal-close" onClick={() => setIsProductModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" className="form-input" value={pName} onChange={e => setPName(e.target.value)} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Retail Price (INR)</label>
                    <input type="number" className="form-input" value={pPrice} onChange={e => setPPrice(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Original Price (INR - Optional)</label>
                    <input type="number" className="form-input" value={pOriginalPrice} onChange={e => setPOriginalPrice(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-input" value={pCategory} onChange={e => setPCategory(e.target.value)}>
                      <option value="hoodies">Hoodies</option>
                      <option value="tees">Tees</option>
                      <option value="jeans">Jeans</option>
                      <option value="footwear">Footwear</option>
                      <option value="shirts">Shirts</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Gender Targeting</label>
                    <select className="form-input" value={pGender} onChange={e => setPGender(e.target.value)}>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Collection</label>
                  <select className="form-input" value={pCollection} onChange={e => setPCollection(e.target.value)}>
                    <option value="core essentials">Core Essentials</option>
                    <option value="new arrivals">New Arrivals</option>
                    <option value="summer drop">Summer Drop</option>
                    <option value="street archive">Street Archive</option>
                    <option value="premium capsule">Premium Capsule</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Product Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={pImage}
                    onChange={e => {
                      setPImage(e.target.value);
                      setPImagePreview(e.target.value);
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Or Upload Image</label>
                  <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    {pImage && pImage.startsWith('data:') && (
                      <button type="button" className="btn-sm-primary" onClick={handleUploadImageToServer}>
                        Upload Image
                      </button>
                    )}
                    {pImage && !pImage.startsWith('data:') && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Image ready</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Brief Description</label>
                  <textarea
                    className="form-input"
                    style={{ height: '80px', resize: 'vertical' }}
                    value={pDescription}
                    onChange={e => setPDescription(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Hex Colors (comma separated)</label>
                    <input type="text" className="form-input" value={pColors} onChange={e => setPColors(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Sizes Available (comma separated)</label>
                    <input type="text" className="form-input" value={pSizes} onChange={e => setPSizes(e.target.value)} />
                  </div>
                </div>
                <div className="upload-preview-wrapper">
                  {pImagePreview ? (
                    <>
                      <img
                        src={pImagePreview}
                        alt="Product preview"
                        className="upload-preview"
                        onError={() => setPImagePreview('')}
                      />
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {pImageUploaded ? 'Uploaded to remote storage' : pImage && pImage.startsWith('data:') ? 'Ready to upload' : 'Using URL'}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No preview</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-action-outline" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-sm-primary"
                  disabled={pImage && pImage.startsWith('data:') && !pImageUploaded}
                >
                  {selectedProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
