import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import "../Dashboard.css";
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
  PenTool, Factory, HardHat, Warehouse, Plus, ChevronLeft , X 
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
    business_name: "Welome Skyfall",
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
  }, [selectedCategory?.id, selectedSubCategory?.id, viewMode]); 

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
  <div className="flex items-center justify-center p-5">
    <div className="flex gap-1">
      <div className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:0ms]"></div>
      <div className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:150ms]"></div>
      <div className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:300ms]"></div>
    </div>
  </div>
);

 if (dataLoading || sessionLoading) {
  return (
    <div className="flex flex-col bg-bgPrimary min-h-screen relative">
      <Header search={search} setSearch={setSearch} />
      <SkeletonLayout />
    </div>
  );
}

return (


<div key={i18n.language} className="flex flex-col min-h-screen bg-white dark:bg-black relative">

{/* Wrapper hii inafanya Header iwe fixed kwenye simu, sticky kwenye desktop */}
<div className="fixed md:sticky top-0 left-0 w-full z-[9999]">
  <Header search={search} setSearch={setSearch} />
</div> 
      {/* ✅ Content ina scroll yake yenyewe */}
  <div className="flex-1 w-full">

<div className="w-full max-w-[1400px] mx-auto px-1 pt-[70px] md:pt-0 lg:px-1 lg:pt-6 pb-6">

            {search && (
            <div className="py-4">
              <h3 className="mb-4 text-[1.1rem] text-textPrimary dark:text-white">{t('looking_for')}: {search}</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5
               md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]
                md:gap-3.5 lg:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]
                 lg:gap-4.5 bg-bgPrimary"> 
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
               {/* 1. padding top ni hapa */}

    {!search && (

    <div className="block w-full mt-1 lg:mt-4.5 lg:grid
       lg:grid-cols-[250px_1fr_280px] lg:gap-4 lg:h-[350px] pl-4">

{/* 1. SIDEBAR YA KATEGORIA (Kushoto) */}
<aside className="hidden lg:flex lg:flex-col h-full max-h-full overflow-hidden bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
  
  {/* HEADER YA SIDEBAR */}
  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
    {/* Star icon kama ilivyo kwenye picha (ina outline) */}
    <Star size={18} className="text-gray-600 dark:text-gray-300" /> 
    <span className="text-base font-bold text-gray-900 dark:text-white tracking-wide">
      Categories for you
    </span>
  </div>

  {/* LIST YA KATEGORIA */}
  <ul className="list-none m-0 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
    {categories.map(cat => (
      <li 
        key={cat.id} 
        onClick={() => handleCategoryClick(cat)}
        className="flex justify-between items-center px-5 py-3.5 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        {/* Upande wa kushoto: Icon na Jina */}
        <div className="flex items-center gap-3.5 text-gray-800 dark:text-gray-200">
          {getIcon(cat.icon_name)}
          <span className="text-[15px] font-medium">{getCategoryDisplayName(cat)}</span>
        </div>
        
        {/* Upande wa kulia: Chevron (Mshale) unaoonekana kila wakati */}
        <ChevronRight size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />
      </li>
    ))}
  </ul>
</aside>

  {/* 2. BANNER NA SLIDER (Kati) */}
  <div className="h-full">
    <div className="block bg-white dark:bg-black w-full lg:hidden">
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

    <div className="w-full overflow-hidden m-0 p-0 leading-none">
    <div className="relative w-full aspect-[16/9] md:aspect-[16/7] lg:aspect-auto lg:h-[350px] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] overflow-hidden rounded-xl max-h-[350px]">   
      {activeAd && isVideoAd(activeAd) ? (
  <video
    src={activeAd.media_url}
    autoPlay
    muted
    playsInline
    onEnded={() => {
      if (cachedAds.length) setCurrentAdIndex((prev) => (prev + 1) % cachedAds.length);
    }}
    className="w-full h-full object-cover object-center block bg-[#1a1a2e]"
  />
) : (
  activeAd && (
    <img
      src={activeAd.media_url}
      className="w-full h-full object-cover object-center block bg-[#1a1a2e]"
      alt="promo"
      loading="lazy"
    />
  )
)}


{activeAd && (
  // HAPA: Nimebadilisha pl-6 kuwa pl-4 (nafasi ndogo kushoto) na kuongeza gradient nyeusi zaidi kwa ajili ya kusomeka
  <div className="absolute inset-0 flex flex-col justify-center items-start pl-4 pr-3 py-4 sm:pl-10 sm:pr-8 lg:pl-12 lg:pr-10 text-white bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none">
    
    {/* 1. SPONSORED BADGE - Imeongezwa ukubwa kidogo */}
    <span className="bg-brand-orange px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold w-fit mb-2 tracking-wide uppercase shadow-sm">
      {t('sponsored')}
    </span>

    {/* 2. TITLE - Imeongezwa ukubwa kuwa text-lg (18px) kwa simu */}
    <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold leading-tight mb-1.5 sm:mb-2 max-w-[95%] sm:max-w-[80%] drop-shadow-md">
      {activeAd.business_name}
    </h2>

    {/* 3. DESCRIPTION - Imeongezwa ukubwa kuwa text-xs (12px) kwa simu */}
    <p className="text-xs sm:text-sm text-gray-100 max-w-[95%] sm:max-w-[75%] leading-snug sm:leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3 drop-shadow-sm font-medium">
      {activeAd.description}
    </p>

    {/* 4. BUTTON - Imeongezwa ukubwa kidogo kwa simu */}
    <button 
      className="
        bg-[#FF6A00] hover:bg-[#e55a00] 
        text-white font-bold 
        px-5 py-2.5 sm:px-6 sm:py-2.5 
        rounded-full w-fit 
        pointer-events-auto 
        transition-all duration-300 ease-in-out 
        shadow-[0_4px_10px_rgba(255,106,0,0.4)] 
        hover:shadow-[0_6px_20px_rgba(255,106,0,0.6)] 
        hover:-translate-y-0.5 
        active:translate-y-0 active:scale-95 
        text-sm sm:text-base
        flex items-center gap-1.5
      "
      onClick={() => {
        if (window.innerWidth > 1024) {
          window.open(`/store/${activeAd.store_id}`, '_blank');
        } else {
          navigate(`/store/${activeAd.store_id}`);
        }
      }}
    >
      {t('source_now')} <span>→</span>
    </button>

  </div>
)}


      </div>
    </div>
  </div>

 {/* 3. RECENTLY VIEWED MINI (Kulia) - Imepewa muonekano wa Card */}
<div className="hidden lg:flex lg:flex-col h-full bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 p-3 overflow-hidden shadow-sm">
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

<div className="flex flex-col pt-4">
    {/* 🔥 RECENTLY VIEWED - IONEKANE MOBILE TU (Imezungukwa na div) */}
<div className="block lg:hidden">
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

      <div className="block mt-0 hidden lg:block">
            <Footer />
          </div>

        </div>
      </div>

   <div className="hidden max-lg:block relative z-50">
        <BottomNav 
          session={session} 
          activeMenu={activeMenu}
          onOpenCategories={() => setMobileMenuOpen(true)} 
        />
      </div>

{activeMenu === 'categories' && selectedCategory && ReactDOM.createPortal(

  <div 
  className="fixed inset-0 top-[105px] z-[99999] bg-black/60 flex justify-center items-start"
  onMouseEnter={() => handleMouseEnter('categories')}
  onMouseLeave={handleMouseLeave}
>
  
<div className="w-full h-full max-h-[calc(100vh-180px)] bg-white dark:bg-black border-b border-gray-200 dark:border-[#1f1f1f] overflow-hidden flex shadow-2xl">
        {/* ========== SIDEBAR (KUSHOTO) ========== */}
      <aside className="w-[250px] shrink-0 bg-gray-50 dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#1f1f1f] overflow-y-auto py-2">
        {viewMode === 'products' ? (
          categories.map((cat) => (
            <div 
              key={cat.id} 
              onMouseEnter={() => setSelectedCategory(cat)}
              className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer text-[13px] leading-tight border-b border-gray-100 dark:border-[#1a1a1a] transition-all duration-150 ${
                selectedCategory?.id === cat.id 
                  ? 'bg-white dark:bg-[#0a0a0a] text-brand-orange font-bold border-l-[3px] border-brand-orange' 
                  : 'text-black dark:text-white hover:bg-white dark:hover:bg-[#0a0a0a]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0">{getIcon(cat.icon_name)}</span>
                <span className="truncate">{getCategoryDisplayName(cat)}</span>
              </div>
              <ChevronRight size={14} className="shrink-0 text-gray-400" />
            </div>
          ))
        ) : (
          <>
            <div 
              onClick={handleBack} 
              className="flex items-center gap-2 px-3.5 py-3 cursor-pointer text-[13px] font-bold text-brand-orange border-b border-gray-100 dark:border-[#1a1a1a] bg-white dark:bg-black"
            >
              <ChevronLeft size={16} /> {t('back_to')} {getCategoryDisplayName(selectedCategory)}
            </div>
            {subCategories.map((sub) => (
              <div 
                key={sub.id} 
                onMouseEnter={() => handleSubCategoryHover(sub)} 
                className={`px-3.5 py-2.5 cursor-pointer text-[13px] leading-tight border-b border-gray-100 dark:border-[#1a1a1a] transition-all duration-150 ${
                  selectedSubCategory?.id === sub.id 
                    ? 'bg-white dark:bg-[#0a0a0a] text-brand-orange font-bold border-l-[3px] border-brand-orange' 
                    : 'text-black dark:text-white hover:bg-white dark:hover:bg-[#0a0a0a]'
                }`}
              >
                {i18n.language === 'sw' ? (sub.name_sw || sub.name) : sub.name}
              </div>
            ))}
          </>
        )}
      </aside>

      {/* ========== CONTENT (KULIA) ========== */}
      <main className="flex-1 min-w-0 overflow-y-auto p-5 lg:p-6 bg-white dark:bg-black">
        
        {/* HEADER YA CONTENT */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-[#1a1a1a]">
          <h3 className="text-base lg:text-lg font-extrabold text-black dark:text-white m-0 truncate pr-3">
            {viewMode === 'products' 
              ? `${t('top_categories')}: ${getCategoryDisplayName(selectedCategory)}` 
              : (i18n.language === 'sw' ? (selectedSubCategory?.name_sw || selectedSubCategory?.name) : selectedSubCategory?.name)}
          </h3>
          
          <button 
            onClick={() => {
              setActiveMenu(null);
              setSelectedCategory(null);
            }}
            className="w-9 h-9 shrink-0 rounded-full border border-gray-200 dark:border-[#1f1f1f] flex items-center justify-center cursor-pointer text-gray-700 dark:text-white transition-all duration-200 hover:bg-brand-orange hover:border-brand-orange hover:text-white hover:scale-105 active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* ========== CATEGORY GRID ========== */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 sm:gap-3">
          
          {viewMode === 'products' ? (
            <>
              {/* 1. SKELETON LOADING */}
              {loadingLeafs ? (
                [...Array(8)].map((_, idx) => (
                  <div key={`skeleton-${idx}`} className="flex flex-col items-center gap-1.5 animate-pulse">
                    <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full bg-gray-200 dark:bg-[#1a1a1a]"></div>
                    <div className="h-3 w-14 bg-gray-200 dark:bg-[#1a1a1a] rounded"></div>
                  </div>
                ))
              ) : featuredProducts.length > 0 ? (
                // 2. DATA IPO
                <>
                  {featuredProducts.map((leaf) => (
                    <div 
                      key={leaf.id} 
                      onClick={() => {
                        // ... code yako ya onClick ...
                      }}
                      className="flex flex-col items-center text-center cursor-pointer p-1 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-[#0a0a0a]"
                    >
                      <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] mb-1.5 flex items-center justify-center shrink-0">
                        <img src={leaf.cover_image_url || placeholderImg} alt={leaf.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[11px] sm:text-xs text-black dark:text-white m-0 leading-tight line-clamp-2 w-full">
                        {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
                      </p>
                    </div>
                  ))}

                  {/* 3. SEE ALL CARD */}
                  <div 
                    onClick={handleViewAll} 
                    className="flex flex-col items-center text-center cursor-pointer p-1 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-[#0a0a0a]"
                  >
                    <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full border-2 border-dashed border-brand-orange bg-orange-50 dark:bg-[#1a1000] mb-1.5 flex items-center justify-center shrink-0">
                      <Plus size={26} className="text-brand-orange" />
                    </div>
                    <p className="text-[11px] sm:text-xs text-brand-orange font-bold m-0">{t('see_all')}</p>
                  </div>
                </>
              ) : (
                // 4. EMPTY STATE
                <div className="col-span-full text-center py-10">
                  <div className="text-5xl mb-3">📦</div>
                  <p className="text-base font-bold text-black dark:text-white m-0">Tap a category to browse its products.</p>
                  <p className="text-sm text-gray-500 mt-1">Tafadhali chagua kategoria nyingine</p>
                </div>
              )}
            </>
          ) : (
            // ========== SUBCATEGORIES VIEW ==========
            <>
              {loadingLeafs ? (
                [...Array(8)].map((_, idx) => (
                  <div key={`skeleton-sub-${idx}`} className="flex flex-col items-center gap-1.5 animate-pulse">
                    <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full bg-gray-200 dark:bg-[#1a1a1a]"></div>
                    <div className="h-3 w-14 bg-gray-200 dark:bg-[#1a1a1a] rounded"></div>
                  </div>
                ))
              ) : leafsForSub.length > 0 ? (
                leafsForSub.map((leaf) => (
                  <div 
                    key={leaf.id} 
                    onClick={() => {
                      // ... code yako ya onClick ...
                    }}
                    className="flex flex-col items-center text-center cursor-pointer p-1 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-[#0a0a0a]"
                  >
                    <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] mb-1.5 flex items-center justify-center shrink-0">
                      <img src={leaf.cover_image_url || leaf.cover_image || placeholderImg} alt={leaf.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] sm:text-xs text-black dark:text-white m-0 leading-tight line-clamp-2 w-full">
                      {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <div className="text-5xl mb-3">📦</div>
                  <p className="text-base font-bold text-black dark:text-white m-0">Tap a subcategory to browse its products.</p>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  </div>,
  document.body
)}

{mobileMenuOpen && ReactDOM.createPortal(
  <div 
    className="fixed inset-0 bg-black/60 z-[99999] flex justify-center items-end"
    onClick={() => setMobileMenuOpen(false)}
  >
    <div 
      className="w-full h-full bg-white dark:bg-[#0a0a0a] flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between px-3 h-14 bg-white dark:bg-black border-b border-gray-200 dark:border-[#1f1f1f] shrink-0">
        <button 
          className="bg-transparent border-none cursor-pointer text-gray-800 dark:text-white p-1.5 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
          onClick={() => setMobileMenuOpen(false)}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-base font-bold text-black dark:text-white m-0 flex-1 text-center truncate">
          {t('categories')}
        </h2>
        <button 
          className="bg-transparent border-none cursor-pointer text-gray-800 dark:text-white p-1.5 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-xl font-bold"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>
      </div>

            {/* ========== BODY ========== */}
      <div className="flex flex-row flex-1 w-full overflow-hidden relative">
        
        {/* SIDEBAR (KUSHOTO) */}
        <aside className="w-[90px] min-w-[90px] max-w-[90px] bg-[#fafafa] dark:bg-[#0a0a0a] overflow-y-auto border-r border-gray-200 dark:border-[#1f1f1f] py-1 shrink-0 relative z-10">
          
          {mobileActiveMenu === 'subcategories' ? (
            <>
              <div 
                onClick={() => {
                  setSelectedSubCategory(null);
                  setMobileActiveMenu('categories');
                  setViewMode('products');
                  if (selectedCategory?.id) {
                    fetchFeaturedLeafs(selectedCategory.id);
                  }
                }}
                className="px-2 py-3 cursor-pointer text-brand-orange font-bold border-b border-gray-200 dark:border-[#1f1f1f] flex items-center gap-1.5 text-[11px] leading-tight"
              >
                <ChevronLeft size={14} className="shrink-0" /> 
                <span>Back</span>
              </div>

              {subCategories && subCategories.length > 0 ? (
                subCategories.map((sub) => (
                  <div 
                    key={sub.id} 
                    onClick={() => {
                      setSelectedSubCategory(sub);
                      fetchLeafsForSub(sub.id);
                    }}
                    className={`px-2 py-2.5 text-[11px] cursor-pointer text-left leading-tight transition-colors ${
                      selectedSubCategory?.id === sub.id 
                        ? 'text-brand-orange font-bold border-l-[3px] border-brand-orange bg-white dark:bg-black' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black'
                    }`}
                  >
                    {i18n.language === 'sw' ? (sub.name_sw || sub.name) : sub.name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-400 text-center text-[10px]">Hakuna</div>
              )}
            </>
          ) : (
            categories.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedCategoryForComponents(cat);
                  setMobileActiveMenu('categories');
                  setViewMode('products');
                  fetchFeaturedLeafs(cat.id);
                }}
                className={`px-2 py-2.5 text-[11px] cursor-pointer text-left leading-tight transition-colors ${
                  selectedCategory?.id === cat.id 
                    ? 'text-brand-orange font-bold border-l-[3px] border-brand-orange bg-white dark:bg-black' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black'
                }`}
              >
                {getCategoryDisplayName(cat)}
              </div>
            ))
          )}
        </aside>

        {/* CONTENT (KULIA) */}
        {/* 🔥 Tumeongeza px-4 (padding kushoto na kulia) na kuondoa kabisa left-4 */}
        <main className="flex-1 min-w-0 overflow-y-auto px-1 py-1 bg-white dark:bg-black box-border relative z-0 ml-1">
          
          {/* TITLE */}
          <h3 className="text-[13px] font-bold text-black dark:text-white m-0 mb-3 text-left">
            {mobileActiveMenu === 'categories' ? 'Category Products' : 'Subcategory Products'}
          </h3>
          
          {/* GRID YA BIDHAA */}
          {/* 🔥 Tumebadilisha gap-3 kuwa gap-x-2 (usawa) na gap-y-4 (wima) */}
          <div className="grid grid-cols-4 gap-x-1 gap-y-1 w-full">
            
            {loadingLeafs ? (
              [...Array(6)].map((_, idx) => (
                <div key={`mobile-skeleton-${idx}`} className="flex flex-col items-center gap-1.5 animate-pulse min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-[#1a1a1a] shrink-0"></div>
                  <div className="h-2.5 w-full max-w-[48px] bg-gray-200 dark:bg-[#1a1a1a] rounded"></div>
                </div>
              ))
            ) : mobileActiveMenu === 'categories' ? (
              featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 9).map((leaf) => (
                  <div 
                    key={leaf.id} 
                    onClick={() => {
                      handleLeafClick(leaf.leaf_category_id || leaf.id);
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center text-center cursor-pointer w-full min-w-0"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] mb-1.5 flex items-center justify-center shrink-0">
                      <img src={leaf.cover_image_url || placeholderImg} alt={leaf.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[9px] text-gray-700 dark:text-white m-0 leading-tight line-clamp-2 w-full break-words">
                      {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <div className="text-4xl mb-3 ml-8">📦</div>
                  <p className="text-sm font-bold text-black dark:text-white m-0 px-8">Tap a category to browse its products.</p>
                </div>
              )
            ) : (
              leafsForSub && leafsForSub.length > 0 ? (
                leafsForSub.slice(0, 9).map((leaf) => (
                  <div 
                    key={leaf.id} 
                    onClick={() => {
                      handleLeafClick(leaf.leaf_category_id || leaf.id);
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center text-center cursor-pointer w-full min-w-0"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] mb-1.5 flex items-center justify-center shrink-0">
                      <img src={leaf.cover_image_url || placeholderImg} alt={leaf.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[9px] text-gray-700 dark:text-white m-0 leading-tight line-clamp-2 w-full break-words">
                      {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <div className="text-4xl mb-3 ml-8">📦</div>
                  <p className="text-sm font-bold text-black dark:text-white m-0 px-8">Hakuna bidhaa katika subcategory hii</p>
                </div>
              )
            )}

            {/* SEE ALL BUTTON */}
            {mobileActiveMenu === 'categories' && !loadingLeafs && featuredProducts && featuredProducts.length > 0 && (
              <div 
                onClick={() => {
                  setMobileActiveMenu('subcategories');
                  setViewMode('subcategories');
                  setSelectedSubCategory(null);
                  if (selectedCategory?.id) {
                    fetchLeafsForSub(selectedCategory.id);
                  }
                }}
                className="flex flex-col items-center text-center cursor-pointer w-full min-w-0"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1.5 border-2 border-dashed border-brand-orange bg-orange-50 dark:bg-[#1a1000] shrink-0">
                  <Plus size={22} className="text-brand-orange" />
                </div>
                <p className="text-[9px] text-brand-orange font-bold m-0 line-clamp-2">{t('see_all')}</p>
              </div>
            )}
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