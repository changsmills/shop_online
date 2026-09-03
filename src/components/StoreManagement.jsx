import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, CheckCircle, X, Plus, Phone, Instagram, Truck, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import api from "../axiosConfig"; // 🔥 Tumia api
import '../StoreManagement.css';

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
    <section className="sm-section">
      <div className="sm-card">
        
        <div className="sm-header">
          <div>
            <h3 className="sm-header-title">🏷️ Store Categories</h3>
            <p className="sm-header-sub">Choose the product category you want to add</p>
          </div>
          <button 
            onClick={() => setIsManageMode(!isManageMode)}
            className={`sm-toggle-btn ${isManageMode ? 'active' : ''}`}
          >
          <Settings size={12} /> {isManageMode ? "FINISH" : "MANAGE"}
          </button>
        </div>

        <div className="sm-cat-wrapper">
          {actualStoreSubCats.length > 0 ? (
            actualStoreSubCats.map((sub) => (
              <div key={sub.id} className="sm-cat-item-wrap">
                <button
                  type="button"
                  onClick={() => setAttributes({ ...attributes, category_id: sub.id })}
                  className={`sm-cat-item ${attributes.category_id === sub.id ? 'active' : ''}`}
                >
                  {sub.name}
                  {attributes.category_id === sub.id && <CheckCircle size={12} />}
                </button>
                {isManageMode && (
                  <button 
                    onClick={() => handleRemoveCategoryFromStore(sub.id)}
                    className="sm-cat-remove"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="sm-empty-cat">
              <p>You haven't selected any categories yet.</p>
            </div>
          )}
          <button 
            onClick={() => setShowCategoryManager(true)}
            className="sm-add-cat-btn"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="sm-shipping-section">
          <div className="sm-shipping-header">
            <div className="sm-shipping-title-wrap">
              <div className="sm-shipping-icon-wrap">
                <Truck size={20} className="sm-shipping-icon" />
              </div>
                <h3 className="sm-shipping-title">🚚 Shipping Methods</h3>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="sm-shipping-toggle-btn"
            >
              {showAddForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAddForm ? "Hide form" : "Add method"}
            </button>
          </div>

          <div className="sm-shipping-grid">
            {shippingMethods.length === 0 ? (
              <div className="sm-shipping-empty">
                <Truck size={32} className="sm-shipping-empty-icon" />

                <p className="sm-shipping-empty-text">No shipping methods available</p>
                <button onClick={() => setShowAddForm(true)} className="sm-shipping-empty-btn">
                  + Add the first method
                </button>

              </div>
            ) : (
              shippingMethods.map((method) => (
                <div key={method.id} className="sm-shipping-item">
                  {editingShippingId === method.id ? (
                    <div className="sm-shipping-edit">
                      <input type="text" className="sm-input-full" value={method.label}
                        onChange={(e) => {
                          const updated = { ...method, label: e.target.value };
                          setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                        }} />
                                            <textarea rows="1" className="sm-input-full" placeholder="Description" value={method.description || ''}
                        onChange={(e) => {
                          const updated = { ...method, description: e.target.value };
                          setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                        }} />
                      <div className="sm-input-half-grid">
                          <input type="number" placeholder="Dar es Salaam" className="sm-input-full" value={method.price_local}
                          onChange={(e) => {
                            const updated = { ...method, price_local: e.target.value };
                            setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                          }} />
                          <input type="number" placeholder="Regions" className="sm-input-full" value={method.price_national}
                          onChange={(e) => {
                            const updated = { ...method, price_national: e.target.value };
                            setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                          }} />
                      </div>
                      <div className="sm-edit-actions">
                          <button onClick={() => handleUpdateShipping(method.id, {
                          label: method.label, description: method.description,
                          price_local: method.price_local, price_national: method.price_national
                        })} className="sm-btn-success">Save</button>
                        <button onClick={() => setEditingShippingId(null)} className="sm-btn-cancel">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="sm-shipping-view">
                      <div className="sm-shipping-view-content">
                        <div className="sm-shipping-label-row">
                          <span className="sm-shipping-label">{method.label}</span>

                           <span className={`sm-shipping-status ${method.is_active ? 'active' : 'inactive'}`}>
                            {method.is_active ? 'Active' : 'Hidden'}
                          </span>

                        </div>
                        {method.description && <p className="sm-shipping-desc">{method.description}</p>}

                       <div className="sm-shipping-prices">
                          <span>Dar es Salaam: TZS {Number(method.price_local).toLocaleString()}</span>
                          <span>Regions: TZS {Number(method.price_national).toLocaleString()}</span>
                        </div>

                      </div>
                      <div className="sm-shipping-actions">
                        <button onClick={() => setEditingShippingId(method.id)} className="sm-action-btn edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => toggleActive(method.id, method.is_active)} className={`sm-action-btn ${method.is_active ? 'toggle-off' : 'toggle-on'}`}>
                          {method.is_active ? <X size={14} /> : <CheckCircle size={14} />}
                        </button>
                        <button onClick={() => handleDeleteShipping(method.id)} className="sm-action-btn delete">
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
            <div className="sm-shipping-form-wrap">

                <h4 className="sm-shipping-form-title">➕ New Shipping Method</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Method name *" className="sm-input-full" value={newShipping.label} onChange={e => setNewShipping({...newShipping, label: e.target.value})} />
                <textarea rows="1" placeholder="Description (optional)" className="sm-input-full" value={newShipping.description} onChange={e => setNewShipping({...newShipping, description: e.target.value})} />
                <div className="sm-input-half-grid">
                  <input type="number" placeholder="Dar es Salaam price" className="sm-input-full" value={newShipping.price_local} onChange={e => setNewShipping({...newShipping, price_local: e.target.value})} />
                  <input type="number" placeholder="Regions price" className="sm-input-full" value={newShipping.price_national} onChange={e => setNewShipping({...newShipping, price_national: e.target.value})} />
                </div>
                <button onClick={handleAddShipping} className="sm-shipping-submit-btn">Add Method</button>
              </div>

            </div>
          )}
        </div>

        <div className="sm-details-section">
          <div className="sm-office-grid">
            {officePreviews.map((url, index) => (
              <div 
                key={`${index}-${url || index}`}
                className="sm-office-box"
                onClick={() => officeInputRefs.current[index]?.click()}
              >
                {url ? (
                  <img src={getFullImageUrl(url)} alt="Office" />
                ) : (
                  <div className="sm-office-box-placeholder">📸 Photo {index + 1}</div>
                )}
                <input 
                  type="file" 
                  style={{ display: 'none' }} 
                  ref={(el) => (officeInputRefs.current[index] = el)} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (officePreviews[index] && officePreviews[index].startsWith('blob:')) {
                        try {
                          URL.revokeObjectURL(officePreviews[index]);
                        } catch (err) {
                          console.warn("Could not revoke blob URL");
                        }
                      }
                      const safeOfficeFiles = Array.isArray(officeFiles) ? officeFiles : [null, null, null];
                      const nF = [...safeOfficeFiles]; const nP = [...officePreviews];
                      nF[index] = file; nP[index] = URL.createObjectURL(file);
                      setOfficeFiles(nF); setOfficePreviews(nP);
                      e.target.value = null; 
                    }
                  }} 
                />
              </div>
            ))}
          </div>

         <div className="sm-details-form">
  <div className="sm-form-row">
    <div className="sm-input-group">
      <label className="sm-label">Store Name</label>
      <input type="text" className="sm-input" value={storeMeta.store_name} onChange={(e) => setStoreMeta({ ...storeMeta, store_name: e.target.value })} />
    </div>
    <div className="sm-input-group">
      <label className="sm-label">Business Phone</label>
      <input type="text" className="sm-input" value={storeMeta.phone_number} onChange={(e) => setStoreMeta({ ...storeMeta, phone_number: e.target.value })} />
    </div>
  </div>

  <div className="sm-form-row">
    <div className="sm-input-group">
      <label className="sm-label"><Phone size={14} className="sm-icon" /> WhatsApp</label>
      <input type="text" className="sm-input" placeholder="255..." value={storeMeta.whatsapp_number} onChange={(e) => setStoreMeta({ ...storeMeta, whatsapp_number: e.target.value })} />
    </div>
    <div className="sm-input-group">
      <label className="sm-label"><Instagram size={14} className="sm-icon" /> Instagram</label>
      <input type="text" className="sm-input" placeholder="@handle" value={storeMeta.instagram_handle} onChange={(e) => setStoreMeta({ ...storeMeta, instagram_handle: e.target.value })} />
    </div>
  </div>

  <div className="sm-form-row full">
    <div className="sm-input-group">
      <label className="sm-label">Physical Address</label>
      <input type="text" className="sm-input" value={storeMeta.physical_address} onChange={(e) => setStoreMeta({ ...storeMeta, physical_address: e.target.value })} />
    </div>
  </div>

  <div className="sm-form-row">
    <div className="sm-input-group">
      <label className="sm-label">TIN Number 🔒</label>
      <input type="text" value={storeMeta.tin_number || "Loading..."} readOnly className="sm-input disabled" />
    </div>
    <div className="sm-input-group">
      <label className="sm-label">TikTok Handle</label>
      <input type="text" className="sm-input" placeholder="@username" value={storeMeta.tiktok_handle || ""} onChange={(e) => setStoreMeta({ ...storeMeta, tiktok_handle: e.target.value })} />
    </div>
  </div>

  <div className="sm-form-row full">
    <div className="sm-input-group">
      <label className="sm-label" style={{ fontSize: '14px', fontWeight: '500' }}>Store Description</label>
      <textarea rows="3" className="sm-textarea" value={storeMeta.description || ""} onChange={(e) => setStoreMeta({ ...storeMeta, description: e.target.value })} />
    </div>
  </div>

  {/* 🔥 ONGEZA HAPA: LOCATION SETTINGS */}
  <div className="sm-form-row full">
    <div className="sm-input-group">
      <label className="sm-label">📍 Store Location (GPS)</label>
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
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff6a00',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '12px',
          width: '100%'
        }}
      >
        📍 Get My Location
      </button>
    </div>
  </div>

  <div className="sm-form-row">
    <div className="sm-input-group">
      <label className="sm-label">Latitude</label>
      <input
        type="text"
        className="sm-input"
        placeholder="-6.7924"
        value={storeMeta.latitude || ""}
        onChange={(e) => setStoreMeta({ ...storeMeta, latitude: e.target.value })}
        readOnly
      />
    </div>
    <div className="sm-input-group">
      <label className="sm-label">Longitude</label>
      <input
        type="text"
        className="sm-input"
        placeholder="39.2083"
        value={storeMeta.longitude || ""}
        onChange={(e) => setStoreMeta({ ...storeMeta, longitude: e.target.value })}
        readOnly
      />
    </div>
  </div>

  <button onClick={handleUpdateStoreDetails} disabled={isUpdatingStore} className="sm-submit-btn">
    {isUpdatingStore ? "Saving..." : "Save Store Changes ✅"}
  </button>
</div>
        </div>
      </div>
    </section>
  );
};

export default StoreManagement;