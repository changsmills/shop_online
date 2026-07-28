import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
const TopStores = lazy(() => import("../components/TopStores"));
const LocationFilter = lazy(() => import("../components/LocationFilter"));
const JustForYou = lazy(() => import("../components/JustForYou"));
const TopDeals = lazy(() => import("../components/TopDeals"));
const NewArrivals = lazy(() => import("../components/NewArrivals"));
const RecentlyViewed = lazy(() => import("../components/RecentlyViewed"));
const TrendingNow = lazy(() => import("../components/TrendingNow"));
const API_BASE_URL = "http://127.0.0.1:8000/api";
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
  // ✅ useIsMobile imeondolewa kabisa!

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

      if (storedAds && storedTime && (Date.now() - Number(storedTime) < 5 * 60 * 1000)) {
        setCachedAds(JSON.parse(storedAds));
        return;
      }

      try {
        // ✅ BADILISHA: Piga API ya Django kwa matangazo yaliyo 'active'
        const response = await axios.get(`${API_BASE_URL}/advertisements/`, {
          params: { status: 'active' } // Kama backend inaweza kuchuja kwa parameter
        });
        
        const data = response.data;
        if (data) {
          setCachedAds(data);
          localStorage.setItem('skyfall_ads', JSON.stringify(data));
          localStorage.setItem('skyfall_ads_time', String(Date.now()));
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    fetchAdsWithCache();
  }, []);

  const activeAd = cachedAds[currentAdIndex] || {
    media_url: "https://picsum.photos/seed/promo/800/400",
    business_name: "Karibu Skyfall",
    description: "Pata bidhaa bora kutoka kwa wauzaji waliohakikiwa nchi nzima."
  };

  // ✅ Tumia URL extension kuamua kama ni video
