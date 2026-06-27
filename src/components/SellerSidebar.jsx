// components/SellerSidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  Users, 
  Settings, 
  Package, 
  TrendingUp, 
  LogOut,
  PlusCircle,
  Store
} from 'lucide-react';
import { supabase } from '../supabaseClient'; // 🔥 Hakikisha path hii ni sahihi

export default function SellerSidebar() {
  const navigate = useNavigate();
  const params = useParams();
  
  // 🔥 Pata storeId kutoka URL (kama: /dashboard/sellerboard/physical-dashboard/123)
  // Ikiwa URL haijumuisha ID, tumia mbinu nyingine (k.m. kutoka localStorage au Context)
  const storeId = params.id || params.storeId; 

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Pata taarifa za duka moja kwa moja kutoka database
  useEffect(() => {
    const fetchStore = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('stores_engine')
        .select('*')
        .eq('id', storeId)
        .single();
      
      if (!error && data) {
        setStore(data);
      }
      setLoading(false);
    };
    fetchStore();
  }, [storeId]);

  // 🔥 Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/dashboard/login');
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard/sellerboard'
    },
    {
      id: 'products',
      label: 'Products',
      icon: <Package size={20} />,
      path: '/dashboard/sellerboard/products'
    },
    {
      id: 'add-product',
      label: 'Add Product',
      icon: <PlusCircle size={20} />,
      path: '/dashboard/sellerboard/add-product'
    },
    {
      id: 'quick-inventory',
      label: 'Quick Inventory',
      icon: <ShoppingBag size={20} />,
      path: '/dashboard/sellerboard/inventory'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={20} />,
      path: '/dashboard/sellerboard/analytics'
    },
    {
      id: 'top-deals',
      label: 'Top Deals',
      icon: <TrendingUp size={20} />,
      path: '/dashboard/sellerboard/top-deals'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users size={20} />,
      path: '/dashboard/sellerboard/customers'
    },
    {
      id: 'store-management',
      label: 'Store Management',
      icon: <Store size={20} />,
      path: '/dashboard/sellerboard/store-management'
    },
    {
      id: 'store-settings',
      label: 'Store Settings',
      icon: <Settings size={20} />,
      path: '/dashboard/sellerboard/settings'
    }
  ];

  // 🔥 Tambua herufi ya kwanza ya jina la duka (kwa logo)
  const initialLetter = store?.store_name?.charAt(0)?.toUpperCase() || 'S';

  return (
    <div style={{
      width: '260px',
      backgroundColor: 'white',
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      borderRight: '1px solid #e5e7eb'
    }}>
      {/* Store Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#2563eb',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          {initialLetter}
        </div>
        <div>
          <h3 style={{ fontWeight: '600', fontSize: '16px', margin: 0, color: '#1f2937' }}>
            {loading ? 'Inapakia...' : (store?.store_name || 'Duka Lako')}
          </h3>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Super Seller</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '8px',
              color: isActive ? '#2563eb' : '#4b5563',
              backgroundColor: isActive ? '#eff6ff' : 'transparent',
              textDecoration: 'none',
              marginBottom: '4px',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: isActive ? '500' : '400',
              cursor: 'pointer'
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid #f3f4f6'
      }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '8px',
            color: '#ef4444',
            backgroundColor: 'transparent',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
            fontWeight: '400'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}