// PhysicalDashboard.js (Full Inline Styles – No External CSS)
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
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

export default function PhysicalDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isManageMode, setIsManageMode] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);
  const [search, setSearch] = useState("");

  // --- Sidebar states ---
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // --- DATA STATES ---
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [myStore, setMyStore] = useState(null);
  const [myStoreSubCats, setMyStoreSubCats] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    // --- HEADER STATES (MPYA) ---
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // --- FORM STATES ---
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

  // --- MEDIA PREVIEWS & FILES ---
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

  // --- Hover States for Inline Pseudo-classes ---
  const [hoveredSidebarItem, setHoveredSidebarItem] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [hoveredSubCatId, setHoveredSubCatId] = useState(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (id) fetchDashboardData();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    // 🔥 HESABU UJUMBE AMBAO HAJASOMWA (Kutoka kwa wateja)
  useEffect(() => {
    if (!id) return;

    const fetchUnreadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', id)  // Ni ujumbe uliotumiwa kwa supplier huyu
        .eq('is_read', false);   // Ambao bado hajasomwa

      if (!error && data) {
        setUnreadMessages(data.length);
      }
    };

    fetchUnreadMessages();

    // Sikiliza mabadiliko ya wakati halisi (Realtime)
    const channel = supabase
      .channel('supplier_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${id}` },
        (payload) => {
          // Kama ujumbe mpya umefika kwa supplier huyu, ongeza idadi
          setUnreadMessages(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // --- RESET FORM ---
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

  // --- FETCH DATA ---
  const fetchDashboardData = async () => {
    try {
      const { data: bData } = await supabase.from("brands").select("*");
      if (bData) setBrands(bData);

      const { data: allCats } = await supabase.from("sub_categories").select("*");
      if (allCats) setAllSubCategories(allCats);

      const { data: store } = await supabase.from("stores_engine").select("*").eq("id", id).single();

      if (store) {
        setMyStore(store);
        setLogoPreview(store.store_logo);
        setBannerPreview(store.store_banner);
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
        });

        const imgs = store.office_images || [];
        setOfficePreviews([imgs[0] || null, imgs[1] || null, imgs[2] || null]);

        if (store.sub_category_ids?.length > 0) {
          const { data: subData } = await supabase.from("sub_categories").select("*").in("id", store.sub_category_ids);
          if (subData) setMyStoreSubCats(subData);
        }

        const { data: prods } = await supabase.from("products_engines").select("*, product_media(*)").eq("store_id", id).order("created_at", { ascending: false });
        if (prods) setMyProducts(prods);
      }
    } catch (err) { console.error("Fetch Error:", err); }
  };

  // --- UPLOAD FILE ---
  const uploadFile = async (file, folderPath, bucket = "picha_za_duka") => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  // --- CORE FUNCTIONS ---
  const handleRemoveCategoryFromStore = async (catId) => {
    if (!window.confirm("Je, una uhakika unataka kuondoa kategoria hii?")) return;
    try {
      const updatedIds = (myStore.sub_category_ids || []).filter(cid => cid !== catId);
      const { error } = await supabase.from("stores_engine").update({ sub_category_ids: updatedIds }).eq("id", id);
      if (error) throw error;
      fetchDashboardData();
    } catch (err) { alert("Imeshindikana: " + err.message); }
  };

  const handleUpdateStoreDetails = async () => {
    setIsUpdatingStore(true);
    try {
      let finalLogo = logoPreview;
      let finalBanner = bannerPreview;
      let finalOfficeUrls = [...officePreviews];

      if (logoFile) finalLogo = await uploadFile(logoFile, id);
      if (bannerFile) finalBanner = await uploadFile(bannerFile, id);
      for (let i = 0; i < officeFiles.length; i++) {
        if (officeFiles[i]) finalOfficeUrls[i] = await uploadFile(officeFiles[i], id);
      }

      const { error } = await supabase.from("stores_engine").update({
        ...storeMeta,
        store_logo: finalLogo,
        store_banner: finalBanner,
        office_images: finalOfficeUrls,
      }).eq("id", id);

      if (error) throw error;
      alert("Duka limesasishwa!");
      fetchDashboardData();
    } catch (err) { alert("Hitilafu: " + err.message); }
    finally { setIsUpdatingStore(false); }
  };

  const addToQueue = () => {
    if (!attributes.name || !attributes.price) return alert("Jaza jina na bei!");
    if (!coverFile) return alert("Weka picha kuu!");

    const newProductEntry = {
      ...attributes,
      cover_file: coverFile,
      video_file: videoFile,
      gallery: [...galleryFiles],
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
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) throw new Error("Session imeisha. Tafadhali login tena.");

      const { data: stData } = await supabase.from('stores_engine')
        .select('category_id')
        .eq('id', id)
        .single();
      const storeParentCategoryId = stData?.category_id;

      let successCount = 0;
      let remainingProducts = [...addedProducts];

      for (const p of addedProducts) {
        try {
          const productPath = `${p.category_id}/${id}`;

          // Upload Picha Kuu
          let finalCoverUrl = await uploadFile(p.cover_file, productPath, "product-images");

          // Upload Gallery
          const finalGalleryUrls = [];
          if (p.gallery && p.gallery.length > 0) {
            for (const item of p.gallery) {
              const url = await uploadFile(item, productPath, "product-images");
              if (url) finalGalleryUrls.push(url);
            }
          }

          // Upload Video
          let finalVideoUrl = p.video_file ? await uploadFile(p.video_file, productPath, "product-videos") : null;

          // Insert kwenye products_engines
          const { data: engineData, error: engineError } = await supabase.from('products_engines').insert([{
            user_id: user.id,
            store_id: id,
            name: p.name,
            sku: `${p.name.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
            price: parseFloat(p.price),
            original_price: parseFloat(p.compare_at_price) || 0,
            cover_image: finalCoverUrl || (finalGalleryUrls.length > 0 ? finalGalleryUrls[0] : null),
            category_id: p.category_id,
            parent_category_id: storeParentCategoryId,
            brand_id: p.brand_id || null,
            stock_quantity: parseInt(p.stock) || 0,
            description: p.description,
            specifications: p.specifications,
            is_approved: false
          }]).select('id').single();

          if (engineError) throw engineError;

          // Insert Media
          const mediaPayload = [];
          if (finalVideoUrl) {
            mediaPayload.push({ product_id: engineData.id, media_type: 'video', media_url: finalVideoUrl, display_order: 0 });
          }
          finalGalleryUrls.forEach((url, i) => {
            mediaPayload.push({ product_id: engineData.id, media_type: 'image', media_url: url, display_order: i + 1 });
          });

          if (mediaPayload.length > 0) {
            await supabase.from('product_media').insert(mediaPayload);
          }

          successCount++;
          remainingProducts = remainingProducts.filter(item => item.id !== p.id);
          setAddedProducts([...remainingProducts]);

        } catch (productError) {
          console.error(`Error kwenye bidhaa ${p.name}:`, productError.message);
          continue;
        }
      }

      if (successCount > 0) {
        alert(`✅ Bidhaa ${successCount} zimehifadhiwa kikamilifu!`);
        fetchDashboardData();
        if (remainingProducts.length === 0) {
          if (typeof setCurrentStep === 'function') setCurrentStep(1);
        }
      }

      if (remainingProducts.length > 0) {
        alert(`⚠️ Bidhaa ${remainingProducts.length} zimefeli kurushwa. Tafadhali jaribu tena.`);
      }

    } catch (err) {
      alert("Hitilafu Kubwa: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Handlers ---
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); }
  };

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
    try {
      const currentIds = myStore.sub_category_ids || [];
      if (currentIds.includes(cat.id)) {
        alert("Kategoria hii tayari ipo dukan kwako!");
        return;
      }
      const updatedIds = [...currentIds, cat.id];
      const { error } = await supabase.from("stores_engine").update({ sub_category_ids: updatedIds }).eq("id", id);
      if (error) throw error;
      await fetchDashboardData();
      alert(`✅ ${cat.name} imeongezwa!`);
    } catch (err) {
      alert("Hitilafu: " + err.message);
    }
  };


    const handleLogout = async () => {
    if (window.confirm("Je, una uhakika unataka kutoka (Logout)?")) {
      await supabase.auth.signOut();
      navigate('/dashboard/login', { replace: true });
    }
  };

  // --- SIDEBAR MENU ---
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

  // ------------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

             {/* HEADER MPYA YA SUPPLIER (ILIYOBORESHA) */}
      <header style={{
        height: '70px',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            style={{ display: isMobile ? 'flex' : 'none', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 900, color: '#f97316', fontSize: '20px', letterSpacing: '-0.5px' }}>Skyfall</span>
            <span style={{ background: '#f97316', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', marginLeft: '8px' }}>Supplier</span>
          </div>
        </div>

        {/* UJUMBE WA KARIBU KATIKATI (Desktop tu) */}
        <div style={{
          flex: 1,
          display: isMobile ? 'none' : 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#6b7280',
            letterSpacing: '0.5px'
          }}>
            Karibu kwenye Skyfall.com
          </span>
        </div>

        {/* SEHEMU YA KULIA (ICONS) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          
          {/* 🔥 1. ARIFA (NOTIFICATIONS) */}
          <div 
            style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s ease' }}
            onClick={() => navigate('/dashboard/supplier-notifications')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Bell size={20} color="#4b5563" />
          </div>

          {/* 🔥 2. ODA ZA WATEJA (SUPPLIER ORDERS) - ICON MPYA IMEONGEWA HAPA! */}
          <div 
            style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s ease' }}
            onClick={() => navigate('/dashboard/supplier-orders')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ClipboardList size={20} color="#4b5563" />
          </div>

          {/* 🔥 3. UJUMBE (MESSAGES) */}
          <div 
            style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s ease' }}
            onClick={() => navigate('/dashboard/supplier-messages')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <MessageSquare size={20} color="#4b5563" />
            
            {/* Badge ya idadi ya ujumbe mpya (kwenye chat) */}
            {unreadMessages > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </div>

          {/* 🔥 4. IKON YA USER / ACCOUNT (Dropdown) */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                {myStore?.store_name ? myStore.store_name.charAt(0).toUpperCase() : 'U'}
              </span>
            </button>

            {/* MENU YA ACCOUNT */}
            {isAccountMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '55px',
                right: '0',
                width: '240px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 35px rgba(0,0,0,0.15)',
                border: '1px solid #f3f4f6',
                padding: '12px 0',
                zIndex: 200,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '12px 16px 16px 16px', borderBottom: '1px solid #f3f4f6' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '14px', margin: 0, color: '#1f2937' }}>
                    {myStore?.store_name || "Jina la Duka"}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
                    {myStore?.email || "supplier@skyfall.com"}
                  </p>
                </div>
                
                <div style={{ padding: '8px 0' }}>
                  <div 
                    onClick={() => navigate('/dashboard/messages')}
                    style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#374151', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MessageSquare size={16} /> Ujumbe
                    {unreadMessages > 0 && (
                      <span style={{ marginLeft: 'auto', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '10px' }}>
                        {unreadMessages}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', padding: '8px 0' }}>
                  <div 
                    onClick={handleLogout}
                    style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontSize: '14px', fontWeight: '500' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} /> Toka (Logout)
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* CONTAINER KUU */}
      <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 70px)' }}>
        
               {/* SIDEBAR */}
        <aside style={{
          width: isMobile ? '280px' : '260px',
          background: 'white',
          borderRight: '1px solid #f3f4f6',
          height: '100%',
          overflowY: 'auto',
          transition: 'all 0.3s ease',
          flexShrink: 0,
          padding: '20px 0',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          ...(isMobile && {
            position: 'fixed',
            left: 0,
            top:'70px',
            height: 'calc(100vh - 70px)',
            width: '280px',
            zIndex: 9997,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
          })
        }}>
          <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ fontWeight: 900, color: '#f97316' }}>Supplier</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: '10px 10px', margin: 0 }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              const isHovered = hoveredSidebarItem === item.id;
              return (
                <li
                  key={item.id}
                  onClick={() => {
  // 🔥 MABADILIKO: Ikiwa ni Logout, toa nje
  if (item.id === 'logout') {
    handleLogout();
  } 
  // 🔥 MABADILIKO: Ikiwa ni Settings, elekeza kwenye ukurasa wa Mipangilio ya Muuzaji
  else if (item.id === 'settings') {
    navigate('/dashboard/supplier-settings');
  } 
  // Vinginevyo, badilisha Tab pekee
  else {
    setActiveTab(item.id);
    if (isMobile) setIsSidebarOpen(false);
  }
}}
                  onMouseEnter={() => setHoveredSidebarItem(item.id)}
                  onMouseLeave={() => setHoveredSidebarItem(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    // 🔥 MABADILIKO HAPA: Logout iwe na rangi nyekundu (kwa usalama) au iwe kama zingine
                    color: item.id === 'logout' ? '#ef4444' : (isActive ? '#ea580c' : (isHovered ? '#374151' : '#6b7280')),
                    fontWeight: 600,
                    fontSize: '14px',
                    marginBottom: '4px',
                    // 🔥 MABADILIKO HAPA: Logout ikiguswa iwe na background nyekundu hafifu
                    backgroundColor: item.id === 'logout' && isHovered ? '#fef2f2' : (isActive ? '#fff7ed' : (isHovered ? '#f9fafb' : 'transparent')),
                    border: isActive ? '1px solid #ffedd5' : 'none'
                  }}
                >
                  {item.icon}
                  <span style={{ marginLeft: '12px' }}>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb', overflowY: 'auto', marginTop: 0 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }}>
            
            {/* --- TAB 1: OVERVIEW (Sasa ni Nadhifu) --- */}
{/* --- TAB 1: OVERVIEW --- */}
<div style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
  
  {/* Container inayoshikilia StoreHeader na Logo zake */}
  <div style={{ 
    position: 'relative', 
    zIndex: 9998,
    // 🔥 HAPA NDIYO SULUHISHO: Tunahamisha marginBottom hapa
    marginBottom: isMobile ? '45px' : '60px'
  }}>  
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

  {/* 🔥 Logo inaweza kuwekwa hapa kwa kutumia position absolute, au ndani ya StoreHeader ikiwa imebaki */}
  {/* ... logo yako ikiwa haiko ndani ya StoreHeader ... */}

  <section style={{ marginBottom: '16px', marginTop: '16px' }}>
    <BusinessAnalytics products={myProducts} sellerId={myStore?.id} />
    <div
      onClick={() => navigate('/advertise')}
      style={{
        background: 'linear-gradient(135deg, #ff4e00 0%, #ec2f4b 100%)',
        borderRadius: '20px',
        padding: '20px',
        color: 'white',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Rocket size={20} />
          <b>ONGEZA MAUZO LEO!</b>
        </div>
        <p style={{ fontSize: '12px', opacity: 0.9, margin: '4px 0 0 0' }}>Weka bidhaa zako mbele ya maelfu ya wateja sasa.</p>
      </div>
      <button style={{ backgroundColor: 'white', color: '#ff4e00', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', border: 'none' }}>TANGAA SASA 🚀</button>
    </div>
  </section>
</div>

            {/* --- TAB 2: PRODUCTS --- */}
            <div style={{ display: activeTab === 'products' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: 'white', padding: isMobile ? '16px' : '24px', borderRadius: '35px', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
                <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 900, color: '#1f2937', margin: '0 0 24px 0' }}>✨ Ongeza Bidhaa Mpya</h2>
                <ProductCreationFlow
                  storeId={id}
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
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>Bidhaa Zilizopo</h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(180px, 1fr))', gap: isMobile ? '10px' : '16px' }}>
                  {myProducts.map((p) => {
                    const isHovered = hoveredProductId === p.id;
                    return (
                      <div
                        key={p.id}
                        onMouseEnter={() => setHoveredProductId(p.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: isHovered ? '0 8px 15px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease-in-out',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                          border: isHovered ? '1px solid #bfdbfe' : '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{ width: '100%', height: isMobile ? '120px' : '160px', background: '#f1f5f9' }}>
                          <img src={p.cover_image || "https://via.placeholder.com/150"} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '10px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                          <p style={{ fontWeight: 700, fontSize: '14px', color: '#2563eb', margin: 0 }}>TZS {Number(p.price).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/update/${p.id}`)}
                          style={{
                            position: 'absolute',
                            top: isMobile ? '5px' : '10px',
                            right: isMobile ? '5px' : '10px',
                            background: 'rgba(37, 99, 235, 0.95)',
                            color: 'white',
                            padding: isMobile ? '5px 8px' : '6px 10px',
                            borderRadius: '6px',
                            fontSize: isMobile ? '10px' : '11px',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            zIndex: 10,
                            opacity: isMobile ? 1 : (isHovered ? 1 : 0),
                            transition: 'all 0.2s ease',
                            backdropFilter: 'blur(2px)'
                          }}
                        >
                          <Edit3 size={14} /> Hariri
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* --- TAB 3: INVENTORY (Sasa ni Inventory pekee) --- */}
           <div style={{ display: activeTab === 'inventory' ? 'block' : 'none' }}>
              <QuickInventoryManager products={myProducts} setProducts={setMyProducts} />
           </div>

            {/* --- TAB 4: OFFERS (MPYA) --- */}
        <div style={{ display: activeTab === 'offers' ? 'block' : 'none' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '35px', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <TopDealsSection products={myProducts} />
          </div>
        </div>

            {/* --- TAB 4: ANALYTICS --- */}
            <div style={{ display: activeTab === 'analytics' ? 'block' : 'none' }}>
              <BusinessAnalytics products={myProducts} sellerId={myStore?.id} />
            </div>

            {/* --- TAB 5: STORE SETTINGS --- */}
            <div style={{ display: activeTab === 'store-settings' ? 'block' : 'none' }}>
              <StoreManagement
                isManageMode={isManageMode}
                isMobile={isMobile}
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
              />
            </div>

            {/* --- TAB 6: ADVERTISE --- */}
            <div style={{ display: activeTab === 'advertise' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '35px', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <Megaphone size={48} style={{ margin: '0 auto 16px auto', color: '#f97316' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Tangaza Bidhaa Zako</h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>Weka bidhaa zako mbele ya maelfu ya wateja.</p>
                <button
                  onClick={() => navigate('/advertise')}
                  style={{ background: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Anza Kutangaza Sasa
                </button>
              </div>
            </div>

          </div>
          
        </main>
      </div>

      {/* --- MODAL YA KATEGORIA --- */}
      {showCategoryManager && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowCategoryManager(false)} />
          <div className="animate-in slide-in-from-bottom duration-300" style={{
            position: 'relative',
            backgroundColor: 'white',
            width: '100%',
            maxWidth: '500px',
            borderRadius: isMobile ? '30px 30px 0 0' : '35px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: isMobile ? '92vh' : '85vh',
            boxShadow: '0 -10px 25px rgba(0,0,0,0.2)'
          }}>
            {isMobile && (
              <div style={{ width: '40px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', margin: '12px auto 0' }} />
            )}
            <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontWeight: 900, color: '#1f2937', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.5px', margin: 0, fontSize: '16px' }}>Soko la Kategoria</h3>
                <p style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Chagua sub-kategoria ya kuongeza</p>
              </div>
              <button onClick={() => setShowCategoryManager(false)} style={{ width: '32px', height: '32px', background: '#f9fafb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allSubCategories
                  .filter(cat => String(cat.category_id || "").trim() === String(myStore?.category_id || "").trim())
                  .map((cat) => {
                    const isAdded = myStoreSubCats.some(s => s.id === cat.id);
                    return (
                      <button
                        key={cat.id}
                        disabled={isAdded}
                        onClick={() => handleAddCategoryToStore(cat)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '15px 20px',
                          borderRadius: '18px',
                          border: '1.5px solid',
                          width: '100%',
                          backgroundColor: isAdded ? '#f9fafb' : 'white',
                          borderColor: isAdded ? '#f3f4f6' : '#f3f4f6',
                          cursor: isAdded ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '13px', color: isAdded ? '#9ca3af' : '#374151' }}>
                          {cat.name}
                        </span>
                        {isAdded ? (
                          <CheckCircle size={18} style={{ color: '#10b981' }} />
                        ) : (
                          <div style={{ color: '#f97316' }}><Plus size={18} /></div>
                        )}
                      </button>
                    );
                  })}
                {allSubCategories.filter(cat => String(cat.category_id || "").trim() === String(myStore?.category_id || "").trim()).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>Hakuna kategoria hapa.</p>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #f9fafb', flexShrink: 0, paddingBottom: isMobile ? '30px' : '20px' }}>
              <button onClick={() => setShowCategoryManager(false)} style={{ width: '100%', padding: '16px', backgroundColor: 'black', color: 'white', borderRadius: '16px', fontWeight: 900, border: 'none', fontSize: '14px', cursor: 'pointer' }}>
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