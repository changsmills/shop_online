import React, { useState } from 'react';
import { PackageSearch, Settings, TrendingUp, AlertTriangle, Save } from 'lucide-react';
import api from '../axiosConfig'; // 🔥 Badilisha hii
import '../QuickInventory.css';

const QuickInventoryManager = ({ products, setProducts }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState({ show: false, text: '', type: '' });
  const [localChanges, setLocalChanges] = useState({});

  const handleInputChange = (productId, field, value) => {
    setLocalChanges(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: parseFloat(value)
      }
    }));
  };

  const handleSaveClick = async (productId) => {
    const updates = localChanges[productId];
    if (!updates) return;

    setUpdatingId(productId);
    try {
      const token = localStorage.getItem("access_token");
         if (!token) {
        setToast({ show: true, text: 'Please login again! ❌', type: 'error' });

        setTimeout(() => setToast({ show: false, text: '', type: '' }), 3000);
        setUpdatingId(null);
        return;
      }

      // 🔥 MABADILIKO: Tumia api.patch na uondoe API_BASE_URL
      await api.patch(
        `/products/${productId}/`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, ...updates } : p
      ));

      const newChanges = { ...localChanges };
      delete newChanges[productId];
      setLocalChanges(newChanges);

      setToast({ show: true, text: 'Changes saved successfully! ✅', type: 'success' });

    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      setToast({ show: true, text: 'Failed to save. Try again! ❌', type: 'error' });
        } finally {
      setUpdatingId(null);
      setTimeout(() => setToast({ show: false, text: '', type: '' }), 3000);
    }
  };

  if (!products) {
    return (
      <div className="loading-state">
        <div className="spinner-mini" />
        <p className="loading-text">Searching Products...</p>
      </div>
    );
  }

  const lowStockCount = products.filter(p => p.stock_quantity <= 5).length;

  return (
    <div className="quick-inventory-wrapper">
      
      {toast.show && (
        <div className={`toast-container ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.text}
        </div>
      )}

      <div className="analytics-grid">
        <div className="analytics-card orange">
          <PackageSearch size={20} className="analytics-icon" />
          <h4 className="analytics-number">{products.length}</h4>
          <p className="analytics-label">All Products</p>
        </div>
        
        <div className={`analytics-card ${lowStockCount > 0 ? 'red' : 'gray'}`}>
          <AlertTriangle size={20} className="analytics-icon" />
          <h4 className="analytics-number">{lowStockCount}</h4>
            <p className="analytics-label">Low Stock</p>
        </div>
      </div>

      <div className="inventory-panel">
        <div className="panel-header">
           <h3 className="panel-title">
            <Settings size={16} className="panel-title-icon" /> Quick Edits
          </h3>
          <TrendingUp size={16} style={{ color: '#22c55e' }} />
        </div>

        <div className="inventory-grid-container">
          <div className="inventory-grid">
            {products.map((p, index) => {
              const hasChanged = localChanges[p.id] !== undefined;
              const delay = (index % 10) * 0.05;
              
              return (
                <div 
                  key={p.id} 
                  className="inv-card"
                  style={{ animationDelay: `${delay}s` }}
                >
                  {/* ✅ SEHEMU YA PICHA IMESASISHWA KAMA TOPDEALS */}
                  <div className="inv-img-wrap">
                    <img 
                      src={
                        p.cover_image_url 
                          ? p.cover_image_url 
                          : (p.cover_image 
                              ? (p.cover_image.startsWith('http') 
                                  ? p.cover_image 
                                  : `https://shop-online-r9z4.onrender.com${p.cover_image}`) 
                              : "https://placehold.co/400x400?text=No+Image")
                      } 
                      alt={p.name} 
                      className="inv-img"
                      onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "https://placehold.co/400x400?text=No+Image"; 
                      }}
                    />
                  </div>

                  <div>
                    <h4 className="inv-title">{p.name}</h4>
                    <span className={`inv-status ${p.is_approved ? 'live' : 'pending'}`}>
                      {p.is_approved ? "✅ Live" : "⏳ Pending"}
                    </span>
                  </div>

                  <div className="inv-inputs-row">
                    <div className="inv-input-group">
                      <span className="inv-label">Stock</span>
                      <input 
                        type="number"
                        defaultValue={p.stock_quantity}
                        onChange={(e) => handleInputChange(p.id, 'stock_quantity', e.target.value)}
                        className="inv-input"
                      />
                    </div>
                    <div className="inv-input-group">
                      <span className="inv-label">Price</span>
                      <input 
                        type="number"
                        defaultValue={p.price}
                        onChange={(e) => handleInputChange(p.id, 'price', e.target.value)}
                        className="inv-input"
                      />
                    </div>
                  </div>

                  <div className="inv-save-wrap">
                    {hasChanged && (
                      <button 
                        onClick={() => handleSaveClick(p.id)}
                        disabled={updatingId === p.id}
                        className="inv-save-btn"
                      >
                        {updatingId === p.id ? (
                          <div className="spinner-mini" />
                        ) : (
                          <>
                          <Save size={12} /> Save
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel-footer">
          <button className="panel-footer-btn">
            View Full Report →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickInventoryManager;