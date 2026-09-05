import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Dashboard.css";
import api from "../axiosConfig"; 
import DashboardCard from "../components/DashboardCard";
import { useUserLocation } from '../hooks/useUserLocation,js';


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
  PenTool, Factory, HardHat, Warehouse, Plus, ChevronLeft , X // 🔥 ONGEZA X HAPA!
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
  const abortRef = useRef(null); // ✅ ONGEZA HII - kwa ajili ya kufuta requests
  const categoryCacheRef = useRef({}); // ✅ Hapa
  const [cachedAds, setCachedAds] = useState([]);
  const [loadingLeafs, setLoadingLeafs] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] = useState('categories');
  const { location, error: locationError, isLoading: locationLoading } = useUserLocation();
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

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

  if (categoryCacheRef.current[categoryId]?.leafs) {
    setFeaturedProducts(categoryCacheRef.current[categoryId].leafs);
    setLoadingLeafs(false); 
    return;
  }

  setLoadingLeafs(true); 

  try {
    console.log(`⏳ [FETCH] Inapakia products za category ${categoryId}...`);
    
    const response = await api.get('/products/', {
      params: {
        parent_category: categoryId,
        limit: 17,
        ordering: '-views'
      }
    });

    const data = response.data.results || response.data || [];
    
    const result = data.map((product) => ({
      id: product.id,
      leaf_category_id: product.leaf_category_id || product.id,
      cover_image_url: product.cover_image_url,
      name: product.leaf_category_name || product.name,
      name_sw: product.leaf_category_name || product.name
    }));

    // 🔥 FIX MPYA: Kama hakuna bidhaa direct, inakwenda kuchukua kutoka kwenye SUB-CATEGORIES!
    if (result.length === 0) {
      console.log("⚠️ Hakuna direct, inaangalia subcategories zote...");
      
      // 1. Vuta subcategories za hiyo category
      const subResponse = await api.get('/subcategories/', {
        params: { category_id: categoryId }
      });
      const subs = subResponse.data || [];

      if (subs.length > 0) {
        // Weka subcategories kwenye state (ili zionekane kwenye desktop/mobile menu)
        setSubCategories(subs);
        setSelectedSubCategory(subs[0]); // Chagua ya kwanza tu kama reference

        let allMappedProducts = [];

        // 2. Piga API kwa KILA subcategory (au kwanza 8 za kwanza ili isiwe slow sana)
        const subsToFetch = subs.slice(0, 8); // Badilisha hii 8 uweke 100 kama unataka zote
        for (const sub of subsToFetch) {
           try {
             const prodRes = await api.get('/products/', {
               params: { sub_category: sub.id, limit: 17, ordering: '-views' }
             });
             const prodData = prodRes.data.results || prodRes.data || [];
             
             const mapped = prodData.map((product) => ({
               id: product.id,
               leaf_category_id: product.leaf_category_id || product.id,
               cover_image_url: product.cover_image_url,
               name: product.leaf_category_name || product.name,
               name_sw: product.leaf_category_name || product.name
             }));

             // Changanya bidhaa za subcategory hii na zilizopo
             allMappedProducts = allMappedProducts.concat(mapped);
           } catch (e) {
             console.error(`❌ Error fetching products for sub ${sub.id}`, e);
           }
        }

        // Weka bidhaa zote zilizokusanywa (All Products View!)
        setFeaturedProducts(allMappedProducts);
        
        // Hifadhi kwenye cache
        categoryCacheRef.current[categoryId] = {
          ...categoryCacheRef.current[categoryId],
          leafs: allMappedProducts
        };
        
        setLoadingLeafs(false);
        return; // Acha hapa kwa sababu tumepata bidhaa!
      }
    }

    // Kama kuna bidhaa direct (au hakuna subs), endelea na zile za kawaida
    categoryCacheRef.current[categoryId] = {
      ...categoryCacheRef.current[categoryId],
      leafs: result
    };
    
    setFeaturedProducts(result);
    setLoadingLeafs(false);

  } catch (error) {
    console.error("❌ [fetchFeaturedLeafs] Error:", error);
    setFeaturedProducts([]);
    setLoadingLeafs(false);
  }
};

