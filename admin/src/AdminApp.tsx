import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Package, 
  BarChart3, Settings, LogOut, ArrowUpRight, 
  Search, Bell, Plus
} from 'lucide-react';
import { motion } from 'motion/react';

const AdminApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Total Revenue', value: '₹4,82,900', trend: '+12.5%', icon: BarChart3 },
    { label: 'Orders', value: '1,240', trend: '+18.2%', icon: ShoppingBag },
    { label: 'Active Users', value: '8,432', trend: '+4.3%', icon: Users },
    { label: 'Conversion', value: '3.2%', trend: '+0.8%', icon: BarChart3 },
  ];

  const recentOrders = [
    { id: 'CR-5021', customer: 'Rahul Sharma', status: 'In Transit', amount: '₹3,499' },
    { id: 'CR-5022', customer: 'Priya Patel', status: 'Delivered', amount: '₹1,299' },
    { id: 'CR-5023', customer: 'Arnav Singh', status: 'Processing', amount: '₹4,999' },
    { id: 'CR-5024', customer: 'Sneha Reddy', status: 'Cancelled', amount: '₹2,499' },
  ];

  return (
    <div className="flex h-screen bg-white text-black font-['Inter']">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-100 flex flex-col p-6">
        <div className="mb-12">
          <h1 className="text-2xl font-black tracking-[0.2em] font-['Outfit']">CORE</h1>
          <p className="text-[10px] font-bold text-zinc-400 tracking-[0.3em] uppercase mt-2">Admin Terminal</p>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all ${
                activeTab === item.id 
                ? 'bg-black text-white' 
                : 'text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              <item.icon size={18} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-black transition-all mt-auto border-t border-zinc-50 pt-6">
          <LogOut size={18} />
          <span className="text-[11px] font-bold uppercase tracking-widest">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-zinc-50/50">
        <header className="h-20 bg-white border-b border-zinc-100 px-10 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center bg-zinc-100 px-4 py-2 rounded-lg w-96 border border-zinc-200">
            <Search size={16} className="text-zinc-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search data telemetry..." 
              className="bg-transparent outline-none text-[12px] w-full font-medium"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-zinc-400 hover:text-black transition-colors">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full" />
            </button>
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black">
              A
            </div>
          </div>
        </header>

        <div className="p-10 space-y-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic font-['Outfit']">Operational Overview</h2>
              <p className="text-zinc-400 font-bold text-[10px] tracking-widest mt-2 uppercase">Real-time sync: Active</p>
            </div>
            <button className="bg-black text-white px-8 py-3 font-bold text-[10px] tracking-widest uppercase flex items-center gap-3 hover:bg-zinc-800 transition-all">
              <Plus size={16} /> New Product
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 border border-zinc-100 rounded-sm shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-zinc-50 rounded-lg">
                    <stat.icon size={20} className="text-zinc-400" />
                  </div>
                  <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-zinc-100 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="font-black uppercase tracking-[0.2em] text-xs">Recent Signals</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black flex items-center gap-2 transition-all">
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="group hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 font-black text-xs">{order.id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-zinc-500">{order.customer}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-zinc-100 text-zinc-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-xs">{order.amount}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-zinc-300 hover:text-black transition-colors">
                          <Plus size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminApp;
