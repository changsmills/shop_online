// src/pages/PhysicalDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import QuickInventoryManager from '../components/QuickInventoryManager';
import BusinessAnalytics from '../components/BusinessAnalytics';
import TopDealsSection from "../components/TopDealsSection"
import StoreHeader from '../components/StoreHeader';
import StoreManagement from '../components/StoreManagement';
import ProductCreationFlow from '../components/ProductCreationFlow';
import {
  Edit3, Rocket, X, CheckCircle, Plus,
  LayoutDashboard, Package, Box, BarChart3, Store, Megaphone, Menu, Bell, 
  User, TrendingUp, LogOut, MessageSquare, Settings, ClipboardList
} from 'lucide-react';
import ReactDOM from 'react-dom';

const BACKEND_URL = "https://shop-online-r9z4.onrender.com";

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
    description: "", city: "", latitude: "", longitude: "",
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

  useEffect(() => {
    if (!myStore?.id) return;
    const fetchUnreadMessages = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const response = await api.get('/messages/', {
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

  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Mtandao umeunganishwa! Inapakia data za duka upya...");
      fetchDashboardData();
    };
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

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

      try { const bRes = await api.get('/brands/', { headers }); if (bRes.data) setBrands(bRes.data); } catch (brandErr) { setBrands([]); }

      const catRes = await api.get('/subcategories/', { headers });
      if (catRes.data) setAllSubCategories(catRes.data);

      let store = null;
      if (paramId) {
        try { const storeRes = await api.get(`/stores/${paramId}/`, { headers }); store = storeRes.data; } catch (err) {
          const profileRes = await api.get('/profile/', { headers });
          const ownerId = profileRes.data.id;
          const storesRes = await api.get(`/stores/?owner=${ownerId}`, { headers });
          const results = storesRes.data.results || storesRes.data;
          if (Array.isArray(results) && results.length > 0) store = results[0];
        }
      } else {
        const profileRes = await api.get('/profile/', { headers });
        const ownerId = profileRes.data.id;
        const storesRes = await api.get(`/stores/?owner=${ownerId}`, { headers });
        const results = storesRes.data.results || storesRes.data;
        if (Array.isArray(results) && results.length > 0) store = results[0];
      }

      if (store) {
        setMyStore(store);

        setLogoPreview(store.store_logo_url || null);
        setBannerPreview(store.store_banner_url || null);
        
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
          category_id: store.category_id || null,
          sub_category_ids: store.sub_category_ids || [],
          latitude: store.latitude || "",
          longitude: store.longitude || "",
        });

        setOfficePreviews([
          store.office_image_1_url || null,
          store.office_image_2_url || null,
          store.office_image_3_url || null,
        ]);

        if (store.sub_category_ids?.length > 0) {
          const subDataRes = await api.get('/subcategories/', {
            params: { id__in: store.sub_category_ids.join(',') }, headers
          });
          if (subDataRes.data) setMyStoreSubCats(subDataRes.data);
        }
        const prodsRes = await api.get('/products/', {
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
    if (!window.confirm("Are you sure you want to remove this category?")) return;
    if (!myStore?.id) return alert("Store not found!");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return alert("Token haipo!");
      const updatedIds = (myStore.sub_category_ids || []).filter(cid => cid !== catId);
      await api.patch(`/stores/${myStore.id}/`, { sub_category_ids: updatedIds }, { headers: { Authorization: `Bearer ${token}` } });
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
      
      const textFields = [
        'store_name', 'phone_number', 'whatsapp_number', 
        'instagram_handle', 'tiktok_handle', 'youtube_link', 
        'physical_address', 'working_hours', 'description', 'city',
        'latitude', 'longitude' 
      ];
      
      textFields.forEach(key => {
        if (storeMeta[key] !== undefined && storeMeta[key] !== null && storeMeta[key] !== '') {
          formData.append(key, String(storeMeta[key]));
        }
      });

      if (logoFile) formData.append("store_logo", logoFile);
      if (bannerFile) formData.append("store_banner", bannerFile);

      if (officeFiles && Array.isArray(officeFiles)) {
        officeFiles.forEach((file) => {
          if (file && file instanceof File) {
            formData.append("office_images", file);
          }
        });
      }

      const response = await api.put(`/stores/${myStore.id}/`, formData, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      
      if (response.status === 200) { alert("Duka limesasishwa kikamilifu!"); fetchDashboardData(); }
    } catch (err) { 
      console.error("❌ [Update Error] Hitilafu kamili:", err); 
      let errorMsg = "Hitilafu isiyojulikana imetokea.";
      if (err.response) {
        if (typeof err.response.data === 'object' && err.response.data !== null) {
          const errors = err.response.data;
          if (errors.detail) { errorMsg = errors.detail; } else {
            const fieldErrors = Object.entries(errors)
              .map(([field, messages]) => {
                const msg = Array.isArray(messages) ? messages.join(', ') : messages;
                return `✖️ ${field}: ${msg}`;
              }).join('\n');
            if (fieldErrors) { errorMsg = `Hitilafu za uwanja:\n${fieldErrors}`; } else { errorMsg = JSON.stringify(errors, null, 2); }
          }
        } else { errorMsg = err.response.data?.detail || err.message; }
      } else if (err.request) {
        errorMsg = "Hakuna jibu kutoka kwa server (Network Error).";
      } else { errorMsg = err.message; }
      alert("❗ Hitilafu wakati wa kusasisha:\n\n" + errorMsg); 
    } finally { setIsUpdatingStore(false); }
  };

  const addToQueue = () => {
    if (!attributes.name || !attributes.price) return alert("Jaza jina na bei!");
    if (!coverFile) return alert("Weka picha kuu!");
    const newProductEntry = { 
      ...attributes, 
      cover_file: coverFile, 
      video_file: videoFile, 
      gallery_files: [...galleryFiles],
      cover_preview: coverPreview 
    };
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
          if (p.category_id) formData.append("category", p.category_id);
          if (p.brand_id) formData.append("brand_id", p.brand_id);
          formData.append("stock_quantity", parseInt(p.stock) || 0);
          formData.append("description", p.description || "");
          if (p.specifications) formData.append("specifications", JSON.stringify(p.specifications));
          if (p.cover_file) formData.append("cover_image", p.cover_file);
          if (p.video_file) formData.append("video_file", p.video_file);
          if (p.gallery_files && p.gallery_files.length > 0) {
            p.gallery_files.forEach((file) => { formData.append("gallery_images", file); });
          }

          const response = await api.post('/products/', formData, {
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" }
          });
          
          if (response.status === 201) {
            successCount++;
            remainingProducts = remainingProducts.filter(item => item !== p);
            setAddedProducts([...remainingProducts]);
          }
        } catch (productError) { console.error("❌ Error creating product:", productError); continue; }
      }
      
      if (successCount > 0) {
        alert(`✅ Bidhaa ${successCount} zimehifadhiwa kikamilifu!`);
        fetchDashboardData();
        if (remainingProducts.length === 0 && typeof setCurrentStep === 'function') setCurrentStep(1);
      }
      if (remainingProducts.length > 0) {
        alert(`⚠️ Bidhaa ${remainingProducts.length} zimefeli kurushwa. Tafadhali jaribu tena.`);
      }
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
      await api.patch(`/stores/${myStore.id}/`, { sub_category_ids: updatedIds }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchDashboardData();
      alert(`✅ ${cat.name} imeongezwa!`);
    } catch (err) { console.error(err); alert("Hitilafu: " + (err.response?.data?.detail || err.message)); }
  };

  const handleLogout = async () => {
    if (window.confirm("Je, una uhakika unataka kutoka (Logout)?")) {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          await api.post('/supplier/logout/', {}, { headers: { Authorization: `Bearer ${token}` } });
        }
      } catch (err) { console.error("Logout error:", err); } 
      finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/dashboard/login', { replace: true });
      }
    }
  };

  const menuItems = [
    { id: 'overview', label: 'My Store', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'My Products', icon: <Package size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <Box size={20} /> },
    { id: 'offers', label: 'Offers', icon: <TrendingUp size={20} /> }, 
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'advertise', label: 'Advertise', icon: <Megaphone size={20} /> },
    { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-[64px] md:h-[70px] bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-3 md:px-6 z-[99999]">
        <div className="flex items-center gap-3">
          <button 
  className="flex md:hidden items-center justify-center w-10 h-10 bg-transparent border-none text-gray-800 dark:text-white cursor-pointer relative z-[100060]" 
  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
>
  <Menu size={24} />
</button>
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-2xl font-black text-brand-orange tracking-tight">Skyfall</span>
            <span className="bg-brand-orange text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full uppercase">Supplier</span>
          </div>
        </div>

        <div className="hidden md:block flex-1 text-center">
          <span className="text-sm text-gray-500 font-medium">Welcome to Skyfall.co.tz</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => navigate('/dashboard/supplier-notifications')}>
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => navigate('/dashboard/supplier-orders')}>
            <ClipboardList size={20} />
          </button>
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => navigate('/dashboard/supplier-messages')}>
            <MessageSquare size={20} />
            {unreadMessages > 0 && (
              <span className="absolute top-1 right-1 bg-brand-orange text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </button>

          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-brand-orange text-white font-bold text-base flex items-center justify-center border-none cursor-pointer" onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}>
              <span>{myStore?.store_name ? myStore.store_name.charAt(0).toUpperCase() : 'U'}</span>
            </button>

            <div className={`absolute top-12 right-0 w-[240px] bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl py-2 z-[1001] transition-all duration-200 ${isAccountMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold text-gray-900 dark:text-white m-0">{myStore?.store_name || "Store Name"}</p>
                <p className="text-xs text-gray-500 m-0">{myStore?.email || "supplier@skyfall.com"}</p>
              </div>
              <div className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => navigate('/dashboard/messages')}>
                <MessageSquare size={16} /> Messages
                {unreadMessages > 0 && (
                  <span className="ml-auto bg-brand-orange text-white text-[11px] px-1.5 py-0.5 rounded-full">{unreadMessages}</span>
                )}
              </div>
              <div className="px-4 py-2.5 text-sm text-red-500 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN WRAPPER */}
      <div className="flex flex-1 mt-[64px] md:mt-[70px] min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-70px)]">

{ReactDOM.createPortal(
  <>
    {/* Overlay - z-50 */}
    <div 
      className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={() => setIsSidebarOpen(false)}
    />

    {/* Sidebar - z-[60], w-[300px], na whitespace-nowrap */}
    <aside 
      className={`fixed top-0 left-0 bottom-0 w-[300px] md:w-[260px] bg-white dark:bg-[#0a0a0a] 
        border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-transform duration-300 ease-in-out shadow-2xl z-[60] ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="px-6 py-4 mb-2 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-brand-orange m-0">Supplier</h3>
        <button 
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>
      <ul className="list-none p-0 m-0">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li
              key={item.id}
              // Nimeongeza whitespace-nowrap hapa
              className={`flex items-center gap-3 px-6 py-3 text-[15px] font-medium 
                cursor-pointer transition-all border-l-[3px]
                 whitespace-nowrap ${isActive ? 'bg-orange-50/50 dark:bg-orange-950/20 text-brand-orange border-l-brand-orange font-bold' : 'text-gray-700 dark:text-gray-300 border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-900'} ${item.id === 'logout' ? 'text-red-500 mt-4 border-t border-gray-200 dark:border-gray-800 pt-4' : ''}`}
              onClick={() => {
                if (item.id === 'logout') { handleLogout(); } 
                else if (item.id === 'settings') { navigate('/dashboard/supplier-settings'); } 
                else {
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
  </>,
  document.body
)}


        {/* MAIN CONTENT */}
 <main className="flex-1 ml-0 md:ml-[260px] p-3 md:p-6 bg-gray-50 dark:bg-black min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-70px)]">
                <div className="max-w-[1400px] mx-auto w-full pb-[80px]">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="block animate-[fadeIn_0.2s_ease]">
                <div className="mb-6 rounded-2xl overflow-hidden bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800">
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

                <section className="flex flex-col gap-5">
                  <BusinessAnalytics products={myProducts} sellerId={myStore?.id} />
                  
                  <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
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

                  <div className="mt-2">
                    <div className="bg-gradient-to-br from-brand-orange to-[#ff8c33] rounded-2xl p-7 text-white cursor-pointer transition-transform hover:-translate-y-0.5" onClick={() => navigate('/advertise')}>
                      <div>
                        <h3 className="flex items-center gap-2.5 text-xl font-extrabold m-0 mb-2 text-white"><Rocket size={20} /> INCREASE YOUR SALES TODAY!</h3>
                        <p className="text-sm m-0 mb-4 opacity-95">Put your products in front of thousands of customers now.</p>
                        <button className="bg-white text-brand-orange border-none px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-gray-100 transition-colors">ADVERTISE NOW 🚀</button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="block animate-[fadeIn_0.2s_ease]">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold mb-4 text-gray-900 dark:text-white">✨ Add New Product</h2>
                  <ProductCreationFlow
                    storeId={myStore?.id}
                    storeSubCategoryIds={myStore?.sub_category_ids || []}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    myStoreSubCats={myStoreSubCats}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    selectedCategoryName={selectedCategoryName}
                    coverPreview={coverPreview}
                    coverInputRef={coverInputRef}
                    handleCoverChange={handleCoverChange}
                    videoPreview={videoPreview}
                    videoInputRef={videoInputRef}
                    handleVideoChange={handleVideoChange}
                    galleryPreviews={galleryPreviews}
                    galleryInputRef={galleryInputRef}
                    handleGalleryChange={handleGalleryChange}
                    removeGalleryImage={removeGalleryImage}
                    onMediaChange={(mediaFiles) => {
                      if (mediaFiles.coverFile) setCoverFile(mediaFiles.coverFile);
                      if (mediaFiles.videoFile) setVideoFile(mediaFiles.videoFile);
                      if (mediaFiles.galleryFiles && mediaFiles.galleryFiles.length > 0) {
                        setGalleryFiles(mediaFiles.galleryFiles);
                      }
                    }}
                    addedProducts={addedProducts}
                    setAddedProducts={setAddedProducts}
                    addToQueue={addToQueue}
                    resetProductForm={resetProductForm}
                    handleFinalPublishAll={handleFinalPublishAll}
                    isLoading={isLoading}
                    editingProductId={editingProductId}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Existing Products</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 w-full">
                    {myProducts.map((p) => (
                      <div key={p.id} className="bg-white dark:bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col relative">
                        <div className="w-full h-[140px] md:h-[180px] bg-gray-100 dark:bg-gray-900 overflow-hidden relative shrink-0">
                          <img
                            src={`${p.cover_image_url || (p.cover_image ? `${BACKEND_URL}/${p.cover_image}` : "https://via.placeholder.com/150")}?t=${new Date().getTime()}`}
                            alt={p.name}
                            className="w-full h-full object-cover block"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
                          />
                        </div>
                        <div className="p-3 flex-grow flex flex-col justify-between">
                          <h4 className="text-xs md:text-[13px] font-semibold text-gray-900 dark:text-white m-0 mb-1 truncate">{p.name}</h4>
                          <p className="font-bold text-sm text-brand-orange m-0">TZS {Number(p.price).toLocaleString()}</p>
                        </div>
                        <button
                          className="absolute top-2 right-2 bg-blue-600/95 text-white px-2 py-1.5 rounded-md text-[10px] font-semibold border border-white/20 cursor-pointer flex items-center gap-1 z-10 backdrop-blur-sm transition-opacity duration-200 md:opacity-0 group-hover:opacity-100 opacity-100 md:top-2.5 md:right-2.5"
                          onClick={() => navigate(`/update/${p.id}`)}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <div className="block animate-[fadeIn_0.2s_ease]">
                <QuickInventoryManager products={myProducts} setProducts={setMyProducts} />
              </div>
            )}

            {/* OFFERS TAB */}
            {activeTab === 'offers' && (
              <div className="block animate-[fadeIn_0.2s_ease]">
                <div className="p-0">
                  <TopDealsSection products={myProducts} />
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="block animate-[fadeIn_0.2s_ease]">
                <BusinessAnalytics products={myProducts} sellerId={myStore?.id} />
              </div>
            )}

            {/* ADVERTISE TAB */}
            {activeTab === 'advertise' && (
              <div className="block animate-[fadeIn_0.2s_ease]">
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <Megaphone size={48} className="text-brand-orange mb-4" />
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Advertise Your Products</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Put your products in front of thousands of customers.</p>
                  <button className="bg-brand-orange text-white px-8 py-3 rounded-full font-bold hover:bg-brand-hover transition-colors" onClick={() => navigate('/advertise')}>
                    Start Advertising Now
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* CATEGORY MODAL */}
      {showCategoryManager && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCategoryManager(false)} />
          <div className="relative w-full max-w-[500px] max-h-[85vh] sm:max-h-[80vh] bg-white dark:bg-[#111111] rounded-t-[20px] sm:rounded-[20px] flex flex-col overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out] z-10">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-2.5 shrink-0" />
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div>
                <h3 className="text-[17px] font-bold text-gray-900 dark:text-white m-0">Category Market</h3>
                <p className="text-xs text-gray-500 m-0 mt-0.5">Choose a sub-category to add</p>
              </div>
              <button onClick={() => setShowCategoryManager(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-none cursor-pointer flex items-center justify-center shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-2.5">
                {allSubCategories
                  .filter(cat => {
                    const storeCatId = String((myStore?.category_id || myStore?.category) || "").replace(/-/g, '').trim();
                    const subCatId = String(cat.category || "").replace(/-/g, '').trim();
                    if (!storeCatId) return false;
                    return subCatId === storeCatId;
                  })
                  .map((cat) => {
                    const isAdded = (storeMeta.sub_category_ids || []).includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        disabled={isAdded}
                        onClick={() => handleAddCategoryToStore(cat)}
                        className={`flex items-center justify-between w-full p-4 text-sm font-medium rounded-xl border transition-all ${isAdded ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 cursor-not-allowed opacity-90' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-brand-orange cursor-pointer text-gray-900 dark:text-gray-200'}`}
                      >
                        <span className="flex-1 text-left leading-snug break-words">{cat.name}</span>
                        {isAdded ? (
                          <CheckCircle size={18} className="text-green-500 shrink-0 ml-2" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-orange-950/30 text-brand-orange flex items-center justify-center shrink-0 ml-2"><Plus size={18} /></div>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <button onClick={() => setShowCategoryManager(false)} className="w-full py-3.5 bg-brand-orange text-white border-none rounded-xl text-sm font-bold tracking-wide cursor-pointer hover:bg-brand-hover transition-colors">
                DONE
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* KEYFRAMES */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

    </div>
  );
}