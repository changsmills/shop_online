import React, { useState } from 'react';
import { PackageSearch, Settings, TrendingUp, AlertTriangle, Save } from 'lucide-react';
import api from '../axiosConfig';

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
      <div className="p-10 px-5 text-center bg-gray-50 dark:bg-slate-800 rounded-[20px] border-2 border-dashed border-gray-200 dark:border-slate-600 flex flex-col items-center gap-3">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-[11px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
          Searching Products...
        </p>
      </div>
    );
  }

  const lowStockCount = products.filter(p => p.stock_quantity <= 5).length;

  return (
    <div className="relative w-full dark:bg-slate-900">

      {/* ===== TOAST ===== */}
      {toast.show && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-2.5 animate-[bounceDown_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)_forwards] ${
            toast.type === 'success'
              ? 'bg-green-500 dark:bg-[#065f46] dark:text-[#4ade80]'
              : 'bg-red-500 dark:bg-[#7f1d1d] dark:text-[#f87171]'
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* ===== ANALYTICS CARDS ===== */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-6">
        <div className="p-3.5 sm:p-5 rounded-[20px] text-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:scale-[1.02] bg-orange-500 dark:bg-[#9a3412] dark:text-[#f97316]">
          <PackageSearch size={20} className="mb-2 opacity-80" />
          <h4 className="text-[22px] sm:text-[28px] font-black m-0 mb-1 text-white dark:text-slate-200">
            {products.length}
          </h4>
          <p className="text-[11px] font-semibold opacity-90 uppercase tracking-wide dark:text-[#94a3b8]">
            All Products
          </p>
        </div>

        <div
          className={`p-3.5 sm:p-5 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:scale-[1.02] ${
            lowStockCount > 0
              ? 'bg-red-500 text-white dark:bg-[#7f1d1d] dark:text-[#f87171]'
              : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-[#94a3b8] dark:border dark:border-slate-700'
          }`}
        >
          <AlertTriangle size={20} className="mb-2 opacity-80" />
          <h4 className="text-[22px] sm:text-[28px] font-black m-0 mb-1 text-white dark:text-slate-200">
            {lowStockCount}
          </h4>
          <p className="text-[11px] font-semibold opacity-90 uppercase tracking-wide dark:text-[#94a3b8]">
            Low Stock
          </p>
        </div>
      </div>

      {/* ===== INVENTORY PANEL ===== */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">

        {/* Panel Header */}
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
          <h3 className="text-[15px] font-black text-gray-800 dark:text-slate-200 flex items-center gap-2">
            <Settings size={16} className="text-orange-500 dark:text-[#f97316]" />
            Quick Edits
          </h3>
          <TrendingUp size={16} className="text-green-500" />
        </div>

        {/* Grid Container */}
        <div className="max-h-[500px] overflow-y-auto p-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:dark:bg-slate-800 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:dark:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5 sm:gap-4">

            {products.map((p, index) => {
              const hasChanged = localChanges[p.id] !== undefined;
              const delay = (index % 10) * 0.05;

              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-[14px] border border-gray-100 dark:border-slate-700 p-3 flex flex-col gap-2 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] opacity-0 animate-[fadeUp_0.5s_ease_forwards] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:border-gray-200 dark:hover:border-[#f97316]"
                  style={{ animationDelay: `${delay}s` }}
                >
                  {/* Image */}
                  <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-[10px] overflow-hidden relative">
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
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Title & Status */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-slate-200 leading-[1.3] line-clamp-2 m-0">
                      {p.name}
                    </h4>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-[20px] inline-block w-fit mt-1 ${
                        p.is_approved
                          ? 'bg-green-100 text-green-600 dark:bg-[#1a3a2a] dark:text-[#4ade80]'
                          : 'bg-amber-100 text-amber-600 dark:bg-slate-700 dark:text-[#fbbf24]'
                      }`}
                    >
                      {p.is_approved ? "✅ Live" : "⏳ Pending"}
                    </span>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold uppercase text-gray-400 dark:text-[#94a3b8] tracking-wide">
                        Stock
                      </span>
                      <input
                        type="number"
                        defaultValue={p.stock_quantity}
                        onChange={(e) => handleInputChange(p.id, 'stock_quantity', e.target.value)}
                        className="px-1 py-1.5 border border-gray-200 dark:border-slate-600 rounded-md text-xs font-semibold text-center w-full bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 transition-colors focus:outline-none focus:border-orange-500 dark:focus:border-[#f97316]"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold uppercase text-gray-400 dark:text-[#94a3b8] tracking-wide">
                        Price
                      </span>
                      <input
                        type="number"
                        defaultValue={p.price}
                        onChange={(e) => handleInputChange(p.id, 'price', e.target.value)}
                        className="px-1 py-1.5 border border-gray-200 dark:border-slate-600 rounded-md text-xs font-semibold text-center w-full bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 transition-colors focus:outline-none focus:border-orange-500 dark:focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-1">
                    {hasChanged && (
                      <button
                        onClick={() => handleSaveClick(p.id)}
                        disabled={updatingId === p.id}
                        className="w-full py-1.5 bg-orange-500 dark:bg-[#f97316] hover:bg-orange-600 dark:hover:bg-[#ea580c] text-white border-none rounded-lg text-[10px] font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1 hover:scale-[1.02] disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:text-gray-500 dark:disabled:text-[#94a3b8] disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {updatingId === p.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-t-[#f97316] rounded-full animate-spin mx-auto" />
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

        {/* Panel Footer */}
        <div className="px-5 py-3 text-center bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
          <button className="bg-transparent border-none text-orange-600 dark:text-[#f97316] text-[10px] font-black uppercase tracking-wider cursor-pointer hover:underline">
            View Full Report →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickInventoryManager;