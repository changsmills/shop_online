// pages/SellerOverview.jsx
import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import BusinessAnalytics from '../components/BusinessAnalytics';
import { TrendingUp, ShoppingCart, Package, AlertCircle, Rocket } from 'lucide-react';

export default function SellerOverview() {
  const { store, myProducts } = useOutletContext();

  // Takwimu (Data za mfano)
  const totalRevenue = "TZS 4.2M";
  const activeOrders = 45;
  const totalProducts = myProducts?.length || 0;
  const stockAlerts = myProducts?.filter(p => p.stock_quantity < 10).length || 0;

  return (
    <div className="pd-section">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Total Revenue', value: totalRevenue, change: '+12%', icon: <TrendingUp size={18} color="#16a34a" /> },
          { label: 'Active Orders', value: activeOrders, change: '+8 Today', icon: <ShoppingCart size={18} color="#2563eb" /> },
          { label: 'Total Products', value: totalProducts, change: '+20 This week', icon: <Package size={18} color="#ca8a04" /> },
          { label: 'Stock Alerts', value: `${stockAlerts} Items`, change: stockAlerts > 0 ? 'Low stock!' : 'All good', icon: <AlertCircle size={18} color={stockAlerts > 0 ? "#dc2626" : "#22c55e"} /> },
        ].map((card, i) => (
          <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>{card.label}</span>
              <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '6px' }}>{card.icon}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111' }}>{card.value}</h3>
              <span style={{ fontSize: '12px', color: card.change.includes('Low') ? '#dc2626' : '#16a34a', fontWeight: '500', background: card.change.includes('Low') ? '#fef2f2' : '#f0fdf4', padding: '2px 8px', borderRadius: '10px' }}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Business Analytics */}
      <BusinessAnalytics products={myProducts} sellerId={store?.id} />   

      {/* Banner ya Advertise */}
      <div className="mt-4" onClick={() => window.location.href='/advertise'} style={{ background: 'linear-gradient(135deg, #ff4e00 0%, #ec2f4b 100%)', borderRadius: '20px', padding: '20px', color: 'white', cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Rocket size={20} /><b>ONGEZA MAUZO LEO!</b></div>
          <p style={{ fontSize: '12px', opacity: 0.9 }}>Weka bidhaa zako mbele ya maelfu ya wateja sasa.</p>
        </div>
        <button style={{ backgroundColor: 'white', color: '#ff4e00', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', border: 'none' }}>TANGAA SASA 🚀</button>
      </div>
    </div>
  );
}