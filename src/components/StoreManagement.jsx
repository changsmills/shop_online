import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // + ONGEZA HII
import { Settings, CheckCircle, X, Plus, Phone, Instagram, Camera, Truck, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../supabaseClient';

const StoreManagement = ({
  // storeId prop SIITUMII TENA – tunaipata kutoka URL
  isManageMode,
  isMobile,
  setIsManageMode,
  myStoreSubCats,
  attributes,
  setAttributes,
  handleRemoveCategoryFromStore,
  setShowCategoryManager,
  selectedCategory,
  officePreviews,
  officeFiles,
  setOfficeFiles,
  setOfficePreviews,
  officeInputRefs,
  storeMeta,
  setStoreMeta,
  isUpdatingStore,
  handleUpdateStoreDetails
}) => {
  // ========== PATA STORE UUID KUTOKA URL ==========
  const { id: paramId } = useParams();  // inaweza kuwa namba (store_index) au UUID
  const [storeUuid, setStoreUuid] = useState(null);

  // Resolve UUID kutoka paramId
  useEffect(() => {
    const resolveStoreId = async () => {
      if (!paramId) return;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(paramId)) {
        setStoreUuid(paramId);
      } else {
        const { data, error } = await supabase
          .from('stores_engine')
          .select('id')
          .eq('store_index', parseInt(paramId))
          .single();
        if (data && !error) setStoreUuid(data.id);
        else console.error("Store not found for index:", paramId);
      }
    };
    resolveStoreId();
  }, [paramId]);

  // ========== SHIPPING METHODS (sasa zinatumia storeUuid) ==========
  const [shippingMethods, setShippingMethods] = useState([]);
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShipping, setNewShipping] = useState({
    label: '', description: '', price_local: '', price_national: '', is_active: true
  });

  // Fetch shipping methods - inategemea storeUuid
  useEffect(() => {
    if (!storeUuid) return;
    const fetchShippingMethods = async () => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('store_id', storeUuid)
        .order('created_at', { ascending: true });
      if (error) console.error('Error fetching shipping methods:', error);
      else setShippingMethods(data || []);
    };
    fetchShippingMethods();
  }, [storeUuid]);

  // SAVE NEW SHIPPING METHOD
  const handleAddShipping = async () => {
    if (!storeUuid) {
      alert("Store ID haijapatikana. Tafadhali refresh ukurasa.");
      return;
    }
    if (!newShipping.label.trim()) {
      alert('Tafadhali jaza jina la njia ya usafirishaji');
      return;
    }
    if (!newShipping.price_local && !newShipping.price_national) {
      alert('Tafadhali jaza angalau bei moja (Dar au Mikoa)');
      return;
    }

    const { data, error } = await supabase
      .from('shipping_methods')
      .insert([{
        store_id: storeUuid,
        label: newShipping.label,
        description: newShipping.description || null,
        price_local: parseFloat(newShipping.price_local) || 0,
        price_national: parseFloat(newShipping.price_national) || 0,
        is_active: true
      }])
      .select();

    if (error) {
      alert('Imeshindwa kuongeza: ' + error.message);
    } else {
      setShippingMethods([...shippingMethods, data[0]]);
      setNewShipping({ label: '', description: '', price_local: '', price_national: '', is_active: true });
      setShowAddForm(false);
    }
  };

  // UPDATE SHIPPING METHOD
  const handleUpdateShipping = async (id, updatedFields) => {
    const { error } = await supabase
      .from('shipping_methods')
      .update(updatedFields)
      .eq('id', id);
    if (error) {
      alert('Imeshindwa kusasisha: ' + error.message);
    } else {
      setShippingMethods(shippingMethods.map(m => m.id === id ? { ...m, ...updatedFields } : m));
      setEditingShippingId(null);
    }
  };

  // DELETE SHIPPING METHOD
  const handleDeleteShipping = async (id) => {
    if (!window.confirm('Je, una uhakika unataka kufuta njia hii?')) return;
    const { error } = await supabase.from('shipping_methods').delete().eq('id', id);
    if (error) alert('Imeshindwa kufuta: ' + error.message);
    else setShippingMethods(shippingMethods.filter(m => m.id !== id));
  };

  // TOGGLE ACTIVE STATUS
  const toggleActive = async (id, currentStatus) => {
    await handleUpdateShipping(id, { is_active: !currentStatus });
  };

  // ========== RENDR (SEHEMU ILIYOBORESHA – SHIPPING METHODS JUU) ==========
  return (
    <section className="pd-section mt-6">
      <div className="pd-card p-4">
        {/* Kategoria (haijabadilishwa) */}
        <div className="pd-card-header mb-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">🏷️ Kategoria za Duka Lako</h3>
            <p className="text-[10px] text-gray-500">Chagua kategoria ya bidhaa unayotaka kuongeza</p>
          </div>
          <button 
            onClick={() => setIsManageMode(!isManageMode)}
            className={`text-[10px] px-3 py-1.5 rounded-lg font-bold border transition-all flex items-center gap-1 ${
              isManageMode ? 'bg-red-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            <Settings size={12} /> {isManageMode ? "MALIZA" : "DHIBITI"}
          </button>
        </div>

        <div className="pd-subcat-wrapper flex flex-wrap gap-2 mb-6">
          {myStoreSubCats.length > 0 ? (
            myStoreSubCats.map((sub) => (
              <div key={sub.id} className="relative">
                <button
                  type="button"
                  onClick={() => setAttributes({ ...attributes, category_id: sub.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                    attributes.category_id === sub.id 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                      : 'bg-white text-gray-700 border-gray-100 hover:border-orange-300'
                  }`}
                >
                  {sub.name}
                  {attributes.category_id === sub.id && <CheckCircle size={12} />}
                </button>
                {isManageMode && (
                  <button 
                    onClick={() => handleRemoveCategoryFromStore(sub.id)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 shadow-lg hover:scale-110 z-10"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="w-full py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-gray-400 text-[10px] italic">Hujachagua kategoria bado.</p>
            </div>
          )}
          <button 
            onClick={() => setShowCategoryManager(true)}
            className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* SEHEMU YA SHIPPING METHODS (SASA INAFANYA KAZI) */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Truck size={20} className="text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-base">🚚 Njia za Usafirishaji</h3>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full hover:bg-orange-100 flex items-center gap-1 transition"
            >
              {showAddForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAddForm ? "Ficha fomu" : "Ongeza njia"}
            </button>
          </div>

          {/* Grid ya shipping methods (kadi) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {shippingMethods.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Truck size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm">Hakuna njia za usafirishaji</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="mt-2 text-orange-500 text-xs font-medium"
                >
                  + Weka njia ya kwanza
                </button>
              </div>
            ) : (
              shippingMethods.map((method, idx) => (
                <div 
                  key={method.id} 
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  {editingShippingId === method.id ? (
                    // Edit mode
                    <div className="p-4 space-y-3">
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-lg text-sm"
                        value={method.label}
                        onChange={(e) => {
                          const updated = { ...method, label: e.target.value };
                          setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                        }}
                      />
                      <textarea 
                        rows="1"
                        className="w-full p-2 border rounded-lg text-sm"
                        placeholder="Maelezo"
                        value={method.description || ''}
                        onChange={(e) => {
                          const updated = { ...method, description: e.target.value };
                          setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                        }}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Dar" className="p-2 border rounded-lg text-sm" value={method.price_local}
                          onChange={(e) => {
                            const updated = { ...method, price_local: e.target.value };
                            setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                          }} />
                        <input type="number" placeholder="Mikoa" className="p-2 border rounded-lg text-sm" value={method.price_national}
                          onChange={(e) => {
                            const updated = { ...method, price_national: e.target.value };
                            setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                          }} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleUpdateShipping(method.id, {
                          label: method.label,
                          description: method.description,
                          price_local: method.price_local,
                          price_national: method.price_national
                        })} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs">Hifadhi</button>
                        <button onClick={() => setEditingShippingId(null)} className="bg-gray-200 px-3 py-1 rounded-lg text-xs">Ghairi</button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800">{method.label}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${method.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                            {method.is_active ? 'Inatumika' : 'Imefichwa'}
                          </span>
                        </div>
                        {method.description && <p className="text-xs text-gray-400 mt-1">{method.description}</p>}
                        <div className="flex gap-3 mt-2 text-xs">
                          <span>Dar: TZS {Number(method.price_local).toLocaleString()}</span>
                          <span>Mikoa: TZS {Number(method.price_national).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingShippingId(method.id)} className="p-1.5 rounded-full bg-blue-50 text-blue-600">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => toggleActive(method.id, method.is_active)} className={`p-1.5 rounded-full ${method.is_active ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                          {method.is_active ? <X size={14} /> : <CheckCircle size={14} />}
                        </button>
                        <button onClick={() => handleDeleteShipping(method.id)} className="p-1.5 rounded-full bg-red-50 text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Form ya kuongeza (toggle) */}
          {showAddForm && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 mt-2 animate-fadeIn">
              <h4 className="font-semibold text-orange-800 text-sm mb-3">➕ Njia mpya</h4>
              <div className="space-y-3">
                <input type="text" placeholder="Jina la njia *" className="w-full p-2 border rounded-lg text-sm" value={newShipping.label} onChange={e => setNewShipping({...newShipping, label: e.target.value})} />
                <textarea rows="1" placeholder="Maelezo (hiari)" className="w-full p-2 border rounded-lg text-sm" value={newShipping.description} onChange={e => setNewShipping({...newShipping, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Bei Dar" className="p-2 border rounded-lg text-sm" value={newShipping.price_local} onChange={e => setNewShipping({...newShipping, price_local: e.target.value})} />
                  <input type="number" placeholder="Bei Mikoa" className="p-2 border rounded-lg text-sm" value={newShipping.price_national} onChange={e => setNewShipping({...newShipping, price_national: e.target.value})} />
                </div>
                <button onClick={handleAddShipping} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Weka Njia</button>
              </div>
            </div>
          )}
        </div>

        {/* SEHEMU YA OFFICE IMAGES & STORE DETAILS (haijaguswa) */}
        <div className="mt-8 pt-6 border-t border-gray-100">

     <div className="pd-image-upload-grid">
  {officePreviews.map((url, index) => (
    <div 
      key={`${index}-${url || index}`}  // 🔥 MABADILIKO MUHIMU!
      className="pd-image-box" 
      onClick={() => officeInputRefs.current[index]?.click()}
    >
      {url ? (
        <img 
          key={url} 
          src={url} 
          alt="Office" 
          className="pd-office-img" 
        />
      ) : (
        <div className="pd-placeholder">📸 Picha {index + 1}</div>
      )}
      <input 
        type="file" 
        hidden 
        ref={(el) => (officeInputRefs.current[index] = el)} 
        onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    // Safisha picha ya zamani kwenye memory (hiari)
    if (officePreviews[index]) {
      URL.revokeObjectURL(officePreviews[index]);
    }

    // 🔥 MABADILIKO MUHIMU: Hakikisha officeFiles ni array kabla ya kutumia spread
    const safeOfficeFiles = Array.isArray(officeFiles) ? officeFiles : [null, null, null];
    const nF = [...safeOfficeFiles];
    const nP = [...officePreviews];
    
    nF[index] = file; 
    nP[index] = URL.createObjectURL(file);
    setOfficeFiles(nF);
    setOfficePreviews(nP);

    // Safisha input ili iweze kuchagua picha tena
    e.target.value = null; 
  }
}} 
      />
    </div>
  ))}
</div>

          <div className="pd-form-column">
            <div className={isMobile ? "flex flex-col gap-3" : "pd-input-row"}>
              <div className="pd-input-group flex-1"><label>Jina la Duka</label><input type="text" className="w-full" value={storeMeta.store_name} onChange={(e) => setStoreMeta({ ...storeMeta, store_name: e.target.value })} /></div>
              <div className="pd-input-group flex-1"><label>Simu ya Biashara</label><input type="text" className="w-full" value={storeMeta.phone_number} onChange={(e) => setStoreMeta({ ...storeMeta, phone_number: e.target.value })} /></div>
            </div>
            <div className={isMobile ? "flex flex-col gap-3 mt-3" : "pd-input-row mt-3"}>
              <div className="pd-input-group flex-1"><label><Phone size={14} className="inline mr-1" /> WhatsApp</label><input type="text" className="w-full" placeholder="255..." value={storeMeta.whatsapp_number} onChange={(e) => setStoreMeta({ ...storeMeta, whatsapp_number: e.target.value })} /></div>
              <div className="pd-input-group flex-1"><label><Instagram size={14} className="inline mr-1" /> Instagram</label><input type="text" className="w-full" placeholder="@handle" value={storeMeta.instagram_handle} onChange={(e) => setStoreMeta({ ...storeMeta, instagram_handle: e.target.value })} /></div>
            </div>
            <div className="pd-input-group mt-3"><label>Physical Address</label><input type="text" value={storeMeta.physical_address} onChange={(e) => setStoreMeta({ ...storeMeta, physical_address: e.target.value })} /></div>
            <div className={isMobile ? "flex flex-col gap-4 mt-4" : "pd-input-row mt-4"}>
              <div className="pd-input-group flex-1"><label className="block mb-1">TIN Number 🔒</label><input type="text" value={storeMeta.tin_number || "Inapakia..."} readOnly className="bg-gray-100 cursor-not-allowed opacity-80 font-mono w-full" /></div>
              <div className="pd-input-group flex-1"><label className="block mb-1">TikTok Handle</label><input type="text" placeholder="@username" value={storeMeta.tiktok_handle || ""} onChange={(e) => setStoreMeta({ ...storeMeta, tiktok_handle: e.target.value })} className="w-full" /></div>
            </div>
            <div className="pd-input-group mt-4"><label className="block text-sm font-medium mb-1 text-gray-700">Maelezo ya Duka</label><textarea rows="3" className="w-full p-3 rounded-lg border border-gray-200 text-gray-800" value={storeMeta.description || ""} onChange={(e) => setStoreMeta({ ...storeMeta, description: e.target.value })} /></div>
            <button onClick={handleUpdateStoreDetails} disabled={isUpdatingStore} className="pd-save-btn mt-6 w-full">{isUpdatingStore ? "Inasave..." : "Hifadhi Mabadiliko ya Duka ✅"}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreManagement;