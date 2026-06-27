// pages/SellerProducts.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SellerProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products') // Badilisha na table yako ya products
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Sample data ikiwa hakuna products
      setProducts([
        { id: 1, name: 'Smartphone X', price: 450000, stock: 12, category: 'Electronics', status: 'Active' },
        { id: 2, name: 'Running Shoes', price: 85000, stock: 25, category: 'Fashion', status: 'Active' },
        { id: 3, name: 'Coffee Mug Set', price: 15000, stock: 0, category: 'Home', status: 'Out of Stock' },
        { id: 4, name: 'Wireless Headphones', price: 120000, stock: 8, category: 'Electronics', status: 'Active' },
        { id: 5, name: 'Backpack', price: 65000, stock: 3, category: 'Fashion', status: 'Low Stock' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories') // Badilisha na table yako ya categories
        .select('*');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Sample categories
      setCategories([
        { id: 1, name: 'All' },
        { id: 2, name: 'Electronics' },
        { id: 3, name: 'Fashion' },
        { id: 4, name: 'Home' },
        { id: 5, name: 'Books' },
      ]);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#16a34a';
      case 'out of stock':
        return '#ef4444';
      case 'low stock':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#dcfce7';
      case 'out of stock':
        return '#fee2e2';
      case 'low stock':
        return '#fef3c7';
      default:
        return '#f3f4f6';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e5e7eb', 
          borderTop: '4px solid #2563eb', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Products
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0' }}>
            {products.length} products in your store
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/sellerboard/add-product')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'white', 
          borderRadius: '8px', 
          padding: '0 12px', 
          border: '1px solid #e5e7eb',
          flex: '1',
          minWidth: '200px'
        }}>
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 12px',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              width: '100%',
              background: 'transparent'
            }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            background: 'white',
            fontSize: '14px',
            color: '#1f2937',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <button style={{
          padding: '10px 16px',
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

      {/* Products Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e5e7eb', 
        overflow: 'hidden' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Product
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Category
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Price
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Stock
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        📦
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: #{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4b5563', fontSize: '14px' }}>
                    {product.category}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#1f2937' }}>
                    TZS {product.price?.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#4b5563', fontSize: '14px' }}>
                    {product.stock}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: getStatusBgColor(product.status),
                      color: getStatusColor(product.status)
                    }}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{
                        padding: '6px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#6b7280',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Eye size={18} />
                      </button>
                      <button style={{
                        padding: '6px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#2563eb',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Edit size={18} />
                      </button>
                      <button style={{
                        padding: '6px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#ef4444',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}