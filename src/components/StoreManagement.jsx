import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, CheckCircle, X, Plus, Phone, Instagram, Truck, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import api from "../axiosConfig"; // 🔥 Tumia api
//import '../StoreManagement.css';

// 🔥 FUTE HII LINE (haifai tena kwa Cloudinary):
// const BACKEND_BASE_URL = "https://shop-online-r9z4.onrender.com";

const StoreManagement = ({
  isManageMode,
  setIsManageMode,
  myStoreSubCats,
  attributes,
  setAttributes,
  handleRemoveCategoryFromStore,
  setShowCategoryManager,
  officePreviews,
  officeFiles,
  setOfficeFiles,
  setOfficePreviews,
  officeInputRefs,
  storeMeta,
  setStoreMeta,
  isUpdatingStore,
  handleUpdateStoreDetails,
  storeId 
}) => {
  const { id: paramId } = useParams();
  const [storeUuid, setStoreUuid] = useState(null);

  useEffect(() => {
    const resolveStoreId = async () => {
      if (storeId) { setStoreUuid(storeId); return; }
      if (!paramId) return;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(paramId)) {
        setStoreUuid(paramId);
      } else {
        try {
          // 🔥 MABADILIKO: api.get
          const response = await api.get('/stores/', {
            params: { store_index: parseInt(paramId) },
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          });
          if (response.data && response.data.length > 0) setStoreUuid(response.data[0].id);
        } catch (error) { console.error("Error fetching store by index:", error); }
      }
    };
    resolveStoreId();
  }, [storeId, paramId]);

  const [shippingMethods, setShippingMethods] = useState([]);
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShipping, setNewShipping] = useState({
    label: '', description: '', price_local: '', price_national: '', is_active: true
  });

  useEffect(() => {
    if (!storeUuid) return;
    const fetchShippingMethods = async () => {
      try {
        const token = localStorage.getItem("access_token");
        // 🔥 MABADILIKO: api.get
        const response = await api.get('/shipping-methods/', {
          params: { store_id: storeUuid },
          headers: { Authorization: `Bearer ${token}` }
        });
        setShippingMethods(response.data || []);
      } catch (error) { console.error('Error fetching shipping methods:', error); }
    };
    fetchShippingMethods();
  }, [storeUuid]);

  const handleAddShipping = async () => {
    if (!storeUuid) return alert("Store ID is missing.");
    if (!newShipping.label.trim()) return alert('Please fill in the shipping method name');
    try {
      const token = localStorage.getItem("access_token");
      // 🔥 MABADILIKO: api.post
      const response = await api.post('/shipping-methods/', {
          store_id: storeUuid, label: newShipping.label, description: newShipping.description || null,
          price_local: parseFloat(newShipping.price_local) || 0, price_national: parseFloat(newShipping.price_national) || 0, is_active: true
        }, { headers: { Authorization: `Bearer ${token}` } }
      );
      setShippingMethods([...shippingMethods, response.data]);
      setNewShipping({ label: '', description: '', price_local: '', price_national: '', is_active: true });
      setShowAddForm(false);
      } catch (error) { alert('Failed to add: ' + (error.response?.data?.detail || error.message)); }
  };

  const handleUpdateShipping = async (id, updatedFields) => {
    try {
      const token = localStorage.getItem("access_token");
      // 🔥 MABADILIKO: api.patch
      await api.patch(`/shipping-methods/${id}/`, updatedFields, { headers: { Authorization: `Bearer ${token}` } });
      setShippingMethods(shippingMethods.map(m => m.id === id ? { ...m, ...updatedFields } : m));
      setEditingShippingId(null);
      } catch (error) { alert('Failed to update: ' + (error.response?.data?.detail || error.message)); }
  };

  const handleDeleteShipping = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shipping method?')) return;
    try {
      const token = localStorage.getItem("access_token");
      // 🔥 MABADILIKO: api.delete
      await api.delete(`/shipping-methods/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setShippingMethods(shippingMethods.filter(m => m.id !== id));
        } catch (error) { alert('Failed to delete: ' + (error.response?.data?.detail || error.message)); }
  };

  const toggleActive = async (id, currentStatus) => {
    await handleUpdateShipping(id, { is_active: !currentStatus });
  };

  const actualStoreSubCats = useMemo(() => {
    if (!storeMeta || !storeMeta.sub_category_ids) return [];
    
    let storeSubIds = [];
    if (typeof storeMeta.sub_category_ids === 'string') {
      try {
        storeSubIds = JSON.parse(storeMeta.sub_category_ids);
      } catch (e) {
        console.error("Error parsing sub_category_ids", e);
        storeSubIds = [];
      }
    } else if (Array.isArray(storeMeta.sub_category_ids)) {
      storeSubIds = storeMeta.sub_category_ids;
    }

    return myStoreSubCats.filter(subCat => storeSubIds.includes(subCat.id));
  }, [myStoreSubCats, storeMeta]);

  // 🔥 BADILISHA HAPA: Rudisha URL tu (imekuwa Cloudinary URL tayari)
  const getFullImageUrl = (url) => {
    if (!url) return null;
    // Kama url tayari ni Cloudinary URL, irudishe tu
    return url;
  };

 return (
    <section className="mt-6">
      <div className="bg-white dark:bg-slate-800 rounded-[20px] p-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-slate-700">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-slate-200 text-sm m-0">
              🏷️ Store Categories
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 mb-0">
              Choose the product category you want to add
            </p>
          </div>
          <button
            onClick={() => setIsManageMode(!isManageMode)}
            className={`text-[10px] px-3 py-1.5 rounded-lg font-bold border transition-all duration-200 flex items-center gap-1 shadow-none cursor-pointer ${
              isManageMode
                ? 'bg-red-500 text-white border-red-500 shadow-md'
                : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-200 border-gray-200 dark:border-slate-600'
            }`}
          >
            <Settings size={12} /> {isManageMode ? "FINISH" : "MANAGE"}
          </button>
        </div>

        {/* ===== CATEGORY BADGES ===== */}
        <div className="flex flex-wrap gap-2 mb-6">
          {actualStoreSubCats.length > 0 ? (
            actualStoreSubCats.map((sub) => (
              <div key={sub.id} className="relative">
                <button
                  type="button"
                  onClick={() => setAttributes({ ...attributes, category_id: sub.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    attributes.category_id === sub.id
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-100 dark:border-slate-600'
                  }`}
                >
                  {sub.name}
                  {attributes.category_id === sub.id && <CheckCircle size={12} />}
                </button>
                {isManageMode && (
                  <button
                    onClick={() => handleRemoveCategoryFromStore(sub.id)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 shadow-md z-10 border-none cursor-pointer w-4 h-4 flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="w-full py-4 text-center border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl">
              <p className="text-gray-400 dark:text-slate-400 text-[10px] italic m-0">
                You haven't selected any categories yet.
              </p>
            </div>
          )}
          <button
            onClick={() => setShowCategoryManager(true)}
            className="w-8 h-8 rounded-full bg-orange-50 dark:bg-slate-700 text-orange-600 dark:text-orange-500 border border-orange-100 dark:border-slate-600 flex items-center justify-center cursor-pointer p-0"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* ===== SHIPPING METHODS ===== */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-50 dark:bg-slate-700 rounded-xl">
                <Truck size={20} className="text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-slate-200 text-base m-0">
                🚚 Shipping Methods
              </h3>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs bg-orange-50 dark:bg-slate-700 text-orange-600 dark:text-orange-500 px-3 py-1.5 rounded-full border-none cursor-pointer flex items-center gap-1"
            >
              {showAddForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAddForm ? "Hide form" : "Add method"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
            {shippingMethods.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                <Truck size={32} className="mx-auto mb-2 text-gray-300 dark:text-slate-600" />
                <p className="text-gray-400 dark:text-slate-400 text-sm m-0 mb-2">
                  No shipping methods available
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-orange-500 text-xs font-medium bg-transparent border-none cursor-pointer"
                >
                  + Add the first method
                </button>
              </div>
            ) : (
              shippingMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700"
                >
                  {editingShippingId === method.id ? (
                    <div className="p-4 flex flex-col gap-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={method.label}
                        onChange={(e) => {
                          const updated = { ...method, label: e.target.value };
                          setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                        }}
                      />
                      <textarea
                        rows="1"
                        className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Description"
                        value={method.description || ''}
                        onChange={(e) => {
                          const updated = { ...method, description: e.target.value };
                          setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                        }}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Dar es Salaam"
                          className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={method.price_local}
                          onChange={(e) => {
                            const updated = { ...method, price_local: e.target.value };
                            setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Regions"
                          className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={method.price_national}
                          onChange={(e) => {
                            const updated = { ...method, price_national: e.target.value };
                            setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                          }}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateShipping(method.id, {
                            label: method.label, description: method.description,
                            price_local: method.price_local, price_national: method.price_national
                          })}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs border-none cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingShippingId(null)}
                          className="bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200 px-3 py-1 rounded-lg text-xs border-none cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800 dark:text-slate-200">
                            {method.label}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              method.is_active
                                ? 'bg-green-100 text-green-600 dark:bg-[#1a3a2a] dark:text-[#4ade80]'
                                : 'bg-red-100 text-red-500 dark:bg-[#2d1a1a] dark:text-[#f87171]'
                            }`}
                          >
                            {method.is_active ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        {method.description && (
                          <p className="text-xs text-gray-400 dark:text-slate-400 mt-1">
                            {method.description}
                          </p>
                        )}
                        <div className="flex gap-3 mt-2 text-xs text-gray-600 dark:text-slate-400">
                          <span>Dar es Salaam: TZS {Number(method.price_local).toLocaleString()}</span>
                          <span>Regions: TZS {Number(method.price_national).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingShippingId(method.id)}
                          className="p-1.5 rounded-full border-none cursor-pointer bg-blue-50 text-blue-600 dark:bg-[#1e3a5f] dark:text-[#60a5fa]"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => toggleActive(method.id, method.is_active)}
                          className={`p-1.5 rounded-full border-none cursor-pointer ${
                            method.is_active
                              ? 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'
                              : 'bg-green-100 text-green-600 dark:bg-[#1a3a2a] dark:text-[#4ade80]'
                          }`}
                        >
                          {method.is_active ? <X size={14} /> : <CheckCircle size={14} />}
                        </button>
                        <button
                          onClick={() => handleDeleteShipping(method.id)}
                          className="p-1.5 rounded-full border-none cursor-pointer bg-red-50 text-red-500 dark:bg-[#2d1a1a] dark:text-[#f87171]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {showAddForm && (
            <div className="bg-orange-50 dark:bg-slate-700 rounded-xl p-4 border border-orange-100 dark:border-slate-600 mt-2">
              <h4 className="font-semibold text-orange-900 dark:text-orange-500 text-sm m-0 mb-3">
                ➕ New Shipping Method
              </h4>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Method name *"
                  className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newShipping.label}
                  onChange={e => setNewShipping({ ...newShipping, label: e.target.value })}
                />
                <textarea
                  rows="1"
                  placeholder="Description (optional)"
                  className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newShipping.description}
                  onChange={e => setNewShipping({ ...newShipping, description: e.target.value })}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Dar es Salaam price"
                    className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newShipping.price_local}
                    onChange={e => setNewShipping({ ...newShipping, price_local: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Regions price"
                    className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newShipping.price_national}
                    onChange={e => setNewShipping({ ...newShipping, price_national: e.target.value })}
                  />
                </div>
                <button
                  onClick={handleAddShipping}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold border-none cursor-pointer hover:bg-orange-600 transition-colors"
                >
                  Add Method
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== OFFICE IMAGES & STORE DETAILS ===== */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-3">
            {officePreviews.map((url, index) => (
              <div
                key={`${index}-${url || index}`}
                className="relative w-full aspect-square bg-gray-100 dark:bg-slate-900 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center"
                onClick={() => officeInputRefs.current[index]?.click()}
              >
                {url ? (
                  <img src={getFullImageUrl(url)} alt="Office" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-slate-400 text-[11px]">
                    📸 Photo {index + 1}
                  </div>
                )}
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={(el) => (officeInputRefs.current[index] = el)}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (officePreviews[index] && officePreviews[index].startsWith('blob:')) {
                        try { URL.revokeObjectURL(officePreviews[index]); } catch (err) {}
                      }
                      const safeOfficeFiles = Array.isArray(officeFiles) ? officeFiles : [null, null, null];
                      const nF = [...safeOfficeFiles];
                      const nP = [...officePreviews];
                      nF[index] = file;
                      nP[index] = URL.createObjectURL(file);
                      setOfficeFiles(nF);
                      setOfficePreviews(nP);
                      e.target.value = null;
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* ===== DETAILS FORM ===== */}
          <div className="mt-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-5">
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200">
                  Store Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800"
                  value={storeMeta.store_name}
                  onChange={(e) => setStoreMeta({ ...storeMeta, store_name: e.target.value })}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200">
                  Business Phone
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800"
                  value={storeMeta.phone_number}
                  onChange={(e) => setStoreMeta({ ...storeMeta, phone_number: e.target.value })}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-5">
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200 flex items-center">
                  <Phone size={14} className="inline mr-1" /> WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="255..."
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800"
                  value={storeMeta.whatsapp_number}
                  onChange={(e) => setStoreMeta({ ...storeMeta, whatsapp_number: e.target.value })}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200 flex items-center">
                  <Instagram size={14} className="inline mr-1" /> Instagram
                </label>
                <input
                  type="text"
                  placeholder="@handle"
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800"
                  value={storeMeta.instagram_handle}
                  onChange={(e) => setStoreMeta({ ...storeMeta, instagram_handle: e.target.value })}
                />
              </div>
            </div>

            {/* Row 3 (full) */}
            <div className="grid grid-cols-1 gap-3 md:gap-5 mb-5">
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200">
                  Physical Address
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800"
                  value={storeMeta.physical_address}
                  onChange={(e) => setStoreMeta({ ...storeMeta, physical_address: e.target.value })}
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-5">
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200">
                  TIN Number 🔒
                </label>
                <input
                  type="text"
                  value={storeMeta.tin_number || "Loading..."}
                  readOnly
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 box-border cursor-not-allowed opacity-80 font-mono"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  placeholder="@username"
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 box-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800"
                  value={storeMeta.tiktok_handle || ""}
                  onChange={(e) => setStoreMeta({ ...storeMeta, tiktok_handle: e.target.value })}
                />
              </div>
            </div>

            {/* Row 5 (full) - Description */}
            <div className="grid grid-cols-1 gap-3 md:gap-5 mb-5">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium mb-2 text-gray-800 dark:text-slate-200">
                  Store Description
                </label>
                <textarea
                  rows="3"
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-slate-200 bg-gray-50 dark:bg-slate-700 font-[inherit] box-border resize-y focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={storeMeta.description || ""}
                  onChange={(e) => setStoreMeta({ ...storeMeta, description: e.target.value })}
                />
              </div>
            </div>

            {/* Row 6 - Location */}
            <div className="grid grid-cols-1 gap-3 md:gap-5 mb-5">
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200">
                  📍 Store Location (GPS)
                </label>
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setStoreMeta({
                            ...storeMeta,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          });
                          alert("✅ Location imepatikana!");
                        },
                        (err) => {
                          console.error("Error getting location:", err);
                          alert("❌ Imeshindwa kupata location. Hakikisha browser inaruhusu location.");
                        },
                        { enableHighAccuracy: true, timeout: 10000 }
                      );
                    } else {
                      alert("Geolocation not supported!");
                    }
                  }}
                  className="w-full py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-lg cursor-pointer font-semibold mb-3 transition-colors"
                >
                  📍 Get My Location
                </button>
              </div>
            </div>

            {/* Row 7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-5">
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200">
                  Latitude
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 box-border"
                  placeholder="-6.7924"
                  value={storeMeta.latitude || ""}
                  onChange={(e) => setStoreMeta({ ...storeMeta, latitude: e.target.value })}
                  readOnly
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-[13px] font-semibold mb-2 text-gray-800 dark:text-slate-200">
                  Longitude
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-[1.5px] border-gray-200 dark:border-slate-600 rounded-[10px] text-sm bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 box-border"
                  placeholder="39.2083"
                  value={storeMeta.longitude || ""}
                  onChange={(e) => setStoreMeta({ ...storeMeta, longitude: e.target.value })}
                  readOnly
                />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleUpdateStoreDetails}
              disabled={isUpdatingStore}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white border-none rounded-xl font-bold cursor-pointer mt-6 transition-all"
            >
              {isUpdatingStore ? "Saving..." : "Save Store Changes ✅"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreManagement;