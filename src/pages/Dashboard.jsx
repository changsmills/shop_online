import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import api from "../axiosConfig"; 
import DashboardCard from "../components/DashboardCard";

const TopStores = lazy(() => import("../components/TopStores"));
const LocationFilter = lazy(() => import("../components/LocationFilter"));
const JustForYou = lazy(() => import("../components/JustForYou"));
const TopDeals = lazy(() => import("../components/TopDeals"));
const NewArrivals = lazy(() => import("../components/NewArrivals"));
const RecentlyViewed = lazy(() => import("../components/RecentlyViewed"));
const TrendingNow = lazy(() => import("../components/TrendingNow"));

const getToken = () => localStorage.getItem("access_token");

import { useDashboardData } from "../hooks/useDashboardData";
import BottomNav from "../components/BottomNav";
import MobileCategorySlider from "../components/MobileCategorySlider";
import { useTranslation } from 'react-i18next';
import SkeletonLayout from '../components/SkeletonLayout';

import { 
  Star, Shirt, Headphones, Dribbble, Sparkles, Gem, ChevronRight, 
  ShoppingBag, Home, Bike, Car, Wrench, Sun, Battery, ShieldCheck, 
  Truck, Sprout, Layers, Settings, Baby, HeartPulse, Gift, Dog, 
  PenTool, Factory, HardHat, Warehouse, Plus, ChevronLeft
} from "lucide-react";

const placeholderImg = "https://via.placeholder.com/100?text=Skyfall";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { 
    categories, 
    trendingProducts, 
    ads, 
    featuredProducts: initialFeaturedProducts,
    subCategories: initialSubCategories,
    loading: dataLoading,
    error: dataError
  } = useDashboardData();

  const [search, setSearch] = useState("");
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('products');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [leafsForSub, setLeafsForSub] = useState([]);
  const [selectedCategoryForComponents, setSelectedCategoryForComponents] = useState(null);
  
  const timeoutRef = useRef(null);
  const [cachedAds, setCachedAds] = useState([]);

    useEffect(() => {
    const fetchAdsWithCache = async () => {
      const storedAds = localStorage.getItem('skyfall_ads');
      const storedTime = localStorage.getItem('skyfall_ads_time');

      // 1. Ikiwa cache ipo na bado ni mpya (chini ya dakika 5), tumia hiyo tu
      if (storedAds && storedTime && (Date.now() - Number(storedTime) < 5 * 60 * 1000)) {
        setCachedAds(JSON.parse(storedAds));
        console.log("📦 [ADS] Zimepakuliwa kutoka cache!");
        return;
      }

      // 2. ✅ IMEONDOLEWA: Kizuizi cha token! Sasa mgeni yeyote anaweza kupata matangazo.
      // Tunatuma ombi moja kwa moja kwa API.
      try {
        console.log("⏳ [ADS] Inapakia matangazo kutoka Backend...");
        const response = await api.get('/advertisements/', {
          params: { status: 'active' }
        });

        // 3. ✅ IMEBORESHA: Inashughulikia pagination ya Django (results)
        const data = response.data.results || response.data || [];
        
        if (data.length > 0) {
          console.log(`✅ [ADS] Matangazo ${data.length} yamepakuliwa!`);
          setCachedAds(data);
          localStorage.setItem('skyfall_ads', JSON.stringify(data));
          localStorage.setItem('skyfall_ads_time', String(Date.now()));
        } else {
          console.warn("⚠️ [ADS] Hakuna matangazo yaliyorudishwa na Backend.");
          setCachedAds([]);
        }
        
      } catch (error) {
        console.error("❌ [ADS] Error fetching ads:", error.message);
        // Kama API imeshindwa, jaribu kutumia cache iliyopo
        if (storedAds) {
          setCachedAds(JSON.parse(storedAds));
        } else {
          setCachedAds([]); // Hakuna cache, hakuna matangazo
        }
      }
    };
    fetchAdsWithCache();
  }, []);

  const activeAd = cachedAds[currentAdIndex] || {
    media_url: "https://picsum.photos/seed/promo/800/400",
    business_name: "Karibu Skyfall",
    description: "Pata bidhaa bora kutoka kwa wauzaji waliohakikiwa nchi nzima."
  };

  const isVideoAd = (ad) => {
    if (!ad?.media_url) return false;
    return ad.media_url.match(/\.(mp4|webm|mov)$/i) !== null;
  };