const fetchSubCategories = async (categoryId) => {
  if (!categoryId) return;

  if (categoryCacheRef.current[categoryId]?.subCategories) {
    const cachedSubs = categoryCacheRef.current[categoryId].subCategories;
    setSubCategories(cachedSubs);
    if (cachedSubs.length > 0) {
      setSelectedSubCategory(cachedSubs[0]);
      // Usifanye fetchLeafsForSub hapa! Itafanywa na useEffect au hover
    }
    return;
  }

  try {
    console.log(`⏳ [FETCH] Inapakia subcategories za category ${categoryId}...`);
    const response = await api.get('/subcategories/', {
      params: { category_id: categoryId }
    });

    const sortedData = (response.data || []).sort((a, b) => 
      (a.name || '').localeCompare(b.name || '')
    );

    categoryCacheRef.current[categoryId] = {
      ...categoryCacheRef.current[categoryId],
      subCategories: sortedData
    };

    console.log(`✅ [SUCCESS] Subcategories ${sortedData.length} zimehifadhiwa!`);
    setSubCategories(sortedData);

    if (sortedData.length > 0) {
      setSelectedSubCategory(sortedData[0]);
      // Pia usifanye fetchLeafsForSub hapa!
    }
  } catch (error) {
    console.error("❌ [fetchSubCategories] Error:", error);
  }
};

const fetchLeafsForSub = async (subCategoryId) => {
  if (!subCategoryId) return;

  const cacheKey = `sub_${subCategoryId}`;

  if (categoryCacheRef.current[cacheKey]) {
    setLeafsForSub(categoryCacheRef.current[cacheKey]);
    setLoadingLeafs(false);
    return;
  }

  setLoadingLeafs(true);

  try {
    console.log(`⏳ [FETCH] Inapakia products za subcategory ${subCategoryId}...`);

    const response = await api.get('/products/', {
      params: {
        sub_category: subCategoryId,
        limit: 17,
        ordering: '-views'
      }
    });

    const data = response.data.results || response.data || [];

    const result = data.map((product) => ({
      id: product.id,
      leaf_category_id: product.leaf_category_id || product.id,
      cover_image_url: product.cover_image_url,
      name: product.leaf_category_name || product.name,
      name_sw: product.leaf_category_name || product.name
    }));

    categoryCacheRef.current[cacheKey] = result;
    setLeafsForSub(result);
    setLoadingLeafs(false);

  } catch (error) {
    console.error("❌ [fetchLeafsForSub] Error:", error);
    setLeafsForSub([]);
    setLoadingLeafs(false);
  }
};

// ✅ BADILISHA HII: Hakuna kategoria inayojichagua tena!
useEffect(() => {
  // Angalia kama URL ina 'category' ID (kwa mfano /?category=5)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryIdFromUrl = urlParams.get('category');

  if (categoryIdFromUrl && categories.length > 0) {
    const foundCategory = categories.find(c => String(c.id) === String(categoryIdFromUrl));
    if (foundCategory) {
      setSelectedCategory(foundCategory);
      setSelectedCategoryForComponents(foundCategory);
      return; // Acha, tumechagua kutoka URL
    }
  }

  // Kama hakuna kategoria kwenye URL, hakikisha inabaki NULL!
  // Hapa ndipo tunazuiya isijichague.
  if (!selectedCategory) {
    setSelectedCategory(null);
    setSelectedCategoryForComponents(null);
  }
}, [categories]); // ← Hii inafanya kazi tu kama categories zimebadilika

useEffect(() => {
  if (selectedCategory && selectedCategory.id) {
    console.log("🔍 Fetching data for category:", selectedCategory.id);
    fetchFeaturedLeafs(selectedCategory.id);
    fetchSubCategories(selectedCategory.id);
  }
}, [selectedCategory?.id]); // ✅ Tumia optional chaining

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

// ========== EFFECTS ==========

// ✅ 1. CLEANUP YA TIMEOUT NA ABORT CONTROLLER (IMEUNGANISHWA)
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortRef.current) {
      abortRef.current.abort(); // ✅ Futa request zote zinazoendelea
    }
  };
}, []);

