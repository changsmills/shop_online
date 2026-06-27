// pages/SellerCustomers.jsx
import React, { useState } from 'react';
import { Users, Mail, Phone, MapPin, Search, Filter } from 'lucide-react';

export default function SellerCustomers() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample customers data
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+255 712 345 678', location: 'Dar es Salaam', orders: 12, total: 'TZS 450,000' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+255 765 432 109', location: 'Arusha', orders: 8, total: 'TZS 280,000' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '+255 689 012 345', location: 'Mwanza', orders: 5, total: 'TZS 150,000' },
    { id: 4, name: 'Mary Williams', email: 'mary@example.com', phone: '+255 756 789 012', location: 'Dodoma', orders: 15, total: 'TZS 620,000' },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
          Customers
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '0 12px', border: '1px solid #e5e7eb' }}>
            <Search size={18} color="#6b7280" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                width: '200px',
                background: 'transparent'
              }}
            />
          </div>
          <button style={{
            padding: '8px 16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#4b5563'
          }}>
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Total Customers</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0 0 0', color: '#1f2937' }}>248</h3>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>New This Month</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0 0 0', color: '#2563eb' }}>32</h3>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Active Customers</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0 0 0', color: '#16a34a' }}>186</h3>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Avg. Orders/ Customer</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0 0 0', color: '#f59e0b' }}>4.8</h3>
        </div>
      </div>

      {/* Customers Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Customer</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Phone</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Location</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Orders</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {customer.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{customer.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#4b5563', fontSize: '14px' }}>{customer.email}</td>
                <td style={{ padding: '12px 16px', color: '#4b5563', fontSize: '14px' }}>{customer.phone}</td>
                <td style={{ padding: '12px 16px', color: '#4b5563', fontSize: '14px' }}>{customer.location}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#4b5563', fontSize: '14px' }}>{customer.orders}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>{customer.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}