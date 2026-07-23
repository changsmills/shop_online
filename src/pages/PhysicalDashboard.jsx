import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = "http://127.0.0.1:8000/api";
const BACKEND_URL = "http://127.0.0.1:8000"; // 🔥 ONGEZA HII KWA AJILI YA PICHA!
import QuickInventoryManager from '../components/QuickInventoryManager';
import BusinessAnalytics from '../components/BusinessAnalytics';
import TopDealsSection from "../components/TopDealsSection"
import StoreHeader from '../components/StoreHeader';
import StoreManagement from '../components/StoreManagement';
import ProductCreationFlow from '../components/ProductCreationFlow';
import {
  Edit3, Rocket, X, CheckCircle, Plus,
  LayoutDashboard, Package, Box, BarChart3, Store, Megaphone, Menu, Bell, User,TrendingUp,LogOut,MessageSquare, Settings, ClipboardList
} from 'lucide-react';
import ReactDOM from 'react-dom';
import "../PhysicalDashboard.css";

export default function PhysicalDashboard() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const [isManageMode, setIsManageMode] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);
  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const [allSubCategories, setAllSubCategories] = useState([]);
  const [myStore, setMyStore] = useState(null);
  const [myStoreSubCats, setMyStoreSubCats] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [storeMeta, setStoreMeta] = useState({
    store_name: "", phone_number: "", whatsapp_number: "",
    instagram_handle: "", tiktok_handle: "", youtube_link: "",
    physical_address: "", working_hours: "", tin_number: "",
    description: "", city: "",
  });

  const [attributes, setAttributes] = useState({
    name: "", price: "", compare_at_price: "", 
    category_id: "", brand_id: "", stock: "",
    description: "", specifications: {}
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [officePreviews, setOfficePreviews] = useState([null, null, null]);
  const [officeFiles, setOfficeFiles] = useState([null, null, null]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const officeInputRefs = useRef([]);
  const coverInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => { fetchDashboardData(); }, [paramId]);

  // 🔥 RESIZE: Haina 'isMobile' state tena, inatumia window.innerWidth direct
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!myStore?.id) return;
    const fetchUnreadMessages = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const response = await axios.get(`${API_BASE_URL}/messages/`, {
          params: { receiver_id: myStore.id, is_read: false },
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadMessages(response.data?.length || 0);
      } catch (err) { console.error("Error fetching messages:", err); }
    };
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 10000);
    return () => clearInterval(interval);
  }, [myStore?.id]);

  const resetProductForm = () => {
    setAttributes({
      name: "", price: "", compare_at_price: "",
      category_id: attributes.category_id,
      brand_id: "", stock: "", description: "", specifications: {}
    });
    setCoverFile(null); setCoverPreview(null);
    setGalleryFiles([]); setGalleryPreviews([]);
    setVideoFile(null); setVideoPreview(null);
    setEditingProductId(null);
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) { navigate('/dashboard/login'); return; }
      const headers = { Authorization: `Bearer ${token}` };

      try { const bRes = await axios.get(`${API_BASE_URL}/brands/`, { headers }); if (bRes.data) setBrands(bRes.data); } catch (brandErr) { setBrands([]); }

      const catRes = await axios.get(`${API_BASE_URL}/subcategories/`, { headers });
      if (catRes.data) setAllSubCategories(catRes.data);

      let store = null;
      if (paramId) {
        try { const storeRes = await axios.get(`${API_BASE_URL}/stores/${paramId}/`, { headers }); store = storeRes.data; } catch (err) {
          const profileRes = await axios.get(`${API_BASE_URL}/profile/`, { headers });
          const ownerId = profileRes.data.id;
          const storesRes = await axios.get(`${API_BASE_URL}/stores/?owner=${ownerId}`, { headers });
          const results = storesRes.data.results || storesRes.data;
          if (Array.isArray(results) && results.length > 0) store = results[0];
        }
      } else {
        const profileRes = await axios.get(`${API_BASE_URL}/profile/`, { headers });
        const ownerId = profileRes.data.id;
        const storesRes = await axios.get(`${API_BASE_URL}/stores/?owner=${ownerId}`, { headers });
        const results = storesRes.data.results || storesRes.data;
        if (Array.isArray(results) && results.length > 0) store = results[0];
      }

      if (store) {
        setMyStore(store);
        // 🔥 FIX: Ongeza BACKEND_URL mbele ya picha zote!
        setLogoPreview(store.store_logo ? `${BACKEND_URL}/${store.store_logo}` : null);
        setBannerPreview(store.store_banner ? `${BACKEND_URL}/${store.store_banner}` : null);
        
        // 🔥 MABADILIKO HAPA: ONGEZA category_id na sub_category_ids!
        setStoreMeta({
          store_name: store.store_name || "", 
          phone_number: store.phone_number || "", 
          whatsapp_number: store.whatsapp_number || "",
          instagram_handle: store.instagram_handle || "", 
          tiktok_handle: store.tiktok_handle || "", 
          youtube_link: store.youtube_link || "",
          physical_address: store.physical_address || "", 
          working_hours: store.working_hours || "Mon - Sat (8:00 AM - 6:00 PM)",
          tin_number: store.tin_number || "", 
          description: store.description || "", 
          city: store.city || "",
          
          // ✅ HIZI NDIO ZINAZOKOSEA KABISA! (Zinafanya kategoria zionekane)
          category_id: store.category_id || null,
          sub_category_ids: store.sub_category_ids || []
        });

        // 🔥 FIX: Ongeza BACKEND_URL kwa picha za Ofisi
        setOfficePreviews([
          store.office_image_1 ? `${BACKEND_URL}/${store.office_image_1}` : null,
          store.office_image_2 ? `${BACKEND_URL}/${store.office_image_2}` : null,
          store.office_image_3 ? `${BACKEND_URL}/${store.office_image_3}` : null,
        ]);

        if (store.sub_category_ids?.length > 0) {
          const subDataRes = await axios.get(`${API_BASE_URL}/subcategories/`, {
            params: { id__in: store.sub_category_ids.join(',') }, headers
          });
          if (subDataRes.data) setMyStoreSubCats(subDataRes.data);
        }
        const prodsRes = await axios.get(`${API_BASE_URL}/products/`, {
          params: { store_id: store.id, ordering: '-created_at' }, headers
        });
        if (prodsRes.data) setMyProducts(prodsRes.data);
      } else { setMyStore(null); }
    } catch (err) {
      console.error("❌ Fetch Error Kubwa:", err);
      if (err.response?.status === 401) navigate('/dashboard/login');
    }
  };

  const handleRemoveCategoryFromStore = async (catId) => {
    if (!window.confirm("Je, una uhakika unataka kuondoa kategoria hii?")) return;
    if (!myStore?.id) return alert("Duka halijapatikana!");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return alert("Token haipo!");
      const updatedIds = (myStore.sub_category_ids || []).filter(cid => cid !== catId);
      await axios.patch(`${API_BASE_URL}/stores/${myStore.id}/`, { sub_category_ids: updatedIds }, { headers: { Authorization: `Bearer ${token}` } });
      fetchDashboardData();
    } catch (err) { console.error(err); alert("Imeshindikana: " + (err.response?.data?.detail || err.message)); }
  };

  const handleUpdateStoreDetails = async () => {
    if (!myStore?.id) return alert("Duka halijapatikana!");
    setIsUpdatingStore(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return alert("Token haipo!");
      const formData = new FormData();
      Object.keys(storeMeta).forEach(key => formData.append(key, storeMeta[key]));
      if (logoFile) formData.append("store_logo", logoFile);
      if (bannerFile) formData.append("store_banner", bannerFile);
      officeFiles.forEach((file, i) => { if (file) formData.append("office_images", file); });

      const response = await axios.put(`${API_BASE_URL}/stores/${myStore.id}/`, formData, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      if (response.status === 200) { alert("Duka limesasishwa!"); fetchDashboardData(); }
    } catch (err) { console.error("Update Error:", err); alert("Hitilafu: " + (err.response?.data?.detail || err.message)); } 
    finally { setIsUpdatingStore(false); }
  };

  const addToQueue = () => {
    if (!attributes.name || !attributes.price) return alert("Jaza jina na bei!");
    if (!coverFile) return alert("Weka picha kuu!");
    const newProductEntry = { ...attributes, cover_file: coverFile, video_file: videoFile, gallery: [...galleryFiles], cover_preview: coverPreview };
    setAddedProducts(prev => [...prev, newProductEntry]);
    resetProductForm();
    alert("Bidhaa imeongezwa kwenye list!");
  };

  const handleFinalPublishAll = async () => {
    if (addedProducts.length === 0) return alert("Hakuna bidhaa ya kurusha!");
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) { alert("Session imeisha. Tafadhali login tena."); setIsLoading(false); return; }
      let successCount = 0;
      let remainingProducts = [...addedProducts];
      for (const p of addedProducts) {
        try {
          const formData = new FormData();
          formData.append("name", p.name);
          formData.append("price", parseFloat(p.price));
          formData.append("original_price", parseFloat(p.compare_at_price) || 0);
          formData.append("category_id", p.category_id);
          if (p.brand_id) formData.append("brand_id", p.brand_id);
          formData.append("stock_quantity", parseInt(p.stock) || 0);
          formData.append("description", p.description || "");
          if (p.specifications) formData.append("specifications", JSON.stringify(p.specifications));
          if (p.cover_file) formData.append("cover_image", p.cover_file);
          if (p.video_file) formData.append("video_file", p.video_file);
          if (p.gallery && p.gallery.length > 0) p.gallery.forEach((file) => formData.append("gallery_images", file));

          const response = await axios.post(`${API_BASE_URL}/products/`, formData, {
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" }
          });
          if (response.status === 201) {
            successCount++;
            remainingProducts = remainingProducts.filter(item => item !== p);
            setAddedProducts([...remainingProducts]);
          }
        } catch (productError) { continue; }
      }
      if (successCount > 0) {
        alert(`✅ Bidhaa ${successCount} zimehifadhiwa kikamilifu!`);
        fetchDashboardData();
        if (remainingProducts.length === 0 && typeof setCurrentStep === 'function') setCurrentStep(1);
      }
      if (remainingProducts.length > 0) alert(`⚠️ Bidhaa ${remainingProducts.length} zimefeli kurushwa. Tafadhali jaribu tena.`);
    } catch (err) {
      console.error("Hitilafu Kubwa:", err);
      alert("Hitilafu Kubwa: " + (err.response?.data?.detail || err.message));
    } finally { setIsLoading(false); }
  };

  const handleCoverChange = (e) => { const file = e.target.files[0]; if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); } };
  const handleVideoChange = (e) => { const file = e.target.files[0]; if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); } };
  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setGalleryFiles([...galleryFiles, ...selectedFiles]);
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };
  const removeGalleryImage = (index) => {
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };
  const selectedCategoryName = myStoreSubCats?.find(cat => cat.id === attributes.category_id)?.name || "Chagua Kategoria";

  const handleAddCategoryToStore = async (cat) => {
    if (!myStore?.id) return alert("Duka halijapatikana!");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return alert("Token haipo!");
      const currentIds = myStore.sub_category_ids || [];
      if (currentIds.includes(cat.id)) { alert("Kategoria hii tayari ipo dukan kwako!"); return; }
      const updatedIds = [...currentIds, cat.id];
      await axios.patch(`${API_BASE_URL}/stores/${myStore.id}/`, { sub_category_ids: updatedIds }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchDashboardData();
      alert(`✅ ${cat.name} imeongezwa!`);
    } catch (err) { console.error(err); alert("Hitilafu: " + (err.response?.data?.detail || err.message)); }
  };

  const handleLogout = async () => {
    if (window.confirm("Je, una uhakika unataka kutoka (Logout)?")) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/dashboard/login', { replace: true });
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Duka Lako', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Bidhaa Zangu', icon: <Package size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <Box size={20} /> },
    { id: 'offers', label: 'Punguzo (Offers)', icon: <TrendingUp size={20} /> }, 
    { id: 'analytics', label: 'Takwimu', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Mipangilio ya Akaunti', icon: <Settings size={20} /> },
    { id: 'advertise', label: 'Matangazo', icon: <Megaphone size={20} /> },
    { id: 'logout', label: 'Toka (Logout)', icon: <LogOut size={20} /> },
  ];

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-brand">
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <div className="header-brand-inner">
            <span className="header-title">Skyfall</span>
            <span className="header-badge">Supplier</span>
          </div>
        </div>

        <div className="header-center">
          <span className="header-welcome">Karibu kwenye Skyfall.com</span>
        </div>

        <div className="header-actions">
          <button className="header-icon-btn" onClick={() => navigate('/dashboard/supplier-notifications')}>
            <Bell size={20} color="#4b5563" />
          </button>
          <button className="header-icon-btn" onClick={() => navigate('/dashboard/supplier-orders')}>
            <ClipboardList size={20} color="#4b5563" />
          </button>
          <button className="header-icon-btn" onClick={() => navigate('/dashboard/supplier-messages')}>
            <MessageSquare size={20} color="#4b5563" />
            {unreadMessages > 0 && (
              <span className="header-unread-badge">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </button>

          <div className="header-actions-wrap">
            <button className="header-avatar-btn" onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}>
              <span>{myStore?.store_name ? myStore.store_name.charAt(0).toUpperCase() : 'U'}</span>
            </button>

            <div className={`account-dropdown ${isAccountMenuOpen ? 'open' : ''}`}>
              <div className="account-dropdown-header">
                <p className="account-dropdown-name">{myStore?.store_name || "Jina la Duka"}</p>
                <p className="account-dropdown-email">{myStore?.email || "supplier@skyfall.com"}</p>
              </div>
              <div className="dropdown-section">
                <div className="account-dropdown-item" onClick={() => navigate('/dashboard/messages')}>
                  <MessageSquare size={16} /> Ujumbe
                  {unreadMessages > 0 && (
                    <span className="dropdown-unread-badge">
                      {unreadMessages}
                    </span>
                  )}
                </div>
              </div>
              <div className="dropdown-divider">
                <div className="account-dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} /> Toka (Logout)
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-main-wrapper">
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Supplier</h3>
          </div>
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li
                  key={item.id}
                  className={`sidebar-menu-item ${isActive ? 'active' : ''} ${item.id === 'logout' ? 'logout' : ''}`}
                  onClick={() => {
                    if (item.id === 'logout') {
                      handleLogout();
                    } else if (item.id === 'settings') {
                      navigate('/dashboard/supplier-settings');
                    } else {
                      setActiveTab(item.id);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="dashboard-content">
          <div className="dashboard-content-inner">
            
            <div className={`tab-content ${activeTab === 'overview' ? 'active' : ''}`}>
              <div className="store-header-wrapper">  
                <StoreHeader
                  myStore={myStore}
                  bannerPreview={bannerPreview}
                  setBannerFile={setBannerFile}
                  setBannerPreview={setBannerPreview}
                  logoPreview={logoPreview}
                  setLogoFile={setLogoFile}
                  setLogoPreview={setLogoPreview}
                />
              </div>
              <section className="analytics-section">
                <BusinessAnalytics products={myProducts} sellerId={myStore?.id} />
                <div className="store-mgmt-wrapper">
                  <StoreManagement
                    isManageMode={isManageMode}
                    setIsManageMode={setIsManageMode}
                    myStoreSubCats={myStoreSubCats}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    handleRemoveCategoryFromStore={handleRemoveCategoryFromStore}
                    setShowCategoryManager={setShowCategoryManager}
                    officePreviews={officePreviews}
                    setOfficeFiles={setOfficeFiles}
                    setOfficePreviews={setOfficePreviews}
                    officeInputRefs={officeInputRefs}
                    storeMeta={storeMeta}
                    setStoreMeta={setStoreMeta}
                    isUpdatingStore={isUpdatingStore}
                    handleUpdateStoreDetails={handleUpdateStoreDetails}
                    storeId={myStore?.id}
                  />
                </div>
                <div className="advertise-wrapper">
                  <div className="advertise-banner" onClick={() => navigate('/advertise')}>
                    <div>
                      <h3><Rocket size={20} /> ONGEZA MAUZO LEO!</h3>
                      <p>Weka bidhaa zako mbele ya maelfu ya wateja sasa.</p>
                    </div>
                    <button className="advertise-btn">TANGAA SASA 🚀</button>
                  </div>
                </div>
              </section>
            </div>

            <div className={`tab-content ${activeTab === 'products' ? 'active' : ''}`}>
              <div className="product-creation-wrapper">
                <h2 className="product-section-title">✨ Ongeza Bidhaa Mpya</h2>
                <ProductCreationFlow
                  storeId={myStore?.id} 
                  storeSubCategoryIds={myStore?.sub_category_ids || []} 
                  currentStep={currentStep} setCurrentStep={setCurrentStep}
                  myStoreSubCats={myStoreSubCats}
                  attributes={attributes} setAttributes={setAttributes}
                  selectedCategoryName={selectedCategoryName}
                  coverPreview={coverPreview} coverInputRef={coverInputRef} handleCoverChange={handleCoverChange}
                  videoPreview={videoPreview} videoInputRef={videoInputRef} handleVideoChange={handleVideoChange}
                  galleryPreviews={galleryPreviews} galleryInputRef={galleryInputRef} handleGalleryChange={handleGalleryChange} removeGalleryImage={removeGalleryImage}
                  addedProducts={addedProducts} setAddedProducts={setAddedProducts}
                  addToQueue={addToQueue} resetProductForm={resetProductForm} handleFinalPublishAll={handleFinalPublishAll}
                  isLoading={isLoading} editingProductId={editingProductId}
                />
              </div>
              <div className="existing-products-wrapper">
                <h3 className="existing-products-title">Bidhaa Zilizopo</h3>
                <div className="product-grid">
                  {myProducts.map((p) => (
                    <div key={p.id} className="product-card">
                      <div className="product-card-img-wrap">
                        {/* 🔥 FIX: Ongeza BACKEND_URL ili picha zionekane! */}
                        <img 
                          src={p.cover_image ? `${BACKEND_URL}/${p.cover_image}` : "https://via.placeholder.com/150"} 
                          alt={p.name} 
                          className="product-card-img" 
                        />
                      </div>
                      <div className="product-card-body">
                        <h4 className="product-card-title">{p.name}</h4>
                        <p className="product-card-price">TZS {Number(p.price).toLocaleString()}</p>
                      </div>
                      <button
                        className="product-card-edit-btn"
                        onClick={() => navigate(`/update/${p.id}`)}
                      >
                        <Edit3 size={14} /> Hariri
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'inventory' ? 'active' : ''}`}>
              <QuickInventoryManager products={myProducts} setProducts={setMyProducts} />
            </div>

            <div className={`tab-content ${activeTab === 'offers' ? 'active' : ''}`}>
              <div className="offers-container">
                <TopDealsSection products={myProducts} />
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'analytics' ? 'active' : ''}`}>
              <BusinessAnalytics products={myProducts} sellerId={myStore?.id} />
            </div>

            <div className={`tab-content ${activeTab === 'advertise' ? 'active' : ''}`}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '35px', border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <Megaphone size={48} className="advertise-icon" />
                <h2 className="advertise-title">Tangaza Bidhaa Zako</h2>
                <p className="advertise-text">Weka bidhaa zako mbele ya maelfu ya wateja.</p>
                <button className="advertise-cta-btn" onClick={() => navigate('/advertise')}>
                  Anza Kutangaza Sasa
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
                  {/* MODAL YA KATEGORIA */}
      {showCategoryManager && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowCategoryManager(false)} />
          <div className="modal-container modal-slide-up">
            <div className="modal-drag-handle" />
            <div className="modal-header">
              <div>
                <h3 className="modal-header-title">Soko la Kategoria</h3>
                <p className="modal-header-sub">Chagua sub-kategoria ya kuongeza</p>
              </div>
              <button onClick={() => setShowCategoryManager(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
                      <div className="modal-body">
              <div className="modal-cat-list">
                {allSubCategories
                  .filter(cat => {
                    // 🔥 FIX KUU: Sasa tunasoma 'cat.category', sio 'cat.category_id'!
                    const storeCatId = String((myStore?.category_id || myStore?.category) || "").replace(/-/g, '').trim();
                    const subCatId = String(cat.category || "").replace(/-/g, '').trim(); 
                    
                    if (!storeCatId) {
                      console.warn("⚠️ [DBG] Duka halina Category ID wala Category! Hakuna kategoria zitakazoonekana.");
                      return false;
                    }
                    return subCatId === storeCatId;
                  })
                  .map((cat) => {
                    const isAdded = (storeMeta.sub_category_ids || []).includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        disabled={isAdded}
                        onClick={() => handleAddCategoryToStore(cat)}
                        className="modal-cat-btn"
                      >
                        <span className="modal-cat-name">{cat.name}</span>
                        {isAdded ? (
                          <CheckCircle size={18} style={{ color: '#10b981' }} />
                        ) : (
                          <div className="modal-plus-icon"><Plus size={18} /></div>
                        )}
                      </button>
                    );
                  })}
                
                {/* 🔥 Hakikisha ujumbe wa tupu pia unatumia 'cat.category'! */}
                {allSubCategories.filter(cat => {
                   const storeCatId = String((myStore?.category_id || myStore?.category) || "").replace(/-/g, '').trim();
                   const subCatId = String(cat.category || "").replace(/-/g, '').trim();
                   return subCatId === storeCatId;
                }).length === 0 && (
                  <div className="modal-empty-state">
                    <p className="modal-empty-text">
                      {myStore?.category_id || myStore?.category 
                        ? "Hakuna sub-kategoria zinazofanana na duka hili." 
                        : "⚠️ Tatizo: Duka hili halina Category ID."}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCategoryManager(false)} className="modal-confirm-btn">
                NIMEKAMILISHA
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}