const fetchFeaturedLeafs = async (categoryId) => {
  if (!categoryId) return;
  try {
    const response = await api.get('/products/', {
      params: { leaf_category: categoryId }
    });

    // 🔥 1. Angalia kama data imefika
    console.log("🔍 [DEBUG] Raw Response Data:", response.data);

    // 🔥 2. Panga data kwa usalama (Ikiwa backend inatumia pagination)
    const data = response.data.results || response.data || [];
    
    const uniqueCategories = [];
    const seenIds = new Set();

    // 🔥 3. Chuja na thibitisha ID ipo!
    data.forEach(item => {
      // ANGALIA KAMA leaf_category_id IPO!
      if (item.leaf_category_id) {
        if (!seenIds.has(item.leaf_category_id)) {
          seenIds.add(item.leaf_category_id);
          uniqueCategories.push({
            id: item.leaf_category_id,
            leaf_category_id: item.leaf_category_id,
            cover_image_url: item.cover_image_url,
            leaf_categories: item.leaf_categories
          });
          console.log("✅ Added leaf ID:", item.leaf_category_id);
        }
      } else {
        console.warn("⚠️ SKIPPED - No leaf_category_id found for product:", item.id);
      }
    });

    // 🔥 4. Thibitisha kama zimeongezwa
    console.log(`🏁 Final unique categories: ${uniqueCategories.length}`);
    setFeaturedProducts(uniqueCategories.slice(0, 17));

  } catch (error) {
    console.error("❌ [fetchFeaturedLeafs] Error:", error);
    setFeaturedProducts([]);
  }
};

  // 2. Fetch Subcategories (SORTED ALPHABETICALLY)
  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await api.get('/subcategories/', {
        params: { category_id: categoryId }
      });
      const sortedData = (response.data || []).sort((a, b) => a.name.localeCompare(b.name));
      setSubCategories(sortedData);
      if (sortedData.length > 0) {
        setSelectedSubCategory(sortedData[0]);
        await fetchLeafsForSub(sortedData[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Fetch Leafs for Subcategory (SORTED ALPHABETICALLY)
const fetchLeafsForSub = async (subCategoryId) => {
  try {
    const response = await api.get('/products/', {
      params: { sub_category: subCategoryId }
    });

    // 🔥 BADILISHA HAPA: Tumia 'results'!
    const data = response.data.results || response.data || [];

    const seenLeafIds = new Set();
    const uniqueLeafs = data
      .filter(item => item.cover_image_url && !seenLeafIds.has(item.leaf_category_id))
      .map(item => {
        seenLeafIds.add(item.leaf_category_id);
        return {
          id: item.leaf_category_id,
          name: item.leaf_categories?.name || 'Unknown',
          name_sw: item.leaf_categories?.name_sw || 'Haijulikani',
          cover_image_url: item.cover_image_url // ✅ Tumia cover_image_url!
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setLeafsForSub(uniqueLeafs);
  } catch (error) {
    console.error(error);
    setLeafsForSub([]);
  }
};

  // ========== EFFECTS ==========
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const allCategory = categories.find(c => c.id === null) || categories[0];
      setSelectedCategory(allCategory);
      setSelectedCategoryForComponents(allCategory);
    }
  }, [categories]);

  useEffect(() => {
    if (initialFeaturedProducts.length > 0) {
      setFeaturedProducts(initialFeaturedProducts);
    }
  }, [initialFeaturedProducts]);

  useEffect(() => {
    if (initialSubCategories.length > 0) {
      // 🔥 Panga initial subcategories pia kwa alfabeti
      const sortedInitial = [...initialSubCategories].sort((a, b) => a.name.localeCompare(b.name));
      setSubCategories(sortedInitial);
    }
  }, [initialSubCategories]);
useEffect(() => {
  // 🔥 Hakikisha selectedCategory ipo na ina id halisi
  if (selectedCategory && selectedCategory.id && activeMenu === 'categories') {
    console.log("🔍 Fetching data for category:", selectedCategory.id);
    fetchFeaturedLeafs(selectedCategory.id);
    fetchSubCategories(selectedCategory.id);
  } else {
    console.warn("⚠️ selectedCategory ni null au haina id!");
  }
}, [selectedCategory, activeMenu]); // 🔥 Tumia 'selectedCategory' sio 'selectedCategory?.id'

  useEffect(() => {
    if (cachedAds.length === 0) return;

    let timeoutId;

    const getDurationForAd = (ad) => {
      return ad?.media_type === 'video' ? 10000 : 5000;
    };

    const rotateAd = () => {
      setCurrentAdIndex((prev) => (prev + 1) % cachedAds.length);
    };

    const scheduleNext = () => {
      if (timeoutId) clearTimeout(timeoutId);
      const activeAd = cachedAds[currentAdIndex];
      if (!activeAd) return;
      const duration = getDurationForAd(activeAd);
      timeoutId = setTimeout(() => { rotateAd(); }, duration);
    };

    scheduleNext();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [cachedAds, currentAdIndex]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
  let isMounted = true;
  const checkAuth = async () => {
    const token = getToken();
    if (token && isMounted) {
      setSession({ user: { id: "authenticated" } });
    } else {
      setSession(null);
    }
    if (isMounted) setSessionLoading(false);
  };
  checkAuth();
}, []);

  // ========== HANDLERS ==========
  const handleMouseEnter = (menuName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setViewMode('products');
    }, 200);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedCategoryForComponents(category);
    setViewMode('products');
    setActiveMenu('categories');
    fetchFeaturedLeafs(category.id);
    fetchSubCategories(category.id);
  };

  const handleViewAll = () => setViewMode('subcategories');
  const handleBack = () => setViewMode('products');

  const handleSubCategoryHover = (subCategory) => {
    setSelectedSubCategory(subCategory);
    fetchLeafsForSub(subCategory.id);
  };

  const handleLeafClick = (leafId) => {
    navigate(`/category/${leafId}`);
    setActiveMenu(null);
  };

  const handleProtectedAction = (id, type = "direct", sectionName = "") => {
    if (!session) {
      if(window.confirm("Login to view product details? Create an account to get started!")){
        navigate("/login", { state: { from: `/product/${id}`, redirectAfterLogin: true }});
      }
      return;
    }
    if (type === "direct") navigate(`/product/${id}`);
    else navigate("/products", { state: { priorityId: id, sectionName: sectionName } });
  };

  const getCategoryDisplayName = (category) => {
    if (!category) return '';
    if (category.id === null) return i18n.language === 'sw' ? 'Zote' : 'All';
    return i18n.language === 'sw' ? (category.name_sw || category.name) : category.name;
  };

  const getIcon = (iconName) => {
    const icons = { 
      Shirt, Headphones, Dribbble, Sparkles, Gem, Home, Bike, 
      ShoppingBag, Warehouse, Factory, HardHat, Car, Wrench, 
      Sun, Battery, ShieldCheck, Truck, Sprout, Settings, 
      Baby, HeartPulse, Gift, Dog, PenTool, Layers 
    };
    const formattedName = iconName ? iconName.charAt(0).toUpperCase() + iconName.slice(1) : "";
    const IconComponent = icons[formattedName] || ShoppingBag;
    return <IconComponent size={18} />;
  };

  const ComponentFallback = () => (
    <div className="loading-container">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );

  if (dataError) {
    return (
      <div className="dashboard-wrapper">
        <Header search={search} setSearch={setSearch} />
        <div className="error-container">
          <h2 className="error-title">Error Loading Dashboard</h2>
          <p className="error-message">{dataError}</p>
          <button className="error-retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (dataLoading || sessionLoading) {
    return (
      <div className="dashboard-wrapper">
        <Header search={search} setSearch={setSearch} />
        <div className="loading-container">
          <SkeletonLayout />
        </div>
      </div>
    );
  }

  return (
    <div key={i18n.language} className="dashboard-wrapper">
      
      <div className="sticky-header">
        <Header search={search} setSearch={setSearch} />
      </div>
      
      <div className="main-content">

        <div className="content-container-simple">

          {search && (
            <div className="search-results-wrapper">
              <h3 className="search-heading">{t('looking_for')}: {search}</h3>
              <div className="alibaba-grid"> 
                {trendingProducts
                  .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
                  .map(product => (
                    <DashboardCard 
                      key={product.id}
                     image={product.cover_image_url || product.cover_image}
                      title={product.name}
                      price={product.price}
                      onClick={() => handleProtectedAction(product.id, "direct")}
                    />
                  ))}
              </div>
            </div>
          )}

          {!search && (
            <div className="alibaba-top-layout">
              
              {/* ✅ SIDEBAR IMEFICHWA KABISA KWENYE MOBILE KWA KUONGEZA style */}
              <aside className="side-categories">
                <div className="side-header">
                  <Star size={18} /> <span>{t('categories')}</span>
                </div>
                <ul className="categories-list">
                  {categories.map(cat => (
                    <li key={cat.id} onClick={() => handleCategoryClick(cat)}>
                      <span className="cat-icon">
                        {getIcon(cat.icon_name)}
                        <span className="cat-name">{getCategoryDisplayName(cat)}</span>
                      </span>
                      <ChevronRight size={14} className="arrow" />
                    </li>
                  ))}
                </ul>
              </aside>

              {/* ✅ SLIDER NA BANNER SASA ZIKO CHINI YA CONTAINER MOJA */}
              <div className="alibaba-mobile-content">
                
                <div className="category-slider-wrapper">
                  {!search && categories.length > 0 && (
                    <MobileCategorySlider 
                      categories={categories}
                      selectedCategory={selectedCategoryForComponents}
                      onSelectCategory={(cat) => {
                        setSelectedCategoryForComponents(cat);
                        setSelectedCategory(cat);
                        if (cat.id === null) {
                          setSelectedCategoryForComponents(null);
                          setSelectedCategory(null);
                        } else {
                          setSelectedCategoryForComponents(cat);
                          setSelectedCategory(cat);
                          fetchFeaturedLeafs(cat.id);
                          fetchSubCategories(cat.id);
                        }
                      }}
                      getDisplayName={getCategoryDisplayName}
                      getIcon={getIcon}
                    />
                  )}
                </div>

                <div className="hero-banners-container">
                  <div className="hot-picks-banner">
                    {activeAd && isVideoAd(activeAd) ? (
                      <video
                        src={activeAd.media_url}
                        autoPlay
                        muted
                        playsInline
                        onEnded={() => {
                          if (cachedAds.length) setCurrentAdIndex((prev) => (prev + 1) % cachedAds.length);
                        }}
                        className="banner-media"
                      />
                    ) : (
                      activeAd && (
                        <img
                          src={activeAd.media_url}
                          className="banner-media"
                          alt="promo"
                          loading="lazy"
                        />
                      )
                    )}
                    {activeAd && (
                      <div className="banner-overlay-text">
                        <span className="ad-tag">{t('sponsored')}</span>
                        <h2 className="banner-title">{activeAd.business_name}</h2>
                        <p className="banner-desc">{activeAd.description}</p>
                        <button 
                          className="view-more-banner" 
                          onClick={() => navigate(`/store/${activeAd.store_id}`)}
                        >
                          {t('source_now')} →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

<div className="components-wrapper">
  <Suspense fallback={<ComponentFallback />}>
    <RecentlyViewed key={i18n.language} navigate={navigate} />
  </Suspense>

  <Suspense fallback={<ComponentFallback />}>
    <TrendingNow 
      key={i18n.language}
      products={trendingProducts} 
      navigate={navigate} 
      selectedCategory={selectedCategoryForComponents} 
      getCategoryDisplayName={getCategoryDisplayName}
    />
  </Suspense>

  <Suspense fallback={<ComponentFallback />}>
    <LocationFilter 
      key={i18n.language}
      navigate={navigate} 
      selectedCategory={selectedCategoryForComponents}  
    />
  </Suspense>

  <Suspense fallback={<ComponentFallback />}>
    <TopStores 
      key={i18n.language}
      navigate={navigate} 
      selectedCategory={selectedCategoryForComponents} 
    />
  </Suspense>

  <Suspense fallback={<ComponentFallback />}>
    <TopDeals 
      key={i18n.language}
      navigate={navigate}
      selectedCategory={selectedCategoryForComponents}
    />
  </Suspense>

  <Suspense fallback={<ComponentFallback />}>
    <NewArrivals 
      key={i18n.language}
      navigate={navigate}
      selectedCategory={selectedCategoryForComponents} 
    />
  </Suspense>

  <Suspense fallback={<ComponentFallback />}>
    <JustForYou 
      key={i18n.language}
      handleAction={handleProtectedAction} 
      search={search}
      selectedCategory={selectedCategoryForComponents}
    />
  </Suspense>
</div>

          <div className="footer-wrapper">
            <Footer />
          </div>

        </div>
      </div>

      <div className="bottom-nav-wrapper">
        <BottomNav 
          session={session} 
          activeMenu={activeMenu}
          onOpenCategories={() => setMobileMenuOpen(true)} 
        />
      </div>

      {activeMenu === 'categories' && selectedCategory && ReactDOM.createPortal(
        <div 
          className="mega-menu-container"
          onMouseEnter={() => handleMouseEnter('categories')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mega-menu-inner">
            <aside className="mega-menu-sidebar">
              {viewMode === 'products' ? (
                categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className={`sidebar-item ${selectedCategory?.id === cat.id ? 'active' : ''}`} 
                    onMouseEnter={() => setSelectedCategory(cat)}
                  >
                    <div className="sidebar-item-content">
                      {getIcon(cat.icon_name)}
                      <span>{getCategoryDisplayName(cat)}</span>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                ))
              ) : (
                <>
                  <div onClick={handleBack} className="sidebar-back-header">
                    <ChevronLeft size={18} /> {t('back_to')} {getCategoryDisplayName(selectedCategory)}
                  </div>
                  {subCategories.map((sub) => (
                    <div 
                      key={sub.id} 
                      onMouseEnter={() => handleSubCategoryHover(sub)} 
                      className={`sidebar-item ${selectedSubCategory?.id === sub.id ? 'active' : ''}`}
                    >
                      {i18n.language === 'sw' ? (sub.name_sw || sub.name) : sub.name}
                    </div>
                  ))}
                </>
              )}
            </aside>
            <main className="mega-menu-content">
              <div className="content-header">
                <h3>
                  {viewMode === 'products' 
                    ? `${t('top_categories')}: ${getCategoryDisplayName(selectedCategory)}` 
                    : (i18n.language === 'sw' ? (selectedSubCategory?.name_sw || selectedSubCategory?.name) : selectedSubCategory?.name)}
                </h3>
                {viewMode === 'products' && (
                  <button onClick={handleViewAll} className="view-all-btn">
                    {t('view_all')} <ChevronRight size={14} />
                  </button>
                )}
              </div>
              
<div className="category-grid">
  {viewMode === 'products' ? (
    <>
      {featuredProducts.map((leaf) => (
        <div 
          key={leaf.id} 
          className="grid-item" 
          onClick={() => {
            try {
              // 🔥 1. Pata ID halisi (kwa kipaumbele)
              const targetId = leaf.leaf_category_id || leaf.id;
              console.log(`🔍 [LeafClick] Attempting to navigate for leaf: ${leaf.leaf_categories?.name || leaf.name}, targetId: ${targetId}`);

              // 🔥 2. Kagua kama ID ni sahihi (sio undefined, null, au 'undefined')
              if (!targetId || targetId === 'undefined' || targetId === 'null' || targetId === '') {
                console.error("❌ [LeafClick] Invalid target ID detected:", targetId);
                return; // Simamisha hapa!
              }

              // 🔥 3. Amua Desktop au Mobile
              if (window.innerWidth > 1024) {
                // Desktop: Fungua tab mpya na ukague kama popup ilizuiwa
                console.log(`🖥️ [LeafClick] Desktop: Opening new tab for ${targetId}`);
                const newWindow = window.open(`/category/${targetId}`, '_blank');
                
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                  console.warn("⚠️ [LeafClick] Popup blocked by browser. Falling back to navigate.");
                  handleLeafClick(targetId);
                } else {
                  console.log(`✅ [LeafClick] New tab opened successfully for ${targetId}`);
                }
              } else {
                // Mobile: Tumia navigate
                console.log(`📱 [LeafClick] Mobile: Navigating in same tab for ${targetId}`);
                handleLeafClick(targetId);
                console.log(`✅ [LeafClick] Navigation successful.`);
              }
            } catch (error) {
              // 🔥 4. Catch ya mwisho kwa makosa yasiyotarajiwa
              console.error("❌ [LeafClick] Unexpected error on featured leaf click:", error);
            }
          }}
        >
          <div className="image-circle">
            <img src={leaf.cover_image_url || placeholderImg} alt={leaf.leaf_categories?.name} />
          </div>
          <p className="grid-text">
            {i18n.language === 'sw' 
              ? (leaf.leaf_categories?.name_sw || leaf.leaf_categories?.name)
              : leaf.leaf_categories?.name}
          </p>
        </div>
      ))}
      {/* 🔥 See All */}
      <div onClick={handleViewAll} className="grid-item see-all-card">
        <div className="image-circle see-all-circle">
          <Plus size={30} color="#ff6a00" />
        </div>
        <p className="see-all-text">{t('see_all')}</p>
      </div>
    </>
  ) : (
    leafsForSub.map((leaf) => (
      <div 
        key={leaf.id} 
        className="grid-item" 
        onClick={() => {
          try {
            // 🔥 1. Pata ID halisi
            const targetId = leaf.id || leaf.leaf_category_id;
            console.log(`🔍 [LeafClick] Attempting to navigate for sub-leaf: ${leaf.name}, targetId: ${targetId}`);

            // 🔥 2. Kagua kama ID ni sahihi
            if (!targetId || targetId === 'undefined' || targetId === 'null' || targetId === '') {
              console.error("❌ [LeafClick] Invalid target ID detected:", targetId);
              return;
            }

            // 🔥 3. Amua Desktop au Mobile
            if (window.innerWidth > 1024) {
              console.log(`🖥️ [LeafClick] Desktop: Opening new tab for ${targetId}`);
              const newWindow = window.open(`/category/${targetId}`, '_blank');
              
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.warn("⚠️ [LeafClick] Popup blocked by browser. Falling back to navigate.");
                handleLeafClick(targetId);
              } else {
                console.log(`✅ [LeafClick] New tab opened successfully for ${targetId}`);
              }
            } else {
              console.log(`📱 [LeafClick] Mobile: Navigating in same tab for ${targetId}`);
              handleLeafClick(targetId);
              console.log(`✅ [LeafClick] Navigation successful.`);
            }
          } catch (error) {
            // 🔥 4. Catch ya mwisho kwa makosa yasiyotarajiwa
            console.error("❌ [LeafClick] Unexpected error on sub-leaf click:", error);
          }
        }}
      >
        <div className="image-circle">
          <img 
            src={leaf.cover_image_url || leaf.cover_image || placeholderImg}
            alt={leaf.leaf_categories?.name} 
          />
        </div>
        <p className="grid-text">
          {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
        </p>
      </div>
    ))
  )}
</div>
            </main>
          </div>
        </div>,
        document.body
      )}

        {mobileMenuOpen && ReactDOM.createPortal(
        <div 
          className="mobile-categories-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="mobile-categories-modal" onClick={(e) => e.stopPropagation()}>
            
            {/* 1. HEADER ya Juu */}
            <div className="mc-header">
              <button className="mc-back-btn" onClick={() => setMobileMenuOpen(false)}>
                <ChevronLeft size={24} />
              </button>
              <h2 className="mc-title">{t('categories')}</h2>
              <div className="mc-spacer"></div>
            </div>

            {/* 2. BODY (Sidebar + Content) */}
            <div className="mc-body">
              
              {/* SIDEBAR (Kushoto) */}
              <aside className="mc-sidebar">
                {categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className={`mc-sidebar-item ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedCategoryForComponents(cat);
                      // Tuma ombi la kupata data za kategoria hii
                      if (cat.id) {
                        fetchFeaturedLeafs(cat.id);
                        fetchSubCategories(cat.id);
                      }
                    }}
                  >
                    {getCategoryDisplayName(cat)}
                  </div>
                ))}
              </aside>

              {/* CONTENT (Kulia) */}
              <main className="mc-content">
                
                {/* SEHEMU YA 1: RECOMMENDATIONS (Picha za Duara) */}
                <div className="mc-section">
                  <h3 className="mc-section-title">Selected Products</h3>
                  <div className="mc-recommendations-grid">
                    {featuredProducts && featuredProducts.length > 0 ? (
                      featuredProducts.slice(0, 9).map((leaf) => (
                        <div 
                          key={leaf.id} 
                          className="mc-recommendation-item"
                          onClick={() => {
                            handleLeafClick(leaf.leaf_category_id);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="mc-rec-image">
                            <img src={leaf.cover_image_url || placeholderImg} alt={leaf.leaf_categories?.name} />
                          </div>
                          <p>{i18n.language === 'sw' ? (leaf.leaf_categories?.name_sw || leaf.leaf_categories?.name) : leaf.leaf_categories?.name}</p>
                        </div>
                      ))
                    ) : (
                      <div className="mobile-empty-state" style={{gridColumn: '1 / -1'}}></div>
                    )}
                  </div>
                </div>

                {/* SEHEMU YA 2: GET PRODUCT INSPIRATION (Bidhaa 2x2) */}
                <div className="mc-section">
                  <div className="mc-inspiration-grid">
                    {trendingProducts && trendingProducts.length > 0 ? (
                      trendingProducts.slice(0, 4).map((product) => (
                        <div 
                          key={product.id} 
                          className="mc-inspiration-card"
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <img src={product.cover_image_url || product.cover_image || placeholderImg} alt={product.name} />
                          <p className="mc-insp-title">{product.name}</p>
                          <p className="mc-insp-price">TSh {product.price}</p>
                          <p className="mc-insp-moq">Min. order: {product.moq || 1}</p>
                        </div>
                      ))
                    ) : (
                      <div className="mobile-empty-state" style={{gridColumn: '1 / -1'}}></div>
                    )}
                  </div>
                </div>

              </main>
            </div>

          </div>
        </div>,
        document.body
      )}
      
    </div>
  );
}