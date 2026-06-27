// components/SellerLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import SellerHeader from './SellerHeader';

export default function SellerLayout({ user, store, handleLogout, dataProps }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
      
      <SellerSidebar store={store} handleLogout={handleLogout} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <SellerHeader user={user} store={store} />

        <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
           {/* 🔥 PITISHA DATA HAPA! Outlet inapata data zote kutoka PhysicalDashboard */}
           <Outlet context={{ user, store, ...dataProps }} />
        </div>
      </div>
    </div>
  );
}