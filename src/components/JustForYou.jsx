import React, { useEffect, useState, useMemo, useRef } from "react";
import api from "../axiosConfig";
import { Loader2, ChevronRight, RefreshCw, ArrowRight } from "lucide-react"; // 🔥 Ongeza ArrowRight!
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz"; // 🔥 IMPORT SAHIHI (SkeletonCardz)
//import "../JustForYou.css"; 

export default function JustForYou({ search = "", selectedCategory }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const navigate = useNavigate();

  // 🔥 Jitambulisha kama simu au desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

    const fetchJustForYou = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ordering: '-created_at',
        limit: 100 // 🔥 Vuta pool kubwa (100) ili upate nafasi ya kuchagua bila upendeleo
      };

      if (selectedCategory?.id) {
        params.parent_category = selectedCategory.id;
      }

      const response = await api.get('/products/', { params });

      if (isMounted.current) {
        const data = response.data.results || response.data || [];

        // 🔥 1. ONDOA TOP DEALS (Bidhaa zenye punguzo)
        const nonDeals = data.filter(p => {
          const price = parseFloat(p.price) || 0;
          const originalPrice = parseFloat(p.original_price) || 0;
          const isDiscounted = originalPrice > 0 && originalPrice < price;
          return !isDiscounted; // Weka bidhaa ambazo SI Top Deals
        });

        // 🔥 2. PANGANYA KWA KATEGORIA (Hakuna Upendeleo)
        const categoryMap = {};
        nonDeals.forEach(product => {
          const catName = product.category_name || 'Other';
          if (!categoryMap[catName]) {
            categoryMap[catName] = [];
          }
          categoryMap[catName].push(product);
        });

        // 🔥 3. CHAGUA KWA USAWA (Balanced Selection)
        
        const overallLimit = 100;  
        const categoryNames = Object.keys(categoryMap);
        
        // Kama kuna kategoria 4, kila kategoria itachukua 3 (12/4).
        // Kama kuna kategoria 1 tu, itachukua 12 tu (si zote 100).
        const maxPerCategory = Math.ceil(overallLimit / Math.max(categoryNames.length, 1));
        
        let finalProducts = [];
        
        categoryNames.forEach(catName => {
          const items = categoryMap[catName];
          // Chukua hadi maxPerCategory (au zote kama ni chache ya hapo)
          finalProducts.push(...items.slice(0, maxPerCategory));
        });

        // 🔥 4. KATA KAMA IMEZIDI LIMIT (Safety check)
        finalProducts = finalProducts.slice(0, overallLimit);

        // 🔥 5. CHANGANYA (Shuffle) - Ili isiwe na mpangilio wa kategoria
        for (let i = finalProducts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalProducts[i], finalProducts[j]] = [finalProducts[j], finalProducts[i]];
        }

        setProducts(finalProducts);
      }
    } catch (error) {
      console.error("Error:", error.message);
      if (isMounted.current) {
        setError(error.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchJustForYou();
    return () => { isMounted.current = false; };
  }, [selectedCategory, i18n.language]);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const searchLower = search.toLowerCase();
    return products.filter(item => 
      item.name?.toLowerCase().includes(searchLower)
    );
  }, [products, search]);

  const getCategoryName = () => {
    if (!selectedCategory) return '';
    return i18n.language === 'sw' 
      ? (selectedCategory.name_sw || selectedCategory.name) 
      : selectedCategory.name;
  };

  const handleCardClick = (item) => {
    const priorityId = item.id;
    const sectionName = encodeURIComponent(`${t('just_for_you')} ${selectedCategory && selectedCategory.id !== null ? `${t('in')} ${getCategoryName()}` : ''}`);
    const categoryId = selectedCategory?.id || '';
    const categoryName = encodeURIComponent(getCategoryName() || 'All');
    const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}&categoryId=${categoryId}&categoryName=${categoryName}`;
    window.open(url, '_blank');
  };



   // ============================================================
  // 🔥 RENDER HEADER (Imejumuishwa kwa pande zote)
  // ============================================================
   const renderHeader = () => (
    <div className="flex justify-between items-center px-3 py-2 mb-3 sm:px-2.5 sm:py-1.5 sm:mb-2 md:px-5 md:py-3 md:mb-5 bg-[#fff7ed] dark:bg-[#1e293b] dark:border-b dark:border-[#334155] rounded-t-xl text-black dark:text-white">
      <div className="flex-1 flex justify-between items-center w-full">
        <div className="flex flex-col">
          <h2 className="font-bold m-0 text-black dark:text-white leading-tight text-sm sm:text-lg md:text-2xl md:leading-normal">
            {t('just_for_you')}
          </h2>
          <p className="m-0 text-[#888] dark:text-[#94a3b8] leading-tight text-[10px] sm:text-[13px] md:text-sm mt-0.5 md:mt-1">
            {t('curated_picks')}
          </p>
        </div>
        
        <div className="flex items-center">
          <button 
            className="bg-none border-none cursor-pointer flex items-center justify-center text-black dark:text-white p-1 transition-transform hover:translate-x-1 hover:text-[#f97316] active:scale-95"
            onClick={() => {
              const url = '/products?section=just-for-you'; 
              if (window.innerWidth > 768) {
                window.open(url, '_blank'); 
              } else {
                window.location.href = url; 
              }
            }}
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
  
  
  // ============================================================
  // 🔥 SKELETON LOADING - Inaonyesha skeleton cards wakati data inapakia
  // ============================================================
  if (loading) {
    return (
   <section className="relative w-full bg-white dark:bg-[#1e293b] border-y border-[#e5e7eb] dark:border-[#334155] box-border overflow-x-hidden pt-4 mt-0 p-3 pb-[55px] rounded-lg my-0.5 md:p-4 md:px-0 md:rounded-2xl md:my-2.5">        
        {renderHeader()}

        {/* 🔥 SKELETON GRID - Inaonyesha skeleton 8 kwanza */}
       <div className="grid w-full box-border grid-cols-2 gap-2.5 px-1 md:grid-cols-4 md:gap-3.5 md:px-2 lg:grid-cols-6 lg:gap-4 lg:px-4 xl:gap-5">          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCardz key={`skeleton-${index}`} /> 
          ))}
        </div>
      </section>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
 if (error) {
    return (
      <div className="text-center py-10 px-5 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl m-5">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm md:text-base font-medium mb-4">
            Oops! Hatukuweza kupakia bidhaa. Tafadhali angalia mtandao wako.
          </p>
          <button 
            className="flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55a00] text-white border-none px-5 py-2 rounded-[30px] text-sm font-semibold cursor-pointer transition-all mx-auto hover:-translate-y-0.5 hover:shadow-md" 
            onClick={() => fetchJustForYou()}
          >
            <RefreshCw size={16} /> Jaribu tena
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // SUCCESS STATE - Onyesha bidhaa
  // ============================================================
  return (
    <section className="relative w-full bg-white dark:bg-[#1e293b] mb-8 border-y border-[#e5e7eb] dark:border-[#334155] box-border overflow-x-hidden pt-4 mt-0 p-3 pb-[55px] rounded-lg my-0.5 md:p-4 md:px-0 md:rounded-2xl md:my-2.5">
      
           {renderHeader()}

     <div className="grid w-full box-border grid-cols-2 gap-2.5 px-1 md:grid-cols-4 md:gap-3.5 md:px-2 lg:grid-cols-6 lg:gap-4 lg:px-4 xl:gap-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
          <DashboardCard 
  key={item.id}
  image={item.cover_image_url || item.cover_image}
  // title={item.name}
  price={item.price}
  originalPrice={item.original_price}
  isMobile={isMobile}
  moq={item.moq}
  subtitle={item.store_address}
  
  // 🔥 BADILISHA HAPA CHINI!
  categoryName={
    i18n.language === 'sw' 
      ? (item.leaf_category_name_sw || item.leaf_category_name || item.category_name) 
      : (item.leaf_category_name || item.category_name)
  }

  isTopDeal={true}
  views={item.views}
  onClick={() => handleCardClick(item)}
>
  <p className="text-xs leading-[1.4] text-gray-500 dark:text-gray-400 mt-0.5 mb-0.5 line-clamp-3">
  {item.description || "Hakuna maelezo"}
</p>
</DashboardCard>
          ))
        ) : (
           <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl overflow-hidden w-full flex flex-col items-center justify-center p-4 md:p-5 box-border transition-all col-span-full min-h-[200px] md:min-h-[300px] text-black dark:text-white">
            <div className="w-full h-[120px] md:h-[160px] bg-gray-100 dark:bg-[#0f172a] rounded-lg mb-4 animate-pulse"></div>
             <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs md:text-sm font-semibold text-black dark:text-white m-0">
                Hakuna bidhaa katika {selectedCategory?.name || 'kategoria hii'}.
              </p>
              <button 
                className="flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55a00] text-white border-none px-4 py-1.5 md:px-5 md:py-2 rounded-[30px] text-xs md:text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95" 
                onClick={() => fetchJustForYou()}
              >
                <RefreshCw size={14} /> Jaribu tena
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}