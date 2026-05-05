import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, Menu, TrendingUp, 
  DollarSign, ShoppingBag, Users, Calendar, Download, RefreshCw, Package
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell
} from "recharts";
import UserTools from '../components/UserTools';
import toast from 'react-hot-toast';
import '../AccountSettings.css'; 

export default function Analytics({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [revenueData, setRevenueData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [storeId, setStoreId] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  
  const location = useLocation();

  // Fetch user's store ID
  useEffect(() => {
    const fetchStore = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('stores_engine')
        .select('id')
        .eq('owner_id', session.user.id)
        .maybeSingle();
      
      if (!error && data) {
        setStoreId(data.id);
      }
    };
    
    fetchStore();
  }, [session]);

  // Fetch analytics data
  useEffect(() => {
    if (!storeId) return;
    
    const fetchAnalytics = async () => {
      setLoading(true);
      
      try {
        // Calculate date range
        const now = new Date();
        let startDate = new Date();
        
        if (timeRange === 'week') {
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        } else if (timeRange === 'year') {
          startDate.setFullYear(now.getFullYear() - 1);
        }
        
        const startDateStr = startDate.toISOString();
        
        // 1. Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('store_id', storeId)
          .gte('created_at', startDateStr)
          .order('created_at', { ascending: true });
        
        if (ordersError) throw ordersError;
        
        // 2. Process revenue by date
        const revenueByDate = {};
        const uniqueCustomers = new Set();
        
        orders.forEach(order => {
          const date = new Date(order.created_at).toLocaleDateString('en-CA');
          const amount = parseFloat(order.grand_total) || 0;
          uniqueCustomers.add(order.customer_id);
          
          if (!revenueByDate[date]) {
            revenueByDate[date] = { date, revenue: 0, orders: 0 };
          }
          revenueByDate[date].revenue += amount;
          revenueByDate[date].orders += 1;
        });
        
        // Fill missing dates
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
        
        // 3. Calculate statistics
        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.grand_total) || 0), 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // 4. Fetch total products
        const { count: totalProducts, error: productsError } = await supabase
          .from('products_engine')
          .select('*', { count: 'exact', head: true })
          .eq('store_id', storeId);
        
        if (productsError) throw productsError;
        
        setStats({
          totalRevenue,
          totalOrders,
          averageOrderValue,
          totalProducts: totalProducts || 0,
          totalCustomers: uniqueCustomers.size
        });
        
        // 5. Orders by status
        const statusCount = {};
        orders.forEach(order => {
          const status = order.status || 'pending';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        
        const statusColors = {
          pending: '#ff6a00',
          received: '#2196f3',
          delivered: '#00a65a',
          cancelled: '#ef4444',
          processing: '#8b5cf6'
        };
        
        const statusData = Object.entries(statusCount).map(([name, value]) => ({
          name: name === 'pending' ? 'Inasubiri' : 
                name === 'received' ? 'Imepokelewa' : 
                name === 'delivered' ? 'Imewasilishwa' : 
                name === 'cancelled' ? 'Imefutwa' : name,
          value,
          color: statusColors[name] || '#999'
        }));
        
        setOrdersByStatus(statusData);
        
        // 6. Recent orders (last 5)
        const { data: recent, error: recentError } = await supabase
          .from('orders')
          .select('*, profiles!orders_customer_id_fkey(full_name)')
          .eq('store_id', storeId)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (!recentError && recent) {
          setRecentOrders(recent);
        }
        
      } catch (error) {
        console.error('Error fetching analytics:', error);
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
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* HEADER */}
      <header className="dashboard-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 24px' }}>
          <Menu size={22} style={{ cursor: 'pointer', color: '#666' }} onClick={() => setIsExpanded(!isExpanded)} />
          <Link to="/dashboard" className="logo-text" style={{ fontSize: '20px', fontWeight: '800', color: '#ff6a00', textDecoration: 'none' }}>Changsmills</Link>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '6px 12px', borderRadius: '8px' }}>
            <Search size={16} color="#999" />
            <input type="text" placeholder="Search analytics..." style={{ border: 'none', background: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' }} />
          </div>
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 24px' }}>
          <Bell size={20} className="icon-btn" style={{ cursor: 'pointer', color: '#666' }} />
          <UserTools session={session} />
        </div>
      </header>

      <div className="dashboard-main" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SIDEBAR */}
        <aside 
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          style={{
            width: isExpanded ? '240px' : '72px',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRight: '1px solid #eee',
            paddingTop: '10px',
            flexShrink: 0,
            zIndex: 10
          }}
        >
          {sidebarItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '48px',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#ff6a00' : '#666',
                margin: '4px 10px',
                borderRadius: '8px',
                transition: 'background 0.2s',
                backgroundColor: location.pathname === item.path ? '#fff5ed' : 'transparent',
              }}
            >
              <div style={{ minWidth: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {item.icon}
              </div>
              <span style={{ 
                fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap',
                opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s ease',
                pointerEvents: isExpanded ? 'auto' : 'none'
              }}>
                {item.label}
              </span>
            </Link>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: '24px', backgroundColor: '#f7f8fa', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#333' }}>Analytics Dashboard</h2>
                <p style={{ color: '#666', margin: '4px 0 0' }}>Track your store performance in real-time</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last 12 Months</option>
                </select>
                <button 
                  onClick={() => window.location.reload()}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Total Revenue</p>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '8px 0 0', color: '#ff6a00' }}>{formatCurrency(stats.totalRevenue)}</h3>
                  </div>
                  <div style={{ backgroundColor: '#fff5ed', padding: '10px', borderRadius: '12px' }}>
                    <DollarSign size={22} color="#ff6a00" />
                  </div>
                </div>
              </div>
              
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Total Orders</p>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '8px 0 0' }}>{stats.totalOrders}</h3>
                  </div>
                  <div style={{ backgroundColor: '#e6fff0', padding: '10px', borderRadius: '12px' }}>
                    <ShoppingBag size={22} color="#00a65a" />
                  </div>
                </div>
              </div>
              
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Avg Order Value</p>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '8px 0 0' }}>{formatCurrency(stats.averageOrderValue)}</h3>
                  </div>
                  <div style={{ backgroundColor: '#e8f4fd', padding: '10px', borderRadius: '12px' }}>
                    <TrendingUp size={22} color="#2196f3" />
                  </div>
                </div>
              </div>
              
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Customers</p>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '8px 0 0' }}>{stats.totalCustomers}</h3>
                  </div>
                  <div style={{ backgroundColor: '#f3e8ff', padding: '10px', borderRadius: '12px' }}>
                    <Users size={22} color="#8b5cf6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Revenue Overview</h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid #f3f4f6', borderTop: '3px solid #ff6a00', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                  <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading analytics data...</p>
                </div>
              ) : revenueData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <ShoppingBag size={48} color="#ccc" />
                  <p style={{ marginTop: '16px', color: '#9ca3af' }}>No orders data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#ff6a00" strokeWidth={3} dot={{ r: 4, fill: '#ff6a00', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              
              {/* Orders by Status */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📊 Orders by Status</h3>
                {ordersByStatus.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No orders yet</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={ordersByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {ordersByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: '20px' }}>
                      {ordersByStatus.map((status, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: status.color }}></span>
                            {status.name}
                          </span>
                          <span style={{ fontWeight: '600' }}>{status.value} orders</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Recent Orders */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>🕒 Recent Orders</h3>
                {recentOrders.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No recent orders</p>
                ) : (
                  <div>
                    {recentOrders.map((order) => {
                      const statusStyle = getStatusBadgeStyle(order.status);
                      return (
                        <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                          <div>
                            <p style={{ fontWeight: '600', margin: 0, fontSize: '14px' }}>{order.order_number}</p>
                            <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0' }}>
                              {new Date(order.created_at).toLocaleDateString('sw-TZ')}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: '700', color: '#ff6a00', margin: 0 }}>{formatCurrency(order.grand_total)}</p>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }}>
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
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📦 Products Overview</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <p style={{ color: '#666', margin: 0 }}>Total Products in Store</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#ff6a00' }}>{stats.totalProducts}</p>
                </div>
                <div>
                  <p style={{ color: '#666', margin: 0 }}>Total Items Sold</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>{stats.totalOrders}</p>
                </div>
                <div>
                  <p style={{ color: '#666', margin: 0 }}>Conversion Rate</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>
                    {stats.totalCustomers > 0 ? ((stats.totalOrders / stats.totalCustomers) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}