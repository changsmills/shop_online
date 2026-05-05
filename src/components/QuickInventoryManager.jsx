import React, { useState } from 'react';
import { PackageSearch, Settings, TrendingUp, AlertTriangle, Save } from 'lucide-react'; // Tumeongeza Save icon
import { supabase } from '../supabaseClient';
import '../QuickInventory.css';

const QuickInventoryManager = ({ products, setProducts }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState({ show: false, text: '', type: '' });
  // Hii itashika mabadiliko ya muda kabla ya kusave
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
    const { error } = await supabase
      .from('products_engines')
      .update(updates)
      .eq('id', productId);

    if (error) throw error;

    // 1. Update State ya duka zima
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    ));

    // 2. Futa mabadiliko ya muda
    const newChanges = { ...localChanges };
    delete newChanges[productId];
    setLocalChanges(newChanges);

    // 3. ONYESHA UJUMBE WA MAFANIKIO
    setToast({ show: true, text: 'Mabadiliko yamehifadhiwa! ✅', type: 'success' });

  } catch (err) {
    console.error("Update Error:", err.message);
    // ONYESHA UJUMBE WA KOSA
    setToast({ show: true, text: 'Imeshindikana kusave. Jaribu tena! ❌', type: 'error' });
  } finally {
    setUpdatingId(null);
    // Ficha ujumbe baada ya sekunde 3
    setTimeout(() => setToast({ show: false, text: '', type: '' }), 3000);
  }
};

if (!products) {
    return (
      <div className="p-10 text-center bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200">
        <div className="spinner-mini mx-auto mb-2" />
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Inatafuta Bidhaa...</p>
      </div>
    );
  }

  const lowStockCount = products.filter(p => p.stock_quantity <= 5).length;

return (
    <div className="relative"> {/* 1. Muhimu kwa ajili ya Toast kukaa juu */}
      
      {/* --- 2. TOAST NOTIFICATION (Ujumbe wa Mafanikio/Kosa) --- */}
      {toast.show && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-2xl shadow-2xl text-white font-black text-[10px] uppercase tracking-widest transition-all duration-500 transform animate-bounce flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.text}
        </div>
      )}

      {/* --- 3. KODI YAKO YA UI ILIYOBAKI --- */}
      <div className="space-y-6">
        {/* --- ANALYTICS CARDS --- */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-500 p-4 rounded-[25px] text-white shadow-lg shadow-orange-100">
            <PackageSearch size={20} className="mb-2 opacity-80" />
            <h4 className="text-xl font-bold">{products.length}</h4>
            <p className="text-[10px] font-medium opacity-90 uppercase">Bidhaa Zote</p>
          </div>
          
          <div className={`p-4 rounded-[25px] shadow-lg transition-all ${lowStockCount > 0 ? 'bg-red-500 text-white shadow-red-100' : 'bg-gray-100 text-gray-400'}`}>
            <AlertTriangle size={20} className="mb-2 opacity-80" />
            <h4 className="text-xl font-bold">{lowStockCount}</h4>
            <p className="text-[10px] font-medium opacity-90 uppercase">Zinaisha Stoku</p>
          </div>
        </div>

        {/* --- LIST YA BIDHAA --- */}
        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-sm font-black text-gray-700 flex items-center gap-2">
              <Settings size={16} className="text-orange-500" /> Marekebisho ya Haraka
            </h3>
            <TrendingUp size={16} className="text-green-500" />
          </div>

          <div className="divide-y divide-gray-50 max-h-[450px] overflow-y-auto">
            {products.map((p) => {
              const hasChanged = localChanges[p.id] !== undefined;
              
              return (
                <div key={p.id} className={`inventory-row ${updatingId === p.id ? 'row-updating' : ''}`}>
  <div className="row-content">
    
    {/* Upande wa Picha na Jina */}
    <div className="product-info">
      <img src={p.cover_image} className="product-thumb" alt="" />
      <div className="text-container">
        <p className="product-name">{p.name}</p>
        <p className="product-status">{p.is_approved ? "✅ Live" : "⏳ Pending"}</p>
      </div>
    </div>

    {/* Upande wa Maingizo (Inputs) */}
    <div className="action-group">
      <div className="input-field">
        <span className="field-label">Stock</span>
        <input 
          type="number"
          defaultValue={p.stock_quantity}
          onChange={(e) => handleInputChange(p.id, 'stock_quantity', e.target.value)}
          className="mini-input stock-w"
        />
      </div>

      <div className="input-field">
        <span className="field-label">Price</span>
        <input 
          type="number"
          defaultValue={p.price}
          onChange={(e) => handleInputChange(p.id, 'price', e.target.value)}
          className="mini-input price-w"
        />
      </div>

      {/* Save Button Container */}
      <div className="button-slot">
        {hasChanged && (
          <button 
            onClick={() => handleSaveClick(p.id)}
            disabled={updatingId === p.id}
            className="save-btn"
          >
            {updatingId === p.id ? (
              <div className="spinner-mini" />
            ) : (
              <Save size={14} />
            )}
          </button>
        )}
      </div>
    </div>

  </div>
</div>

              );
            })}
          </div>

          <div className="p-3 bg-gray-50 text-center">
            <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
              Angalia Ripoti Kamili →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickInventoryManager;