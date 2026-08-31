import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // 🔥 Tumia api
const BACKEND_URL = "https://shop-online-r9z4.onrender.com"; // 🔥 URL ya Render
//const BACKEND_URL = "http://127.0.0.1:8000"; // 🔥 Sio Render! 
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

 useEffect(() => {
  let timeoutId; // Kwenye hii tunahifadhi kitambulisho cha timeout
  const handleResize = () => {
    clearTimeout(timeoutId); // 1. Futa timeout iliyopita (usiruhusu kufanya kazi nyingi)
    timeoutId = setTimeout(() => {
      // 2. Kama skrini ni ndogo kuliko 768px (Mobile), funga sidebar
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        // 3. Kama skrini ni kubwa (Desktop), fungua sidebar
        setIsSidebarOpen(true);
      }
    }, 250); // Subiri skrini itulie kabla ya kufanya kitendo (250 milliseconds)
  };

  // 4. Sikiliza mabadiliko ya ukubwa wa dirisha
  window.addEventListener("resize", handleResize);

  // 5. Safisha (Cleanup) - ondoa listener na timeout wakati component inafutwa
  return () => {
    window.removeEventListener("resize", handleResize);
    clearTimeout(timeoutId);
  };
}, []); // 6. [] ina maana effect hii inafanya kazi mara moja tu (wakati page inafunguliwa)

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

    // 🔥 KAGUA MTANDAO NA REFETCH DATA KWA DASHBOARD HII (BILA KUREFRESH UKURASA)
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Mtandao umeunganishwa! Inapakia data za duka upya...");
      fetchDashboardData(); // ✅ Inaita fetchDashboardData mara moja mtandao ukirudi
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []); // 🔥 Inakimbia mara moja tu baada ya kupakia

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
          sub_category_ids: store.sub_category_ids || []
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
    if (!window.confirm("Je, una uhakika unataka kuondoa kategoria hii?")) return;
    if (!myStore?.id) return alert("Duka halijapatikana!");
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
      
      // ✅ 1. Tuma tu maelezo ya maandishi (Usitume category_id, sub_category_ids wala tin_number)
      const textFields = [
        'store_name', 'phone_number', 'whatsapp_number', 
        'instagram_handle', 'tiktok_handle', 'youtube_link', 
        'physical_address', 'working_hours', 'description', 'city'
      ];
      
      textFields.forEach(key => {
        if (storeMeta[key] !== undefined && storeMeta[key] !== null && storeMeta[key] !== '') {
          formData.append(key, String(storeMeta[key]));
        }
      });

      // ✅ 2. Ongeza picha (Logo, Banner) - kama zipo
      if (logoFile) formData.append("store_logo", logoFile);
      if (bannerFile) formData.append("store_banner", bannerFile);

      // ✅ 3. Ongeza picha za Ofisi - kama zipo
      if (officeFiles && Array.isArray(officeFiles)) {
        officeFiles.forEach((file) => {
          if (file && file instanceof File) {
            formData.append("office_images", file);
          }
        });
      }

      const response = await api.put(`/stores/${myStore.id}/`, formData, {
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        }
      });
      
      if (response.status === 200) { 
        alert("Duka limesasishwa kikamilifu!"); 
        fetchDashboardData(); 
      }
    } catch (err) { 
      console.error("❌ [Update Error] Hitilafu kamili:", err); 
      
      let errorMsg = "Hitilafu isiyojulikana imetokea.";
      
      // 4. Kagua kwa makini ikiwa Backend imerudisha error
      if (err.response) {
        console.log(`➡️ Status Code: ${err.response.status}`);
        console.log("📦 Jibu la Backend:", err.response.data);
        
        if (typeof err.response.data === 'object' && err.response.data !== null) {
          const errors = err.response.data;
          
          if (errors.detail) {
            errorMsg = errors.detail;
          } else {
            // Vunja makosa kwa kila uwanja (Hapa ndipo utajua ni field gani inakosea!)
            const fieldErrors = Object.entries(errors)
              .map(([field, messages]) => {
                const msg = Array.isArray(messages) ? messages.join(', ') : messages;
                return `✖️ ${field}: ${msg}`;
              })
              .join('\n');
              
            if (fieldErrors) {
              errorMsg = `Hitilafu za uwanja (Fields errors):\n${fieldErrors}`;
            } else {
              errorMsg = JSON.stringify(errors, null, 2);
            }
          }
        } else {
          errorMsg = err.response.data?.detail || err.message;
        }
        
      // 5. Ikiwa hakuna jibu (Tatizo la mtandao / Server haijibu)
      } else if (err.request) {
        errorMsg = "Hakuna jibu kutoka kwa server (Network Error). Angalia mtandao wako au ikiwa Backend ipo.";
        console.error("📡 Request iliyoshindwa:", err.request);
        
      // 6. Makosa mengine ya kawaida
      } else {
        errorMsg = err.message;
      }

      alert("❗ Hitilafu wakati wa kusasisha:\n\n" + errorMsg); 
    } finally { 
      setIsUpdatingStore(false); 
    }
  };

  const addToQueue = () => {
    if (!attributes.name || !attributes.price) return alert("Jaza jina na bei!");
    if (!coverFile) return alert("Weka picha kuu!");
    
    // 🔥 MUHIMU: Tuma gallery_files (sio gallery) kwenye newEntry
    const newProductEntry = { 
      ...attributes, 
      cover_file: coverFile, 
      video_file: videoFile, 
      gallery_files: [...galleryFiles], // ✅ SASA HII NDIO SAHIHI!
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
      if (!token) { 
        alert("Session imeisha. Tafadhali login tena."); 
        setIsLoading(false); 
        return; 
      }
      
      let successCount = 0;
      let remainingProducts = [...addedProducts];
      
      for (const p of addedProducts) {
        try {
          const formData = new FormData();
          
          // 🔥 Taarifa za msingi
          formData.append("name", p.name);
          formData.append("price", parseFloat(p.price));
          formData.append("original_price", parseFloat(p.compare_at_price) || 0);
          
          if (p.category_id) formData.append("category", p.category_id);
          
          if (p.brand_id) formData.append("brand_id", p.brand_id);
          formData.append("stock_quantity", parseInt(p.stock) || 0);
          formData.append("description", p.description || "");
          if (p.specifications) formData.append("specifications", JSON.stringify(p.specifications));
          
          console.log(`📸 [Debug] Inatuma cover_image kwa ${p.name}:`, p.cover_file ? "✅ Ipo" : "❌ Haipo");
          
          if (p.cover_file) {
            formData.append("cover_image", p.cover_file);
            console.log(`  ✅ cover_image imeambatishwa: ${p.cover_file.name}`);
          }
          
          if (p.video_file) {
            formData.append("video_file", p.video_file);
            console.log(`  ✅ video_file imeambatishwa: ${p.video_file.name}`);
          }
          
          // 🔥 MUHIMU: Tuma gallery_files (sio gallery)
          if (p.gallery_files && p.gallery_files.length > 0) {
            console.log(`  🖼️ Inatuma ${p.gallery_files.length} gallery images...`);
            p.gallery_files.forEach((file, index) => {
              formData.append("gallery_images", file);
              console.log(`    ✅ Gallery image ${index+1}: ${file.name}`);
            });
          } else {
            console.log("  ℹ️ Hakuna gallery images.");
          }

          const response = await api.post('/products/', formData, {
            headers: { 
              "Authorization": `Bearer ${token}`, 
              "Content-Type": "multipart/form-data" 
            }
          });
          
          if (response.status === 201) {
            console.log(`✅ ${p.name} imehifadhiwa kikamilifu!`);
            successCount++;
            remainingProducts = remainingProducts.filter(item => item !== p);
            setAddedProducts([...remainingProducts]);
          }
        } catch (productError) { 
          console.error("❌ Error creating product:", productError);
          continue; 
        }
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
    } finally { 
      setIsLoading(false); 
    }
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
      // 🔥 Tuma ombi kwa backend kufuta OTP status
      const token = localStorage.getItem("access_token");
      if (token) {
        await api.post('/supplier/logout/', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // 🔥 Futa token zote
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
    { id: 'settings', label: 'Account Settings', icon: <Settings size={20} /> },
    { id: 'advertise', label: 'Advertisements', icon: <Megaphone size={20} /> },
    { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
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
          <span className="header-welcome">Welcome to Skyfall.com</span>
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

           {/* ✅ ONGEZA HII CHINI YA ASIDE: Overlay ya giza kwa mobile */}
        {isSidebarOpen && window.innerWidth < 768 && (
          <div 
            className="sidebar-overlay" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

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
                  
                  // ✅ PREVIEWS NA UI (Zinabaki kama zilivyo kwa kuonyesha)
                  coverPreview={coverPreview} coverInputRef={coverInputRef} handleCoverChange={handleCoverChange}
                  videoPreview={videoPreview} videoInputRef={videoInputRef} handleVideoChange={handleVideoChange}
                  galleryPreviews={galleryPreviews} galleryInputRef={galleryInputRef} handleGalleryChange={handleGalleryChange} removeGalleryImage={removeGalleryImage}
                  
                  // 🔥 MPYA: HII NDIYO ITAKUSANYA FAILI HALISI ZA MEDIA KUTOKA FLOW
                  onMediaChange={(mediaFiles) => {
                    // mediaFiles ni object: { coverFile, videoFile, galleryFiles }
                    if (mediaFiles.coverFile) setCoverFile(mediaFiles.coverFile);
                    if (mediaFiles.videoFile) setVideoFile(mediaFiles.videoFile);
                    if (mediaFiles.galleryFiles && mediaFiles.galleryFiles.length > 0) {
                      setGalleryFiles(mediaFiles.galleryFiles);
                    }
                  }}

                  // ✅ HIZI ZINABAKI KWA AJILI YA QUEUE NA PUBLISH
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
                        <img 
    src={`${p.cover_image_url || (p.cover_image ? `${BACKEND_URL}/${p.cover_image}` : "https://via.placeholder.com/150")}?t=${new Date().getTime()}`} 
    alt={p.name} 
    className="product-card-img"
    onError={(e) => { 
        e.target.onerror = null; 
        e.target.src = "https://via.placeholder.com/150"; 
    }}
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