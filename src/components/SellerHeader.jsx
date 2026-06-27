import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const SellerHeader = ({ user, store }) => {
  return (
    <div style={{ height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
      
      {/* UPANDE WA KUSHOTO WA HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111' }}>Hello, {store?.store_name || 'Seller'}!</h2>
        <span style={{ fontSize: '12px', color: '#666' }}>⚡ Your store is active</span>
      </div>

      {/* UPANDE WA KULIA WA HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* KITUFE CHA TAARIFA */}
        <button style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: '#ff4e00', borderRadius: '50%' }}></span>
        </button>
        
        {/* PROFILE YA USER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#ff6a00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {store?.store_name?.charAt(0) || 'U'}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>{user?.email}</div>
          <ChevronDown size={16} color="#666" />
        </div>
      </div>
    </div>
  );
};

export default SellerHeader;