// ✅ 2. AUTH CHECK (IMEBORESHW)
useEffect(() => {
  let isMounted = true;
  
  const checkAuth = async () => {
    const token = getToken();
    
    if (!token) {
      if (isMounted) {
        setSession(null);
        setSessionLoading(false);
      }
      return;
    }
    
    try {
      // 🔥 Pata profile kutoka backend
      const profileRes = await api.get('/profile/');
      const userProfile = profileRes.data;

      // Kama component imeondoka, usifanye setState
      if (!isMounted) return;

      // 🔥 Ikiwa ni supplier na hajaverify OTP, mpeleke kwenye verify page
      if (userProfile.role === 'supplier' && !userProfile.is_otp_verified) {
        navigate('/verify-seller-otp');
        return;
      }

      // Vinginevyo, set session kama kawaida
      setSession({ user: { id: userProfile.id } });
      
    } catch (err) {
      console.error("Auth check error:", err);
      
      if (!isMounted) return;
      
      // Cleanup tokens kama API imeshindwa
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setSession(null);
      
    } finally {
      // Hakikisha sessionLoading inawekwa false kila wakati
      if (isMounted) {
        setSessionLoading(false);
      }
    }
  };
  
  checkAuth();
  
  // Cleanup: Weka isMounted kuwa false wakati component inaondoka
  return () => {
    isMounted = false;
  };
}, [navigate]);

useEffect(() => {
  if (viewMode === 'subcategories' && selectedSubCategory?.id) {
    console.log("🔍 Fetching products za subcategory:", selectedSubCategory.id);
    fetchLeafsForSub(selectedSubCategory.id);
  }
}, [viewMode, selectedSubCategory?.id]);

  // 🔥 KAGUA MTANDAO NA KUVUTA DATA MPYA (REFETCH) BILA KUFUNGA UKURASA
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Mtandao umeunganishwa! Inapakia data za Dashboard upya...");

      // 1. Pata matangazo mapya (Ads)
      fetchAdsWithCache();

      // 2. Pata bidhaa za kategoria iliyochaguliwa (ikiwa ipo)
      if (selectedCategory?.id) {
        fetchFeaturedLeafs(selectedCategory.id);
        fetchSubCategories(selectedCategory.id);
      }

      // 3. Pata bidhaa za subcategory iliyochaguliwa (ikiwa ipo)
      if (viewMode === 'subcategories' && selectedSubCategory?.id) {
        fetchLeafsForSub(selectedSubCategory.id);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [selectedCategory?.id, selectedSubCategory?.id, viewMode]); // ✅ Inategemea hali hizi

useEffect(() => {
  // 🔥 ANGALIA KAMA MTUMIAJI AMESIGNUP
  if (!session) {
    setShowLocationPrompt(false);
    return;
  }
  
  const locationAllowed = localStorage.getItem('location_allowed');
  
  if (location) {
    setShowLocationPrompt(false);
  } else if (locationAllowed) {
    setShowLocationPrompt(false);
  } else {
    setShowLocationPrompt(true);
  }
}, [location, locationError, locationLoading, session]);

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
    //fetchFeaturedLeafs(category.id);
    //fetchSubCategories(category.id);
  };

  const handleViewAll = () => setViewMode('subcategories');
  const handleBack = () => setViewMode('products');


