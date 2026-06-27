// pages/SellerAnalytics.jsx
import React from 'react';
import BusinessAnalytics from '../components/BusinessAnalytics';

export default function SellerAnalytics() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1f2937' }}>
        Analytics Dashboard
      </h2>
      <BusinessAnalytics />
    </div>
  );
}