const isVideoAd = (ad) => {
  if (!ad?.media_url) return false;
  return ad.media_url.match(/\.(mp4|webm|mov)$/i) !== null;
};

   // 1. Fetch Featured Leafs (Kategoria za kipekee zenye picha)
  const fetchFeaturedLeafs = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/products/`, {
        params: { parent_category: categoryId }
      });

      // Chuja ili tu kupata leaf categories za kipekee zenye picha
      const seenIds = new Set();
      const uniqueLeafs = response.data
        .filter(item => item.cover_image && !seenIds.has(item.leaf_category_id))
        .map(item => {
          seenIds.add(item.leaf_category_id);
          return {
            id: item.leaf_category_id,
            leaf_category_id: item.leaf_category_id,
            cover_image: item.cover_image,
            leaf_categories: item.leaf_categories || { name: 'Unknown', name_sw: 'Haijulikani' }
          };
        });
        
      setFeaturedProducts(uniqueLeafs.slice(0, 17));
    } catch (error) {
      console.error(error);
      setFeaturedProducts([]);
    }
  };

  // 2. Fetch Subcategories (Sahihi na rahisi)
  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subcategories/`, {
        params: { category_id: categoryId }
      });
      setSubCategories(response.data);
      if (response.data.length > 0) {
        setSelectedSubCategory(response.data[0]);
        await fetchLeafsForSub(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Fetch Leafs for Subcategory (Inachuja kupitia bidhaa, kama Supabase)
  const fetchLeafsForSub = async (subCategoryId) => {
    try {
      // Tumia endpoint ya products kwa sababu ni hapo ndipo kuna cover_image
      const response = await axios.get(`${API_BASE_URL}/products/`, {
        params: { category: subCategoryId } // Tafuta products zenye subCategoryId
      });

      // Sasa chuja na upate leaf categories za kipekee kwa kategoria hii
      const seenLeafIds = new Set();
      const uniqueLeafs = response.data
        .filter(item => item.cover_image && !seenLeafIds.has(item.leaf_category_id))
        .map(item => {
          seenLeafIds.add(item.leaf_category_id);
          return {
            id: item.leaf_category_id,
            name: item.leaf_categories?.name || 'Unknown',
            name_sw: item.leaf_categories?.name_sw || 'Haijulikani',
            cover_image: item.cover_image
          };
        });
        
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
      setSubCategories(initialSubCategories);
    }
  }, [initialSubCategories]);


  useEffect(() => {
    if (selectedCategory?.id && activeMenu === 'categories') {
      fetchFeaturedLeafs(selectedCategory.id);
      fetchSubCategories(selectedCategory.id);
    }
  }, [selectedCategory?.id, activeMenu]);

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
      // Kwa sasa, token ipo. Unaweza ku-verify kwa kupiga endpoint ya profile.
      // Hapa tutachukulia kuwa ameingia.
      setSession({ user: { id: "authenticated" } }); // Dummy session kwa UI
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

  // ========== FALLBACK COMPONENT KWA SUSPENSE ==========
const ComponentFallback = () => (
  <div className="loading-container">
    <div className="loading-dots">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  </div>
);

  // ========== RENDER ==========
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

        {/* Category Slider - Inaonekana kwenye mobile & tablet (CSS inaficha kwenye desktop) */}
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

        <div className="content-container-simple">

          {/* Search Results */}
          {search && (
            <div className="search-results-wrapper">
              <h3 className="search-heading">{t('looking_for')}: {search}</h3>
              <div className="alibaba-grid"> 
                {trendingProducts
                  .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
                  .map(product => (
                    <DashboardCard 
                      key={product.id}
                      image={product.cover_image}
                      title={product.name}
                      price={product.price}
                      onClick={() => handleProtectedAction(product.id, "direct")}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Hero Section - Banner na Sidebar */}
          {!search && (
            <div className="alibaba-top-layout">
              
              {/* Sidebar - Inaonekana Desktop tu (>1024px) */}
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

              {/* Banner - Inaonekana kwenye mobile, tablet, na desktop */}
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
          )}

{/* Components */}
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

          {/* Footer - Inaonekana desktop & tablet tu (CSS inaficha kwenye mobile) */}
          <div className="footer-wrapper">
            <Footer />
          </div>

        </div>
      </div>

      {/* Bottom Nav - Inaonekana mobile tu (CSS inaficha kwenye desktop & tablet) */}
      <div className="bottom-nav-wrapper">
        <BottomNav 
          session={session} 
          activeMenu={activeMenu}
          onOpenCategories={() => setMobileMenuOpen(true)} 
        />
      </div>

      {/* ============================================ */}
      {/* PORTAL: MEGA MENU - DESKTOP HOVER ONLY */}
      {/* ============================================ */}
      {activeMenu === 'categories' && selectedCategory && ReactDOM.createPortal(
        <div 
          className="mega-menu-container"
          onMouseEnter={() => handleMouseEnter('categories')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mega-menu-inner">
            
            {/* SIDEBAR */}
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

            {/* CONTENT */}
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
                        onClick={() => handleLeafClick(leaf.leaf_category_id)}
                      >
                        <div className="image-circle">
                          <img src={leaf.cover_image || placeholderImg} alt={leaf.leaf_categories?.name} />
                        </div>
                        <p className="grid-text">
                          {i18n.language === 'sw' 
                            ? (leaf.leaf_categories?.name_sw || leaf.leaf_categories?.name)
                            : leaf.leaf_categories?.name}
                        </p>
                      </div>
                    ))}
                    <div onClick={handleViewAll} className="grid-item see-all-card">
                      <div className="image-circle see-all-circle">
                        <Plus size={30} color="#ff6a00" />
                      </div>
                      <p className="see-all-text">{t('see_all')}</p>
                    </div>
                  </>
                ) : (
                  leafsForSub.map((leaf) => (
                    <div key={leaf.id} className="grid-item" onClick={() => handleLeafClick(leaf.id)}>
                      <div className="image-circle">
                        <img src={leaf.cover_image || placeholderImg} alt={leaf.name} />
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

      {/* ========== MOBILE MENU PORTAL ========== */}
      {mobileMenuOpen && ReactDOM.createPortal(
        <div 
          className="mobile-menu-overlay"
          onClick={() => {
            setMobileMenuOpen(false);
            setViewMode('products');
            setSelectedSubCategory(null);
          }}
        >
          <div className="mobile-menu-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-handle" />
            <div className="mobile-menu-body">
              <aside className="mobile-menu-sidebar">
                {viewMode === 'products' ? (
                  categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      onClick={() => {
                        setSelectedCategory(cat);
                        fetchFeaturedLeafs(cat.id);
                        fetchSubCategories(cat.id);
                        if (viewMode !== 'products') setViewMode('products');
                      }}
                      className={`mobile-sidebar-item ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                    >
                      <div className="mobile-sidebar-icon">{getIcon(cat.icon_name)}</div>
                      <div className="mobile-sidebar-text">{getCategoryDisplayName(cat)}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div 
                      onClick={() => {
                        setViewMode('products');
                        setSelectedSubCategory(null);
                      }}
                      className="mobile-sidebar-back"
                    >
                      <ChevronLeft size={14} color="#ff6a00" />
                      <span>Nyuma</span>
                    </div>
                    {subCategories.map((sub) => (
                      <div 
                        key={sub.id} 
                        onClick={() => {
                          setSelectedSubCategory(sub);
                          fetchLeafsForSub(sub.id);
                        }}
                        className={`mobile-sidebar-item ${selectedSubCategory?.id === sub.id ? 'active' : ''}`}
                      >
                        {i18n.language === 'sw' ? (sub.name_sw || sub.name) : sub.name}
                      </div>
                    ))}
                  </>
                )}
              </aside>

              <main className="mobile-menu-content">
                <div className="mobile-content-header">
                  <h4>
                    {viewMode === 'products' 
                      ? getCategoryDisplayName(selectedCategory) || t('select_category')
                      : (selectedSubCategory ? (i18n.language === 'sw' ? (selectedSubCategory.name_sw || selectedSubCategory.name) : selectedSubCategory.name) : '')
                    }
                  </h4>
                  {viewMode === 'products' && (
                    <button onClick={() => setViewMode('subcategories')} className="mobile-view-all-btn">
                      {t('view_all')} <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                {viewMode === 'products' ? (
                  featuredProducts.length === 0 ? (
                    <div className="mobile-empty-state">{t('no_products')}</div>
                  ) : (
                    <div className="mobile-grid-3">
                      {featuredProducts.map((leaf) => (
                        <div 
                          key={leaf.id} 
                          onClick={() => {
                            handleLeafClick(leaf.leaf_category_id);
                            setMobileMenuOpen(false);
                          }}
                          className="mobile-grid-item"
                        >
                          <div className="mobile-grid-image">
                            <img src={leaf.cover_image || placeholderImg} alt={leaf.leaf_categories?.name} />
                          </div>
                          <p>{i18n.language === 'sw' ? (leaf.leaf_categories?.name_sw || leaf.leaf_categories?.name) : leaf.leaf_categories?.name}</p>
                        </div>
                      ))}
                      <div onClick={() => setViewMode('subcategories')} className="mobile-grid-item">
                        <div className="mobile-grid-image view-all">
                          <Plus size={28} color="#ff6a00" />
                        </div>
                        <p className="view-all-text">{t('see_all')}</p>
                      </div>
                    </div>
                  )
                ) : (
                  leafsForSub.length === 0 ? (
                    <div className="mobile-empty-state">Hakuna bidhaa katika kategoria hii</div>
                  ) : (
                    <div className="mobile-grid-3">
                      {leafsForSub.map((leaf) => (
                        <div 
                          key={leaf.id} 
                          onClick={() => {
                            handleLeafClick(leaf.id);
                            setMobileMenuOpen(false);
                          }}
                          className="mobile-grid-item"
                        >
                          <div className="mobile-grid-image">
                            <img src={leaf.cover_image || placeholderImg} alt={leaf.name} />
                          </div>
                          <p>{i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}</p>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </main>
            </div>
          </div>
        </div>,
        document.body
      )}
      
    </div>
  );
}