const handleSubCategoryHover = (subCategory) => {
  setSelectedSubCategory(subCategory);
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

 if (dataLoading || sessionLoading) {
  return (
    <div className="dashboard-wrapper">
      <Header search={search} setSearch={setSearch} />
      {/* 🔥 BADILISHA HII: Ondoa div ya loading-container */}
      <SkeletonLayout />
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

{session && !location && showLocationPrompt && ReactDOM.createPortal(
  <div className="location-modal-overlay">
    <div className="location-modal">
      <div className="location-modal-icon">📍</div>
      <h2 className="location-modal-title">Allow Location Access</h2>
      <p className="location-modal-desc">We need your location to show products from stores near you. This helps you find the best deals in your area.</p>
      <div className="location-modal-actions">
        <button 
          className="location-modal-btn allow"
          onClick={() => {
  setShowLocationPrompt(false);
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        api.patch('/profile/', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        .then(() => {
          console.log("✅ Location saved to profile!");
          localStorage.setItem('location_allowed', 'true');
          window.location.reload();
        })
        .catch(err => {
          console.error("❌ Error saving location:", err);
          window.location.reload();
        });
      },
      (err) => {
        console.error("❌ Error getting location:", err);
        // 🔥 FALLBACK: Tumia IP Address kupata location
        fetch('https://ipapi.co/json/')
          .then(response => response.json())
          .then(data => {
            if (data.latitude && data.longitude) {
              return api.patch('/profile/', {
                latitude: data.latitude,
                longitude: data.longitude
              });
            }
            throw new Error('IP location not available');
          })
          .then(() => {
            console.log("✅ Location saved via IP!");
            localStorage.setItem('location_allowed', 'true');
            window.location.reload();
          })
          .catch(err => {
            console.error("❌ Error saving location via IP:", err);
            localStorage.setItem('location_allowed', 'true');
            window.location.reload();
          });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  } else {
    // 🔥 Browser haisupport GPS, tumia IP
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          return api.patch('/profile/', {
            latitude: data.latitude,
            longitude: data.longitude
          });
        }
        throw new Error('IP location not available');
      })
      .then(() => {
        console.log("✅ Location saved via IP!");
        localStorage.setItem('location_allowed', 'true');
        window.location.reload();
      })
      .catch(err => {
        console.error("❌ Error saving location:", err);
        localStorage.setItem('location_allowed', 'true');
        window.location.reload();
      });
  }
}}
        >
          Allow Now
        </button>
        <button 
          className="location-modal-btn cancel"
          onClick={() => setShowLocationPrompt(false)}
        >
          Not Now
        </button>
      </div>
    </div>
  </div>,
  document.body
)}

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

  {/* 1. SIDEBAR YA KATEGORIA (Kushoto) */}
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

  {/* 2. BANNER NA SLIDER (Kati) */}
  <div className="alibaba-mobile-content">
    <div className="category-slider-wrapper">
      {!search && categories.length > 0 && (
        <MobileCategorySlider 
          categories={categories}
          selectedCategory={selectedCategoryForComponents}
          onSelectCategory={(cat) => {
            if (cat.id === null) {
              setSelectedCategoryForComponents(null);
              setSelectedCategory(null);
              setFeaturedProducts([]);
              setSubCategories([]);
            } else {
              setSelectedCategoryForComponents(cat);
              setSelectedCategory(cat);
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

  {/* 3. RECENTLY VIEWED MINI (Kulia) - IKO NJE YA KOLAMU YA KATI! */}
  <div className="recently-viewed-mini">
    <Suspense fallback={<ComponentFallback />}>
      <RecentlyViewed 
        key={`mini-${i18n.language}`} 
        navigate={navigate}
        compact={true} 
      />
    </Suspense>
  </div>

</div>
          )}

<div className="components-wrapper">
  {/* 🔥 RECENTLY VIEWED - IONEKANE MOBILE TU (Imezungukwa na div) */}
<div className="mobile-only-recently-viewed">
  <Suspense fallback={<ComponentFallback />}>
    <RecentlyViewed key={i18n.language} navigate={navigate} />
  </Suspense>
</div>

 <Suspense fallback={<ComponentFallback />}>
    <NewArrivals 
      key={i18n.language}
      navigate={navigate}
      selectedCategory={selectedCategoryForComponents} 
    />
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
    <TopDeals 
      key={i18n.language}
      navigate={navigate}
      selectedCategory={selectedCategoryForComponents}
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
  <div className="content-header-actions">
    
    {/* 🔥 ONGEZA X YA KUFUNGA MEGA MENU */}
    <button 
      onClick={() => {
        setActiveMenu(null);
        setSelectedCategory(null); // Safisha kategoria iliyochaguliwa
      }}
      className="mega-menu-close-btn"
    >
      <X size={20} />
    </button>
  </div>
</div>
              
<div className="category-grid">

{viewMode === 'products' ? (
  <>
    {loadingLeafs ? (
      // ✅ SKELETON LOADING
      <>
        {[...Array(8)].map((_, idx) => (
          <div key={`skeleton-${idx}`} className="grid-item skeleton-item">
            <div className="image-circle skeleton-circle"></div>
            <p className="skeleton-text"></p>
          </div>
        ))}
      </>
    ) : featuredProducts.length > 0 ? (
      // ✅ DATA IPO
      featuredProducts.map((leaf) => (
        <div 
          key={leaf.id} 
          className="grid-item" 
          onClick={() => {
            try {
              const targetId = leaf.leaf_category_id || leaf.id;
              console.log(`🔍 [LeafClick] Attempting to navigate for leaf: ${leaf.name}, targetId: ${targetId}`);

              if (!targetId || targetId === 'undefined' || targetId === 'null' || targetId === '') {
                console.error("❌ [LeafClick] Invalid target ID detected:", targetId);
                return;
              }

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
              console.error("❌ [LeafClick] Unexpected error on featured leaf click:", error);
            }
          }}
        >
          <div className="image-circle">
            <img src={leaf.cover_image_url || placeholderImg} alt={leaf.name} />
          </div>
          <p className="grid-text">
            {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
          </p>
        </div>
      ))
    ) : (
      // ✅ EMPTY STATE
      <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
        <p style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>
          Hakuna bidhaa katika kategoria hii
        </p>
        <p style={{ fontSize: '14px', color: '#999' }}>
          Tafadhali chagua kategoria nyingine
        </p>
      </div>
    )}

    {/* See All - Onyesha tu kama kuna data */}
    {!loadingLeafs && featuredProducts.length > 0 && (
      <div onClick={handleViewAll} className="grid-item see-all-card">
        <div className="image-circle see-all-circle">
          <Plus size={30} color="#ff6a00" />
        </div>
        <p className="see-all-text">{t('see_all')}</p>
      </div>
    )}
  </>
) : (
  // ✅ KWA SUBCATEGORIES
  loadingLeafs ? (
    // Skeleton
    <>
      {[...Array(8)].map((_, idx) => (
        <div key={`skeleton-sub-${idx}`} className="grid-item skeleton-item">
          <div className="image-circle skeleton-circle"></div>
          <p className="skeleton-text"></p>
        </div>
      ))}
    </>
  ) : leafsForSub.length > 0 ? (
    leafsForSub.map((leaf) => (
      <div 
        key={leaf.id} 
        className="grid-item" 
        onClick={() => {
          try {
            const targetId = leaf.id || leaf.leaf_category_id;
            console.log(`🔍 [LeafClick] Attempting to navigate for sub-leaf: ${leaf.name}, targetId: ${targetId}`);

            if (!targetId || targetId === 'undefined' || targetId === 'null' || targetId === '') {
              console.error("❌ [LeafClick] Invalid target ID detected:", targetId);
              return;
            }

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
            console.error("❌ [LeafClick] Unexpected error on sub-leaf click:", error);
          }
        }}
      >
        <div className="image-circle">
          <img 
            src={leaf.cover_image_url || leaf.cover_image || placeholderImg}
            alt={leaf.name} 
          />
        </div>
        <p>
          {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
        </p>
      </div>
    ))
  ) : (
    // Empty state kwa subcategories
    <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
      <p style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>
        Hakuna bidhaa katika subcategory hii
      </p>
    </div>
  )
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
        <button className="mc-close-btn" onClick={() => setMobileMenuOpen(false)}>
          <span className="close-x">✕</span>
        </button>
      </div>

      {/* 2. BODY (Sidebar + Content) */}
      <div className="mc-body">
        
        {/* SIDEBAR (Kushoto) - Inabadilika kulingana na mobileActiveMenu */}
        <aside className="mc-sidebar">
          
          {mobileActiveMenu === 'subcategories' ? (
            <>
              <div 
                className="mc-sidebar-back"
                onClick={() => {
                  setSelectedSubCategory(null);       // ✅ UPDATE 1: Safisha subcategory
                  setMobileActiveMenu('categories');   // Badilisha menu ya mobile
                  setViewMode('products');             // ✅ UPDATE 2: Badilisha viewMode ili Desktop na Mobile zilingane
                  if (selectedCategory?.id) {
                    fetchFeaturedLeafs(selectedCategory.id);
                  }
                }}
                style={{ 
                  padding: '15px', 
                  cursor: 'pointer', 
                  color: '#ff6a00', 
                  fontWeight: 'bold',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ChevronLeft size={18} /> Back to Categories
              </div>

              {subCategories && subCategories.length > 0 ? (
                subCategories.map((sub) => (
                  <div 
                    key={sub.id} 
                    className={`mc-sidebar-item ${selectedSubCategory?.id === sub.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSubCategory(sub);
                      fetchLeafsForSub(sub.id);
                    }}
                  >
                    {i18n.language === 'sw' ? (sub.name_sw || sub.name) : sub.name}
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', color: '#999', textAlign: 'center' }}>
                  Hakuna Subcategories
                </div>
              )}
            </>
          ) : (
            categories.map((cat) => (
              <div 
                key={cat.id} 
                className={`mc-sidebar-item ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedCategoryForComponents(cat);
                  setMobileActiveMenu('categories');   // Reset mobile menu
                  setViewMode('products');             // ✅ UPDATE 2: Rudisha viewMode kwa products
                  fetchFeaturedLeafs(cat.id);          // Pakia data mpya
                }}
              >
                {getCategoryDisplayName(cat)}
              </div>
            ))
          )}
        </aside>

        {/* CONTENT (Kulia) */}
        <main className="mc-content">
          
          {/* SEHEMU YA 1: BIDHAA ZA CATEGORY/SUBCATEGORY */}
          <div className="mc-section">
            <h3 className="mc-section-title">
              {mobileActiveMenu === 'categories' ? 'Category Products' : 'Subcategory Products'}
            </h3>
            <div className="mc-recommendations-grid">
              {loadingLeafs ? (
                // SKELETON LOADING
                <>
                  {[...Array(6)].map((_, idx) => (
                    <div key={`mobile-skeleton-${idx}`} className="mc-recommendation-item skeleton-item">
                      <div className="mc-rec-image skeleton-circle"></div>
                      <p className="skeleton-text"></p>
                    </div>
                  ))}
                </>
              ) : mobileActiveMenu === 'categories' ? (
                // ✅ CATEGORY PRODUCTS
                featuredProducts && featuredProducts.length > 0 ? (
                  featuredProducts.slice(0, 9).map((leaf) => (
                    <div 
                      key={leaf.id} 
                      className="mc-recommendation-item"
                      onClick={() => {
                        handleLeafClick(leaf.leaf_category_id || leaf.id);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <div className="mc-rec-image">
                        <img src={leaf.cover_image_url || placeholderImg} alt={leaf.name} />
                      </div>
                      <p>{i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                    <p style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>
                      Hakuna bidhaa katika kategoria hii
                    </p>
                  </div>
                )
              ) : (
                // ✅ SUBCATEGORY PRODUCTS (HAPA NDIO DATA INAPAKIA)
                leafsForSub && leafsForSub.length > 0 ? (
                  leafsForSub.slice(0, 9).map((leaf) => (
                    <div 
                      key={leaf.id} 
                      className="mc-recommendation-item"
                      onClick={() => {
                        handleLeafClick(leaf.leaf_category_id || leaf.id);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <div className="mc-rec-image">
                        <img src={leaf.cover_image_url || placeholderImg} alt={leaf.name} />
                      </div>
                      <p>{i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                    <p style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>
                      Hakuna bidhaa katika subcategory hii
                    </p>
                  </div>
                )
              )}

              {/* ✅ SEE ALL BUTTON - Inaonekana TU kama mobileActiveMenu === 'categories' */}
              {mobileActiveMenu === 'categories' && !loadingLeafs && featuredProducts && featuredProducts.length > 0 && (
                <div 
                  className="mc-recommendation-item" 
                  onClick={() => {
                    setMobileActiveMenu('subcategories');     // Badilisha UI ya mobile
                    setViewMode('subcategories');             // ✅ UPDATE 3: Badilisha viewMode ili data ipakie!
                    setSelectedSubCategory(null);             // ✅ UPDATE 4: Safisha ili ipakie category nzima
                    if (selectedCategory?.id) {
                      fetchLeafsForSub(selectedCategory.id);  // Pakia data ya subcategory
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className="mc-rec-image" 
                    style={{ 
                      border: '2px dashed #ff6a00', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      backgroundColor: '#fff8f0' 
                    }}
                  >
                    <Plus size={28} color="#ff6a00" />
                  </div>
                  <p style={{ color: '#ff6a00', fontWeight: 'bold' }}>{t('see_all')}</p>
                </div>
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