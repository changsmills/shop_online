import { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import TopStores from "../components/TopStores";
import LocationFilter from "../components/LocationFilter";
import JustForYou from "../components/JustForYou";
import TopDeals from "../components/TopDeals"; 
import NewArrivals from "../components/NewArrivals"; 
import RecentlyViewed from "../components/RecentlyViewed";
import DashboardCard from "../components/DashboardCard";
import TrendingNow from "../components/TrendingNow";
import { useIsMobile } from "../hooks/useIsMobile";
import { useDashboardData } from "../hooks/useDashboardData"; // ✅ MPYA
import BottomNav from "../components/BottomNav";
import MobileCategorySlider from "../components/MobileCategorySlider";
import { useTranslation } from 'react-i18next';

import { 
  Star, Shirt, Headphones, Dribbble, Sparkles, Gem, ChevronRight, 
  ShoppingBag, Home, Bike, Car, Wrench, Sun, Battery, ShieldCheck, 
  Truck, Sprout, Layers, Settings, Baby, HeartPulse, Gift, Dog, 
  PenTool, Factory, HardHat, Warehouse, ArrowRight, Clock, AlertCircle,
  Menu, Plus, ChevronLeft
} from "lucide-react";

// Placeholder image
const placeholderImg = "https://via.placeholder.com/100?text=Skyfall";

// ============================================
// 1. CACHE HELPER FUNCTIONS
// ============================================

const getCachedSession = () => {
  try {
    const supabaseSession = localStorage.getItem('supabase.auth.token');
    if (supabaseSession) {
      const parsed = JSON.parse(supabaseSession);
      if (parsed?.currentSession?.access_token) {
        const expiresAt = parsed.currentSession.expires_at;
        if (expiresAt && Date.now() < expiresAt * 1000) {
          return parsed.currentSession;
        }
      }
    }
    return null;
  } catch (err) {
    console.error("Error reading cached session:", err);
    return null;
  }
};

const withTimeout = (promise, timeoutMs = 5000, errorMessage = "Operation timed out") => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

// ============================================
// 2. MAIN DASHBOARD COMPONENT
// ============================================

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // 🔥 MUHIMU: Data zote zinakuja kutoka hook moja
  const { 
    categories, 
    trendingProducts, 
    ads, 
    featuredProducts: initialFeaturedProducts,
    subCategories: initialSubCategories,
    loading: dataLoading,
    error: dataError
  } = useDashboardData();

  // States
  const [search, setSearch] = useState("");
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Portal States (Kwa NavLinks style)
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('products');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [leafsForSub, setLeafsForSub] = useState([]);
  const [selectedCategoryForComponents, setSelectedCategoryForComponents] = useState(null);
  
  const timeoutRef = useRef(null);

  // ============================================
  // 3. DYNAMIC FETCH FUNCTIONS (Kwa Mega Menu)
  // ============================================

  // Fetch featured leaf categories (kwa viewMode='products')
  const fetchFeaturedLeafs = async (categoryId) => {
    if (!categoryId) return;
    
    const { data, error } = await supabase
      .from('products_engines')
      .select(`
        leaf_category_id,
        cover_image,
        leaf_categories!inner (
          id,
          name,
          name_sw
        )
      `)
      .eq('parent_category_id', categoryId)
      .not('cover_image', 'is', null)
      .limit(50);

    if (!error && data) {
      const uniqueCategories = [];
      const seenIds = new Set();

      data.forEach(item => {
        if (!seenIds.has(item.leaf_category_id)) {
          seenIds.add(item.leaf_category_id);
          uniqueCategories.push({
            id: item.leaf_category_id,
            leaf_category_id: item.leaf_category_id,
            cover_image: item.cover_image,
            leaf_categories: item.leaf_categories
          });
        }
      });

      setFeaturedProducts(uniqueCategories.slice(0, 17));
    } else {
      setFeaturedProducts([]);
    }
  };

  // Fetch sub-categories (kwa viewMode='subcategories')
  const fetchSubCategories = async (categoryId) => {
    const { data } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name', { ascending: true });
    
    if (data) {
      setSubCategories(data);
      if (data.length > 0) {
        setSelectedSubCategory(data[0]);
        await fetchLeafsForSub(data[0].id);
      }
    }
  };

  // Fetch leaf categories kwa sub-category iliyochaguliwa
  const fetchLeafsForSub = async (subCategoryId) => {
    const { data, error } = await supabase
      .from('products_engines')
      .select(`
        leaf_category_id,
        cover_image,
        leaf_categories!inner (
          id,
          name,
          name_sw
        )
      `)
      .eq('category_id', subCategoryId)
      .not('cover_image', 'is', null);

    if (!error && data) {
      const uniqueLeafs = [];
      const seenLeafIds = new Set();

      data.forEach(item => {
        if (!seenLeafIds.has(item.leaf_category_id)) {
          seenLeafIds.add(item.leaf_category_id);
          uniqueLeafs.push({
            id: item.leaf_category_id,
            name: item.leaf_categories.name,
            name_sw: item.leaf_categories.name_sw,
            cover_image: item.cover_image
          });
        }
      });
      setLeafsForSub(uniqueLeafs);
    } else {
      setLeafsForSub([]);
    }
  };

  // ============================================
  // 4. EFFECTS
  // ============================================

  // ✅ Set default category when data loads
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const allCategory = categories.find(c => c.id === null) || categories[0];
      setSelectedCategory(allCategory);
      setSelectedCategoryForComponents(allCategory);
    }
  }, [categories]);

  // ✅ Update featured products from initial data
  useEffect(() => {
    if (initialFeaturedProducts.length > 0) {
      setFeaturedProducts(initialFeaturedProducts);
    }
  }, [initialFeaturedProducts]);

  // ✅ Update subcategories from initial data
  useEffect(() => {
    if (initialSubCategories.length > 0) {
      setSubCategories(initialSubCategories);
    }
  }, [initialSubCategories]);

  // Session loading
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const cached = getCachedSession();

      if (cached && isMounted) {
        setSession(cached);
      }

      try {
        const { data: { session: latestSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (latestSession) {
          setSession(latestSession);
        } else {
          setSession(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setSession(null);
      } finally {
        if (isMounted) setSessionLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Update featured products when selected category changes (Mega Menu)
  useEffect(() => {
    if (selectedCategory?.id && activeMenu === 'categories') {
      fetchFeaturedLeafs(selectedCategory.id);
      fetchSubCategories(selectedCategory.id);
    }
  }, [selectedCategory?.id, activeMenu]);

  // Ad rotation
  useEffect(() => {
    if (ads.length === 0) return;

    let timeoutId;

    const getDurationForAd = (ad) => {
      return ad?.media_type === 'video' ? 10000 : 5000;
    };

    const rotateAd = () => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    };

    const scheduleNext = () => {
      if (timeoutId) clearTimeout(timeoutId);
      const activeAd = ads[currentAdIndex];
      if (!activeAd) return;
      const duration = getDurationForAd(activeAd);
      timeoutId = setTimeout(() => { rotateAd(); }, duration);
    };

    scheduleNext();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [ads, currentAdIndex]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ============================================
  // 5. HANDLERS
  // ============================================

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

  const handleViewAll = () => {
    setViewMode('subcategories');
  };

  const handleBack = () => {
    setViewMode('products');
  };

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

  // Function ya kupata jina la category kulingana na lugha
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

  // ============================================
  // 6. RENDER
  // ============================================

  // ✅ Error handling
  if (dataError) {
    return (
      <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>
        <Header search={search} setSearch={setSearch} />
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ color: '#dc2626' }}>Error Loading Dashboard</h2>
          <p style={{ color: '#666' }}>{dataError}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#FF6600',
              color: 'white',
              border: 'none',
              padding: '10px 30px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ Loading state
  if (dataLoading || sessionLoading) {
    return (
      <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>
        <Header search={search} setSearch={setSearch} />
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <h3 style={{ marginLeft: '12px', color: '#666' }}>{t('loading')}</h3>
          </div>
        </div>
      </div>
    );
  }

  const activeAd = ads[currentAdIndex] || {
    media_url: "https://picsum.photos/seed/promo/800/400",
    business_name: "Karibu Skyfall",
    description: "Pata bidhaa bora kutoka kwa wauzaji waliohakikiwa nchi nzima."
  };

  const isVideoAd = (ad) => ad?.media_type === 'video';

  return (
    <div key={i18n.language} style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>

      <div className="sticky-header">
        <Header search={search} setSearch={setSearch} />
      </div>
      
      <div className="main-content" style={{ 
        paddingTop: isMobile ? 0 : '115px',
        width: '100%',
        margin: 0,
        marginTop: 0,
        position: 'relative',
        paddingLeft: isMobile ? '1px' : '20px',
        paddingRight: isMobile ? '1px' : '20px',
        overflowX: 'hidden'
      }}>

        {/* ========== MOBILE CATEGORY SLIDER ========== */}
        {isMobile && !search && categories.length > 0 && (
          <div style={{
            position: 'sticky',
            top: '60px',
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            zIndex: 999,
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
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
          </div>
        )}

        <div className="content-container-simple" style={{ 
          padding: 0,
          margin: 0,
          width: '100%',
          paddingLeft: isMobile ? 0 : 0,
        }}>

          {search && (
            <div style={{ padding: '15px' }}>
              <h3 style={{ marginBottom: '15px' }}>{t('looking_for')}: {search}</h3>
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

          {!search && (
            <>
              {isMobile ? (
                <div style={{ 
                  margin: 0,
                  display: 'block',
                  lineHeight: 0,
                  fontSize: 0,
                  backgroundColor: '#f7f8fa',
                  position: 'relative',
                  top: 0,
                  marginTop: 25,
                  width: '100vw',
                  marginLeft: 'calc(-50vw + 50%)',
                  marginRight: 'calc(-50vw + 50%)',
                  padding: 0,
                  overflow: 'hidden'
                }}>
                  {activeAd ? (
                    <div style={{ margin: 0, padding: 0, position: 'relative', width: '100%' }}>
                      {isVideoAd(activeAd) ? (
                        <video
                          src={activeAd.media_url}
                          autoPlay
                          muted
                          playsInline
                          onEnded={() => {
                            if (ads.length) setCurrentAdIndex((prev) => (prev + 1) % ads.length);
                          }}
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <img
                          src={activeAd.media_url}
                          alt="promo"
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            display: 'block',
                            margin: 0,
                            padding: 0,
                            border: 'none'
                          }}
                        />
                      )}
                      <div className="banner-overlay-text mobile-overlay" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        color: 'white',
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
                        margin: 0,
                        padding: '20px',
                        pointerEvents: 'none'
                      }}>
                        <span className="ad-tag" style={{ 
                          background: '#ff6a00', 
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '10px',
                          display: 'inline-block',
                          marginBottom: '8px',
                          fontWeight: '600'
                        }}>📱 {t('mobile_deal')}</span>
                        <h2 className="banner-title mobile-title" style={{ 
                          margin: '4px 0',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          lineHeight: '1.3'
                        }}>{activeAd.business_name}</h2>
                        <p className="banner-desc mobile-desc" style={{ 
                          margin: '4px 0',
                          fontSize: '12px',
                          maxWidth: '70%',
                          lineHeight: '1.4'
                        }}>{activeAd.description}</p>
                        <button 
                          className="view-more-banner mobile-btn" 
                          onClick={() => navigate(`/store/${activeAd.store_id}`)}
                          style={{
                            background: '#ff6a00',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            marginTop: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            pointerEvents: 'auto'
                          }}
                        >
                          {t('shop_now')} →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Hakuna matangazo kwa sasa</div>
                  )}
                </div>
              ) : (
                /* DESKTOP VERSION */
                <div className="alibaba-top-layout" style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  marginBottom: 0,
                  paddingBottom: 0
                }}>
                  <aside className="side-categories" style={{
                    width: '260px',
                    flexShrink: 0,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div className="side-header" style={{
                      padding: '15px 20px',
                      borderBottom: '1px solid #eee',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Star size={18} /> <span>{t('categories')}</span>
                    </div>
                    <ul className="categories-list" style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0
                    }}>
                      {categories.map(cat => (
                        <li key={cat.id} onClick={() => handleCategoryClick(cat)} style={{
                          padding: '12px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <span className="cat-icon" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getIcon(cat.icon_name)}
                            <span className="cat-name">{getCategoryDisplayName(cat)}</span>
                          </span>
                          <ChevronRight size={14} className="arrow" />
                        </li>
                      ))}
                    </ul>
                  </aside>

                  <div className="hero-banners-container" style={{ flex: 1, margin: 0, padding: 0 }}>
                    <div className="hot-picks-banner" style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      margin: 0,
                      padding: 0,
                      lineHeight: 0
                    }}>
                      {activeAd && isVideoAd(activeAd) ? (
                        <video
                          src={activeAd.media_url}
                          autoPlay
                          muted
                          playsInline
                          onEnded={() => {
                            if (ads.length) setCurrentAdIndex((prev) => (prev + 1) % ads.length);
                          }}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: '12px'
                          }}
                        />
                      ) : (
                        activeAd && (
                          <img
                            src={activeAd.media_url}
                            className="banner-video-bg"
                            alt="promo"
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block'
                            }}
                          />
                        )
                      )}
                      {activeAd && (
                        <div className="banner-overlay-text" style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          padding: '40px',
                          color: 'white',
                          background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
                        }}>
                          <span className="ad-tag" style={{
                            background: '#ff6a00',
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            width: 'fit-content',
                            marginBottom: '15px'
                          }}>{t('sponsored')}</span>
                          <h2 className="banner-title" style={{
                            fontSize: '28px',
                            margin: '0 0 10px 0',
                            fontWeight: 'bold'
                          }}>{activeAd.business_name}</h2>
                          <p className="banner-desc" style={{
                            fontSize: '16px',
                            margin: '0 0 20px 0',
                            maxWidth: '60%'
                          }}>{activeAd.description}</p>
                          <button 
                            className="view-more-banner" 
                            onClick={() => navigate(`/store/${activeAd.store_id}`)}
                            style={{
                              background: '#ff6a00',
                              color: 'white',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '30px',
                              cursor: 'pointer',
                              width: 'fit-content',
                              fontWeight: 'bold'
                            }}
                          >
                            {t('source_now')} →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
             {/* ========== COMPONENTS ========== */}
          <div style={{ 
            marginTop: isMobile ? 1 : 5,
            paddingTop: isMobile ? 1 : 3,
          }}>
            <RecentlyViewed
              key={i18n.language}
              navigate={navigate}
              isMobile={isMobile}
            />

            {/* 🔥 MUHIMU: Hata kama umeweka key, hakikisha hizi components ndani zina useEffect({}, [i18n.language]) */}
            <TrendingNow 
              key={i18n.language}
              products={trendingProducts} 
              navigate={navigate} 
              selectedCategory={selectedCategoryForComponents} 
              isMobile={isMobile}
            />

            <LocationFilter 
              key={i18n.language}
              navigate={navigate} 
              selectedCategory={selectedCategoryForComponents}  
              isMobile={isMobile} 
            />

            <TopStores 
              key={i18n.language}
              navigate={navigate} 
              selectedCategory={selectedCategoryForComponents} 
              isMobile={isMobile}  
            />

            <TopDeals 
              key={i18n.language}
              navigate={navigate}
              selectedCategory={selectedCategoryForComponents}
              isMobile={isMobile}
            />

            <NewArrivals 
              key={i18n.language}
              navigate={navigate}
              selectedCategory={selectedCategoryForComponents} 
              isMobile={isMobile} 
            />

            <JustForYou 
              key={i18n.language}
              handleAction={handleProtectedAction} 
              search={search}
              selectedCategory={selectedCategoryForComponents}
              isMobile={isMobile}
            />
          </div>

          {!isMobile && <Footer />}

        </div>
      </div>

      {isMobile && <BottomNav 
        session={session} 
        activeMenu={activeMenu}
        onOpenCategories={() => setMobileMenuOpen(true)} 
      />}

      {/* ============================================ */}
      {/* PORTAL: MEGA MENU */}
      {/* ============================================ */}
      {!isMobile && activeMenu === 'categories' && selectedCategory && ReactDOM.createPortal(
        <div 
          className="mega-menu-container" 
          onMouseEnter={() => handleMouseEnter('categories')} 
          onMouseLeave={handleMouseLeave}
          style={{ 
            position: 'fixed', 
            top: '130px', 
            left: '0', 
            right: '0', 
            height: '520px', 
            zIndex: 9999, 
            backgroundColor: 'white', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}
        >
          <div className="mega-menu-inner" style={{ display: 'flex', height: '100%' }}>
            
            {/* SIDEBAR - Categories au Sub-categories */}
            <aside className="mega-menu-sidebar" style={{ width: '280px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
              {viewMode === 'products' ? (
                categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className={`sidebar-item ${selectedCategory?.id === cat.id ? 'active' : ''}`} 
                    onMouseEnter={() => setSelectedCategory(cat)} 
                    style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', cursor: 'pointer', backgroundColor: selectedCategory?.id === cat.id ? '#f5f5f5' : 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getIcon(cat.icon_name)}
                      <span>{getCategoryDisplayName(cat)}</span>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                ))
              ) : (
                <>
                  <div 
                    onClick={handleBack} 
                    className="sidebar-back-header" 
                    style={{ 
                      padding: '15px 20px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      color: '#ff6a00', 
                      borderBottom: '1px solid #eee', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px' 
                    }}
                  >
                    <ChevronLeft size={18} /> {t('back_to')} {getCategoryDisplayName(selectedCategory)}
                  </div>
                  {subCategories.map((sub) => (
                    <div 
                      key={sub.id} 
                      onMouseEnter={() => handleSubCategoryHover(sub)} 
                      className={`sidebar-item ${selectedSubCategory?.id === sub.id ? 'active' : ''}`} 
                      style={{ padding: '12px 25px', cursor: 'pointer', fontSize: '14px', backgroundColor: selectedSubCategory?.id === sub.id ? '#f5f5f5' : 'transparent' }}
                    >
                      {i18n.language === 'sw' ? (sub.name_sw || sub.name) : sub.name}
                    </div>
                  ))}
                </>
              )}
            </aside>

            {/* CONTENT - Featured Products au Leaf Categories */}
            <main className="mega-menu-content" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  {viewMode === 'products' 
                    ? `${t('top_categories')}: ${getCategoryDisplayName(selectedCategory)}` 
                    : (i18n.language === 'sw' ? (selectedSubCategory?.name_sw || selectedSubCategory?.name) : selectedSubCategory?.name)}
                </h3>
                {viewMode === 'products' && (
                  <button 
                    onClick={handleViewAll} 
                    className="view-all-btn" 
                    style={{ 
                      color: '#ff6a00', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}
                  >
                    {t('view_all')} <ChevronRight size={14} />
                  </button>
                )}
              </div>

              <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '20px' }}>
                {viewMode === 'products' ? (
                  <>
                    {featuredProducts.map((leaf) => (
                      <div 
                        key={leaf.id} 
                        className="grid-item" 
                        onClick={() => handleLeafClick(leaf.leaf_category_id)}
                        style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', cursor: 'pointer' }}
                      >
                        <div className="image-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f5f5f5', margin: '0 auto 10px', overflow: 'hidden', border: '1px solid #eee' }}>
                          <img 
                            src={leaf.cover_image || placeholderImg} 
                            alt={leaf.leaf_categories?.name}
                            onError={(e) => { e.target.src = placeholderImg; }} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                        <p className="grid-text" style={{ fontSize: '12px', margin: 0 }}>
                          {i18n.language === 'sw' 
                            ? (leaf.leaf_categories?.name_sw || leaf.leaf_categories?.name || "Kategoria")
                            : (leaf.leaf_categories?.name || "Kategoria")}
                        </p>
                      </div>
                    ))}

                    {/* View All Card */}
                    <div 
                      onClick={handleViewAll} 
                      className="grid-item see-all-card" 
                      style={{ textAlign: 'center', cursor: 'pointer' }}
                    >
                      <div className="image-circle see-all-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px dashed #ff6a00', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={30} color="#ff6a00" />
                      </div>
                      <p style={{ color: '#ff6a00', fontWeight: 'bold', fontSize: '12px' }}>{t('see_all')}</p>
                    </div>
                  </>
                ) : (
                  leafsForSub.map((leaf) => (
                    <div 
                      key={leaf.id} 
                      className="grid-item" 
                      onClick={() => handleLeafClick(leaf.id)}
                      style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', cursor: 'pointer' }}
                    >
                      <div className="image-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f9f9f9', margin: '0 auto 10px', overflow: 'hidden', border: '1px solid #eee' }}>
                        <img 
                          src={leaf.cover_image || placeholderImg} 
                          alt={leaf.name}
                          onError={(e) => { e.target.src = placeholderImg; }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <p className="grid-text" style={{ fontSize: '12px', margin: 0 }}>
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
      {isMobile && mobileMenuOpen && ReactDOM.createPortal(
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => {
            setMobileMenuOpen(false);
            setViewMode('products');
            setSelectedSubCategory(null);
          }}
        >
          <div 
            style={{ 
              backgroundColor: 'white', 
              height: '85vh', 
              borderTopLeftRadius: '20px', 
              borderTopRightRadius: '20px', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle - indicator ya kuteleza */}
            <div style={{ 
              width: '40px', 
              height: '5px', 
              background: '#ccc', 
              borderRadius: '10px', 
              margin: '12px auto',
              cursor: 'pointer'
            }} />

            {categories.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                {t('loading')}
              </div>
            ) : (
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* SIDEBAR - Categories au Sub-categories */}
                <aside style={{ 
                  width: '110px', 
                  borderRight: '1px solid #eee', 
                  overflowY: 'auto', 
                  backgroundColor: '#fafafa',
                  flexShrink: 0
                }}>
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
                        style={{ 
                          padding: '12px 8px', 
                          textAlign: 'center', 
                          backgroundColor: selectedCategory?.id === cat.id ? 'white' : 'transparent',
                          borderLeft: selectedCategory?.id === cat.id ? '3px solid #ff6a00' : 'none',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        <div style={{ color: selectedCategory?.id === cat.id ? '#ff6a00' : '#666' }}>
                          {getIcon(cat.icon_name)}
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          marginTop: '6px', 
                          fontWeight: selectedCategory?.id === cat.id ? 'bold' : 'normal',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word'
                        }}>
                          {getCategoryDisplayName(cat)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div 
                        onClick={() => {
                          setViewMode('products');
                          setSelectedSubCategory(null);
                        }}
                        style={{ 
                          padding: '12px 8px', 
                          textAlign: 'center', 
                          cursor: 'pointer', 
                          borderBottom: '1px solid #eee',
                          backgroundColor: '#fff5ed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <ChevronLeft size={14} color="#ff6a00" />
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff6a00' }}>Nyuma</span>
                      </div>
                      {subCategories.map((sub) => (
                        <div 
                          key={sub.id} 
                          onClick={() => {
                            setSelectedSubCategory(sub);
                            fetchLeafsForSub(sub.id);
                          }}
                          style={{ 
                            padding: '12px 8px', 
                            textAlign: 'center', 
                            backgroundColor: selectedSubCategory?.id === sub.id ? 'white' : 'transparent',
                            borderLeft: selectedSubCategory?.id === sub.id ? '3px solid #ff6a00' : 'none',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0',
                            fontSize: '11px',
                            fontWeight: selectedSubCategory?.id === sub.id ? 'bold' : 'normal',
                            color: selectedSubCategory?.id === sub.id ? '#ff6a00' : '#444'
                          }}
                        >
                          {i18n.language === 'sw' ? (sub.name_sw || sub.name) : sub.name}
                        </div>
                      ))}
                    </>
                  )}
                </aside>

                {/* CONTENT - Featured Products au Leaf Categories */}
                <main style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                      {viewMode === 'products' 
                        ? getCategoryDisplayName(selectedCategory) || t('select_category')
                        : (selectedSubCategory ? (i18n.language === 'sw' ? (selectedSubCategory.name_sw || selectedSubCategory.name) : selectedSubCategory.name) : '')
                      }
                    </h4>
                    {viewMode === 'products' && (
                      <button 
                        onClick={() => setViewMode('subcategories')}
                        style={{ 
                          color: '#ff6a00', 
                          background: 'none', 
                          border: 'none', 
                          fontSize: '12px', 
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {t('view_all')} <ChevronRight size={12} />
                      </button>
                    )}
                  </div>

                  {viewMode === 'products' ? (
                    featuredProducts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        {t('no_products')}
                      </div>
                    ) : (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '15px' 
                      }}>
                        {featuredProducts.map((leaf) => (
                          <div 
                            key={leaf.id} 
                            onClick={() => {
                              handleLeafClick(leaf.leaf_category_id);
                              setMobileMenuOpen(false);
                            }}
                            style={{ textAlign: 'center', cursor: 'pointer' }}
                          >
                            <div style={{ 
                              width: '100%', 
                              aspectRatio: '1/1', 
                              borderRadius: '50%', 
                              backgroundColor: '#f5f5f5', 
                              marginBottom: '8px', 
                              overflow: 'hidden',
                              border: '1px solid #eee',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                              <img 
                                src={leaf.cover_image || placeholderImg} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                alt={leaf.leaf_categories?.name}
                              />
                            </div>
                            <p style={{ 
                              fontSize: '10px', 
                              margin: 0, 
                              color: '#333', 
                              fontWeight: '500',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {i18n.language === 'sw' 
                                ? (leaf.leaf_categories?.name_sw || leaf.leaf_categories?.name)
                                : leaf.leaf_categories?.name}
                            </p>
                          </div>
                        ))}
                        
                        {/* "View All" Card */}
                        <div 
                          onClick={() => setViewMode('subcategories')}
                          style={{ textAlign: 'center', cursor: 'pointer' }}
                        >
                          <div style={{ 
                            width: '100%', 
                            aspectRatio: '1/1', 
                            borderRadius: '50%', 
                            border: '2px dashed #ff6a00', 
                            backgroundColor: '#fff', 
                            marginBottom: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                          }}>
                            <Plus size={28} color="#ff6a00" />
                          </div>
                          <p style={{ color: '#ff6a00', fontWeight: 'bold', fontSize: '10px' }}>
                            {t('see_all')}
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    leafsForSub.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        Hakuna bidhaa katika kategoria hii
                      </div>
                    ) : (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '15px' 
                      }}>
                        {leafsForSub.map((leaf) => (
                          <div 
                            key={leaf.id} 
                            onClick={() => {
                              handleLeafClick(leaf.id);
                              setMobileMenuOpen(false);
                            }}
                            style={{ textAlign: 'center', cursor: 'pointer' }}
                          >
                            <div style={{ 
                              width: '100%', 
                              aspectRatio: '1/1', 
                              borderRadius: '50%', 
                              backgroundColor: '#f5f5f5', 
                              marginBottom: '8px', 
                              overflow: 'hidden',
                              border: '1px solid #eee'
                            }}>
                              <img 
                                src={leaf.cover_image || placeholderImg} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                alt={leaf.name}
                              />
                            </div>
                            <p style={{ fontSize: '10px', margin: 0, fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </main>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
      
    </div>
  );
}