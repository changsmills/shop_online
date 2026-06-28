import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, CheckCircle, X, Plus, Phone, Instagram, Camera, Truck, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../supabaseClient';

const StoreManagement = ({
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
  const { id: paramId } = useParams();
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

  // ========== SHIPPING METHODS ==========
  const [shippingMethods, setShippingMethods] = useState([]);
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShipping, setNewShipping] = useState({
    label: '', description: '', price_local: '', price_national: '', is_active: true
  });

  // Fetch shipping methods
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

  // ========== RENDER ==========
  return (
    <section style={{ marginTop: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #f3f4f6' }}>
        
        {/* Kategoria */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '14px', margin: 0 }}>🏷️ Kategoria za Duka Lako</h3>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '4px 0 0 0' }}>Chagua kategoria ya bidhaa unayotaka kuongeza</p>
          </div>
          <button 
            onClick={() => setIsManageMode(!isManageMode)}
            style={{
              fontSize: '10px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: '1px solid',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: isManageMode ? '#ef4444' : '#f9fafb',
              color: isManageMode ? 'white' : '#4b5563',
              borderColor: isManageMode ? '#ef4444' : '#e5e7eb',
              boxShadow: isManageMode ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer'
            }}
          >
            <Settings size={12} /> {isManageMode ? "MALIZA" : "DHIBITI"}
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {myStoreSubCats.length > 0 ? (
            myStoreSubCats.map((sub) => (
              <div key={sub.id} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setAttributes({ ...attributes, category_id: sub.id })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: '1px solid',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    backgroundColor: attributes.category_id === sub.id ? '#f97316' : 'white',
                    color: attributes.category_id === sub.id ? 'white' : '#374151',
                    borderColor: attributes.category_id === sub.id ? '#f97316' : '#f3f4f6',
                    boxShadow: attributes.category_id === sub.id ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  {sub.name}
                  {attributes.category_id === sub.id && <CheckCircle size={12} />}
                </button>
                {isManageMode && (
                  <button 
                    onClick={() => handleRemoveCategoryFromStore(sub.id)}
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '2px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      zIndex: 10,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div style={{ width: '100%', padding: '16px 0', textAlign: 'center', border: '2px dashed #f3f4f6', borderRadius: '12px' }}>
              <p style={{ color: '#9ca3af', fontSize: '10px', fontStyle: 'italic', margin: 0 }}>Hujachagua kategoria bado.</p>
            </div>
          )}
          <button 
            onClick={() => setShowCategoryManager(true)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#fff7ed',
              color: '#ea580c',
              border: '1px solid #ffedd5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* SEHEMU YA SHIPPING METHODS */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '8px', backgroundColor: '#fff7ed', borderRadius: '12px' }}>
                <Truck size={20} style={{ color: '#f97316' }} />
              </div>
              <h3 style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px', margin: 0 }}>🚚 Njia za Usafirishaji</h3>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                fontSize: '12px',
                backgroundColor: '#fff7ed',
                color: '#ea580c',
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
            >
              {showAddForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAddForm ? "Ficha fomu" : "Ongeza njia"}
            </button>
          </div>

          {/* Grid ya shipping methods */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
            {shippingMethods.length === 0 ? (
              <div style={{ gridColumn: 'span 1', textAlign: 'center', padding: '32px 0', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                <Truck size={32} style={{ margin: '0 auto 8px auto', color: '#d1d5db' }} />
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 8px 0' }}>Hakuna njia za usafirishaji</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  style={{ color: '#f97316', fontSize: '12px', fontWeight: '500', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  + Weka njia ya kwanza
                </button>
              </div>
            ) : (
              shippingMethods.map((method) => (
                <div 
                  key={method.id} 
                  style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', transition: 'all 0.2s' }}
                >
                  {editingShippingId === method.id ? (
                    // Edit mode
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input 
                        type="text" 
                        style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                        value={method.label}
                        onChange={(e) => {
                          const updated = { ...method, label: e.target.value };
                          setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                        }}
                      />
                      <textarea 
                        rows="1"
                        style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                        placeholder="Maelezo"
                        value={method.description || ''}
                        onChange={(e) => {
                          const updated = { ...method, description: e.target.value };
                          setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                        }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input type="number" placeholder="Dar" style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} value={method.price_local}
                          onChange={(e) => {
                            const updated = { ...method, price_local: e.target.value };
                            setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                          }} />
                        <input type="number" placeholder="Mikoa" style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} value={method.price_national}
                          onChange={(e) => {
                            const updated = { ...method, price_national: e.target.value };
                            setShippingMethods(shippingMethods.map(m => m.id === method.id ? updated : m));
                          }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => handleUpdateShipping(method.id, {
                          label: method.label,
                          description: method.description,
                          price_local: method.price_local,
                          price_national: method.price_national
                        })} style={{ backgroundColor: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>Hifadhi</button>
                        <button onClick={() => setEditingShippingId(null)} style={{ backgroundColor: '#e5e7eb', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>Ghairi</button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>{method.label}</span>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: method.is_active ? '#dcfce7' : '#fee2e2', color: method.is_active ? '#16a34a' : '#ef4444' }}>
                            {method.is_active ? 'Inatumika' : 'Imefichwa'}
                          </span>
                        </div>
                        {method.description && <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{method.description}</p>}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px' }}>
                          <span>Dar: TZS {Number(method.price_local).toLocaleString()}</span>
                          <span>Mikoa: TZS {Number(method.price_national).toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => setEditingShippingId(method.id)} style={{ padding: '6px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', cursor: 'pointer' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => toggleActive(method.id, method.is_active)} style={{ padding: '6px', borderRadius: '50%', backgroundColor: method.is_active ? '#f3f4f6' : '#dcfce7', color: method.is_active ? '#6b7280' : '#16a34a', border: 'none', cursor: 'pointer' }}>
                          {method.is_active ? <X size={14} /> : <CheckCircle size={14} />}
                        </button>
                        <button onClick={() => handleDeleteShipping(method.id)} style={{ padding: '6px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
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
            <div style={{ backgroundColor: '#fff7ed', borderRadius: '12px', padding: '16px', border: '1px solid #ffedd5', marginTop: '8px' }}>
              <h4 style={{ fontWeight: '600', color: '#9a3412', fontSize: '14px', margin: '0 0 12px 0' }}>➕ Njia mpya</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Jina la njia *" style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} value={newShipping.label} onChange={e => setNewShipping({...newShipping, label: e.target.value})} />
                <textarea rows="1" placeholder="Maelezo (hiari)" style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} value={newShipping.description} onChange={e => setNewShipping({...newShipping, description: e.target.value})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input type="number" placeholder="Bei Dar" style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} value={newShipping.price_local} onChange={e => setNewShipping({...newShipping, price_local: e.target.value})} />
                  <input type="number" placeholder="Bei Mikoa" style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} value={newShipping.price_national} onChange={e => setNewShipping({...newShipping, price_national: e.target.value})} />
                </div>
                <button onClick={handleAddShipping} style={{ width: '100%', backgroundColor: '#f97316', color: 'white', padding: '8px 0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Weka Njia</button>
              </div>
            </div>
          )}
        </div>

        {/* SEHEMU YA OFFICE IMAGES & STORE DETAILS */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {officePreviews.map((url, index) => (
              <div 
                key={`${index}-${url || index}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  background: '#f3f4f6',
                  border: '2px dashed #d1d5db',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => officeInputRefs.current[index]?.click()}
              >
                {url ? (
                  <img 
                    key={url} 
                    src={url} 
                    alt="Office" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '11px' }}>📸 Picha {index + 1}</div>
                )}
                <input 
                  type="file" 
                  style={{ display: 'none' }} 
                  ref={(el) => (officeInputRefs.current[index] = el)} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (officePreviews[index]) {
                        URL.revokeObjectURL(officePreviews[index]);
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

          <div style={{ marginTop: '20px' }}>
            <div style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '12px' } : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Jina la Duka</label>
                <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: '#fcfcfc' }} value={storeMeta.store_name} onChange={(e) => setStoreMeta({ ...storeMeta, store_name: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Simu ya Biashara</label>
                <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: '#fcfcfc' }} value={storeMeta.phone_number} onChange={(e) => setStoreMeta({ ...storeMeta, phone_number: e.target.value })} />
              </div>
            </div>
            
            <div style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' } : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> WhatsApp</label>
                <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: '#fcfcfc' }} placeholder="255..." value={storeMeta.whatsapp_number} onChange={(e) => setStoreMeta({ ...storeMeta, whatsapp_number: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}><Instagram size={14} style={{ display: 'inline', marginRight: '4px' }} /> Instagram</label>
                <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: '#fcfcfc' }} placeholder="@handle" value={storeMeta.instagram_handle} onChange={(e) => setStoreMeta({ ...storeMeta, instagram_handle: e.target.value })} />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px', marginTop: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Physical Address</label>
              <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: '#fcfcfc' }} value={storeMeta.physical_address} onChange={(e) => setStoreMeta({ ...storeMeta, physical_address: e.target.value })} />
            </div>
            
            <div style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' } : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>TIN Number 🔒</label>
                <input type="text" value={storeMeta.tin_number || "Inapakia..."} readOnly style={{ width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: '#f3f4f6', cursor: 'not-allowed', opacity: 0.8, fontFamily: 'monospace' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>TikTok Handle</label>
                <input type="text" placeholder="@username" value={storeMeta.tiktok_handle || ""} onChange={(e) => setStoreMeta({ ...storeMeta, tiktok_handle: e.target.value })} style={{ width: '100%', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: '#fcfcfc' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Maelezo ya Duka</label>
              <textarea rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#1f2937' }} value={storeMeta.description || ""} onChange={(e) => setStoreMeta({ ...storeMeta, description: e.target.value })} />
            </div>
            
            <button onClick={handleUpdateStoreDetails} disabled={isUpdatingStore} style={{ width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: isUpdatingStore ? 'not-allowed' : 'pointer', marginTop: '24px', opacity: isUpdatingStore ? 0.6 : 1 }}>
              {isUpdatingStore ? "Inasave..." : "Hifadhi Mabadiliko ya Duka ✅"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreManagement;