import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, MessageSquare, ClipboardList,
  Settings, BarChart3, Bell, Search, Menu, TrendingUp,
  DollarSign, ShoppingBag, Users, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import UserTools from '../components/UserTools';
import toast from 'react-hot-toast';

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function Analytics({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [revenueData, setRevenueData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, averageOrderValue: 0,
    totalProducts: 0, totalCustomers: 0
  });
  const [storeId, setStoreId] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchStore = async () => {
      if (!session?.user?.id) return;
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/stores/`, {
          params: { owner_id: session.user.id },
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.length > 0) {
          setStoreId(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        toast.error('Imeshindwa kupata store ID.');
      }
    };
    fetchStore();
  }, [session]);

  useEffect(() => {
    if (!storeId) return;
    const fetchAnalytics = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) { toast.error("Tafadhali ingia tena."); setLoading(false); return; }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const now = new Date();
        let startDate = new Date();
        if (timeRange === 'week') startDate.setDate(now.getDate() - 7);
        else if (timeRange === 'month') startDate.setMonth(now.getMonth() - 1);
        else if (timeRange === 'year') startDate.setFullYear(now.getFullYear() - 1);
        const startDateStr = startDate.toISOString();

        const ordersRes = await axios.get(`${API_BASE_URL}/orders/`, {
          params: { store_id: storeId, created_at__gte: startDateStr, ordering: 'created_at' },
          headers
        });
        const orders = ordersRes.data || [];

        const revenueByDate = {};
        const uniqueCustomers = new Set();
        orders.forEach(order => {
          const date = new Date(order.created_at).toLocaleDateString('en-CA');
          const amount = parseFloat(order.grand_total) || 0;
          uniqueCustomers.add(order.customer_id);
          if (!revenueByDate[date]) revenueByDate[date] = { date, revenue: 0, orders: 0 };
          revenueByDate[date].revenue += amount;
          revenueByDate[date].orders += 1;
        });

        const filledData = [];
        const currentDate = new Date(startDate);
        const endDate = new Date();
        while (currentDate <= endDate) {
          const dateStr = currentDate.toLocaleDateString('en-CA');
          filledData.push({
            date: dateStr,
            revenue: revenueByDate[dateStr]?.revenue || 0,
            orders: revenueByDate[dateStr]?.orders || 0,
            displayDate: currentDate.toLocaleDateString('sw-TZ', { day: '2-digit', month: 'short' })
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setRevenueData(filledData);

        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.grand_total) || 0), 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const productsRes = await axios.get(`${API_BASE_URL}/products/`, {
          params: { store_id: storeId }, headers
        });
        const productsCount = Array.isArray(productsRes.data)
          ? productsRes.data.length
          : (productsRes.data?.count || productsRes.data?.results?.length || 0);

        setStats({
          totalRevenue, totalOrders, averageOrderValue,
          totalProducts: productsCount,
          totalCustomers: uniqueCustomers.size
        });

        const statusCount = {};
        orders.forEach(order => {
          const status = order.status || 'pending';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        const statusColors = {
          pending: '#ff6a00', received: '#2196f3', delivered: '#00a65a',
          cancelled: '#ef4444', processing: '#8b5cf6'
        };
        const statusData = Object.entries(statusCount).map(([name, value]) => ({
          name: name === 'pending' ? 'Inasubiri' :
                name === 'received' ? 'Imepokelewa' :
                name === 'delivered' ? 'Imewasilishwa' :
                name === 'cancelled' ? 'Imefutwa' : name,
          value, color: statusColors[name] || '#999'
        }));
        setOrdersByStatus(statusData);

        const recentRes = await axios.get(`${API_BASE_URL}/orders/`, {
          params: { store_id: storeId, ordering: '-created_at', limit: 5 }, headers
        });
        setRecentOrders(recentRes.data || []);

      } catch (error) {
        console.error('Error fetching analytics:', error.response?.data || error.message);
        toast.error('Hitilafu ilitokea kupata data za analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [storeId, timeRange]);

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(value || 0);
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      pending: { backgroundColor: '#fff7ed', color: '#ff6a00', label: 'Inasubiri' },
      received: { backgroundColor: '#e8f4fd', color: '#2196f3', label: 'Imepokelewa' },
      delivered: { backgroundColor: '#e6fff0', color: '#00a65a', label: 'Imewasilishwa' },
      cancelled: { backgroundColor: '#fee2e2', color: '#ef4444', label: 'Imefutwa' }
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-white dark:bg-black">

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-[100] bg-white dark:bg-[#0a0a0a]
       border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 px-3 md:px-6 py-2.5">
          <Menu
            size={22}
            className="cursor-pointer text-gray-500 dark:text-slate-400 hover:text-[#ff6a00] 
            transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Link
            to="/dashboard"
            className="text-lg md:text-xl font-extrabold text-[#ff6a00] no-underline"
          >
            Skyfall
          </Link>
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-[#111] px-3 py-1.5 rounded-lg">
            <Search size={16} className="text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search analytics..."
              className="border-none bg-transparent outline-none ml-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 px-6 py-2.5">
          <Bell size={20} className="cursor-pointer text-gray-500 dark:text-slate-400 hover:text-[#ff6a00] transition-colors" />
          <UserTools session={session} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ===== SIDEBAR ===== */}
        <aside
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className={`hidden md:flex flex-col bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#1f1f1f] pt-2.5 flex-shrink-0 z-10 overflow-x-hidden transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isExpanded ? 'w-60' : 'w-[72px]'
          }`}
        >
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center h-12 mx-2.5 my-1 rounded-lg no-underline transition-colors ${
                  isActive
                    ? 'text-[#ff6a00] bg-orange-50 dark:bg-[#1a1a1a]'
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="min-w-[52px] flex items-center justify-center">
                  {item.icon}
                </div>
                <span
                  className={`text-sm font-semibold whitespace-nowrap transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-3 md:p-6 bg-gray-50 dark:bg-black overflow-y-auto [scrollbar-width:thin]">
          <div className="max-w-[1200px] mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold m-0 text-gray-800 dark:text-white">
                  Analytics Dashboard
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 mb-0">
                  Track your store performance in real-time
                </p>
              </div>
              <div className="flex gap-2.5">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 md:px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-[#111] text-gray-800 dark:text-white cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last 12 Months</option>
                </select>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-[#111] text-gray-800 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
              <StatCard
                label="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={<DollarSign size={22} className="text-[#ff6a00]" />}
                iconBg="bg-orange-50 dark:bg-[#1a1a1a]"
                valueColor="text-[#ff6a00]"
              />
              <StatCard
                label="Total Orders"
                value={stats.totalOrders}
                icon={<ShoppingBag size={22} className="text-[#00a65a]" />}
                iconBg="bg-green-50 dark:bg-[#0f1f17]"
              />
              <StatCard
                label="Avg Order Value"
                value={formatCurrency(stats.averageOrderValue)}
                icon={<TrendingUp size={22} className="text-[#2196f3]" />}
                iconBg="bg-blue-50 dark:bg-[#0a1a28]"
                smallValue
              />
              <StatCard
                label="Customers"
                value={stats.totalCustomers}
                icon={<Users size={22} className="text-[#8b5cf6]" />}
                iconBg="bg-purple-50 dark:bg-[#1a0f28]"
              />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-[#111] p-4 md:p-6 rounded-xl border border-gray-200 dark:border-[#1f1f1f] mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-5 text-gray-800 dark:text-white">
                Revenue Overview
              </h3>
              {loading ? (
                <div className="text-center py-15">
                  <div className="w-10 h-10 border-[3px] border-gray-100 dark:border-slate-700 border-t-[#ff6a00] rounded-full mx-auto animate-spin" />
                  <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
                    Loading analytics data...
                  </p>
                </div>
              ) : revenueData.length === 0 ? (
                <div className="text-center py-15">
                  <ShoppingBag size={48} className="text-gray-300 dark:text-slate-600 mx-auto" />
                  <p className="mt-4 text-sm text-gray-400 dark:text-slate-500">
                    No orders data available
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ff6a00"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#ff6a00', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Orders by Status */}
              <div className="bg-white dark:bg-[#111] p-4 md:p-6 rounded-xl border border-gray-200 dark:border-[#1f1f1f]">
                <h3 className="text-base md:text-lg font-semibold mb-5 text-gray-800 dark:text-white">
                  📊 Orders by Status
                </h3>
                {ordersByStatus.length === 0 ? (
                  <p className="text-center text-gray-400 dark:text-slate-500 py-10 text-sm">
                    No orders yet
                  </p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={ordersByStatus}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={80}
                          paddingAngle={5} dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {ordersByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-5">
                      {ordersByStatus.map((status, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100 dark:border-[#1f1f1f]">
                          <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: status.color }}
                            />
                            {status.name}
                          </span>
                          <span className="font-semibold text-sm text-gray-800 dark:text-white">
                            {status.value} orders
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-white dark:bg-[#111] p-4 md:p-6 rounded-xl border border-gray-200 dark:border-[#1f1f1f]">
                <h3 className="text-base md:text-lg font-semibold mb-5 text-gray-800 dark:text-white">
                  🕒 Recent Orders
                </h3>
                {recentOrders.length === 0 ? (
                  <p className="text-center text-gray-400 dark:text-slate-500 py-10 text-sm">
                    No recent orders
                  </p>
                ) : (
                  <div>
                    {recentOrders.map((order) => {
                      const statusStyle = getStatusBadgeStyle(order.status);
                      return (
                        <div key={order.id} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-[#1f1f1f]">
                          <div>
                            <p className="font-semibold m-0 text-sm text-gray-800 dark:text-white">
                              {order.order_number}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 mb-0">
                              {new Date(order.created_at).toLocaleDateString('sw-TZ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#ff6a00] m-0 text-sm">
                              {formatCurrency(order.grand_total)}
                            </p>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full inline-block mt-1"
                              style={{ backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }}
                            >
                              {statusStyle.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Products Overview */}
            <div className="bg-white dark:bg-[#111] p-4 md:p-6 rounded-xl border border-gray-200 dark:border-[#1f1f1f] mt-6">
              <h3 className="text-base md:text-lg font-semibold mb-5 text-gray-800 dark:text-white">
                📦 Products Overview
              </h3>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 m-0">Total Products in Store</p>
                  <p className="text-2xl md:text-[32px] font-bold m-0 text-[#ff6a00]">
                    {stats.totalProducts}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 m-0">Total Items Sold</p>
                  <p className="text-2xl md:text-[32px] font-bold m-0 text-gray-800 dark:text-white">
                    {stats.totalOrders}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 m-0">Conversion Rate</p>
                  <p className="text-2xl md:text-[32px] font-bold m-0 text-gray-800 dark:text-white">
                    {stats.totalCustomers > 0 ? ((stats.totalOrders / stats.totalCustomers) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ===== HELPER COMPONENT: Stat Card =====
function StatCard({ label, value, icon, iconBg, valueColor = "text-gray-800 dark:text-white", smallValue = false }) {
  return (
    <div className="bg-white dark:bg-[#111] p-4 md:p-5 rounded-xl border border-gray-200 dark:border-[#1f1f1f]">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 m-0">
            {label}
          </p>
          <h3 className={`${smallValue ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} font-bold mt-2 mb-0 ${valueColor} truncate`}>
            {value}
          </h3>
        </div>
        <div className={`${iconBg} p-2 md:p-2.5 rounded-xl flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}