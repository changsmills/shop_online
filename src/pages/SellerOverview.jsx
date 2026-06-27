// src/pages/SellerOverview.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, ShoppingCart, Package, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function SellerOverview() {
  const { user, store } = useOutletContext(); 
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    stockAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kwanza jaribu kupata store ID ya user
    const fetchStoreAndStats = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Pata store ya user
        const { data: storeData, error: storeError } = await supabase
          .from('stores_engine')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (storeError) throw storeError;
        if (!storeData) {
          setLoading(false);
          return;
        }

        const storeId = storeData.id;

        // Hesabu bidhaa
        const { count: totalProducts, error: prodError } = await supabase
          .from('products_engines')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', storeId);
        
        // Hesabu bidhaa zilizo na stock chini ya 5
        const { count: stockAlerts, error: stockError } = await supabase
          .from('products_engines')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', storeId)
          .lt('stock_quantity', 5);

        // Jumla ya mapato
        const { data: revenueData, error: revError } = await supabase
          .from('products_engines')
          .select('price')
          .eq('store_id', storeId);
        
        const totalRevenue = revenueData?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

        setStats({
          totalRevenue,
          activeOrders: 0,
          totalProducts: totalProducts || 0,
          stockAlerts: stockAlerts || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndStats();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e5e7eb', 
          borderTop: '4px solid #2563eb', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Dashboard Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Total Revenue', value: `TZS ${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp size={18} color="#16a34a" /> },
          { label: 'Active Orders', value: stats.activeOrders, icon: <ShoppingCart size={18} color="#2563eb" /> },
          { label: 'Total Products', value: stats.totalProducts, icon: <Package size={18} color="#ca8a04" /> },
          { label: 'Stock Alerts', value: stats.stockAlerts, icon: <AlertCircle size={18} color="#22c55e" /> },
        ].map((card, i) => (
          <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>{card.label}</span>
              <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '6px' }}>{card.icon}</div>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111' }}>{card.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}