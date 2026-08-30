import React, { useEffect, useState, useMemo, useRef } from "react";
import api from "../axiosConfig";
import { Loader2, ChevronRight, RefreshCw, ArrowRight } from "lucide-react"; // 🔥 Ongeza ArrowRight!
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import DashboardCard from "./DashboardCard";
import SkeletonCardz from "./SkeletonCardz"; // 🔥 IMPORT SAHIHI (SkeletonCardz)
import "../JustForYou.css"; 

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
    <div className="section-header">
      <div className="header-main">
        <div className="header-text-group">
          <h2 className="just-title">
            {t('just_for_you')}
          </h2>
          
          {/* ✅ ONGEZA SUBTITLE HAPA CHINI YA TITLE */}
          <p className="just-subtitle">
            {t('curated_picks')}
          </p>
        </div>
        
        {/* 🔥 MSHALE WA KULIA */}
        <div className="header-right-arrow">
          <button 
            className="jfy-arrow-link-btn"
            onClick={() => {
              const url = '/products?section=just-for-you'; 
              
              // ✅ MUHIMU: Angalia kama ni Desktop (>768px), fungua tab mpya.
              // Ikiwa ni Mobile, fungua kwenye tab hii hii (kama kawaida).
              if (window.innerWidth > 768) {
                window.open(url, '_blank'); 
              } else {
                window.location.href = url; 
              }
            }}
          >
            <ArrowRight size={24} />
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
      <section className="just-for-you-container">
        
        {renderHeader()}

        {/* 🔥 SKELETON GRID - Inaonyesha skeleton 8 kwanza */}
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, index) => (
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
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">
            Oops! Hatukuweza kupakia bidhaa. Tafadhali angalia mtandao wako.
          </p>
          <button 
            className="error-retry-btn" 
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
    <section className="just-for-you-container">
      
           {renderHeader()}

      <div className="product-grid">
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
  {/* 🔥 HAPA NDIPO DESCRIPTION ITAONEKANA (Kwenye JustForYou TU) */}
  <p className="just-for-you-desc">
    {item.description || "Hakuna maelezo"}
  </p>
</DashboardCard>
          ))
        ) : (
          <div className="empty-state-card">
            <div className="empty-state-image"></div>
            <div className="empty-state-info">
              <p className="empty-state-title">
                Hakuna bidhaa katika {selectedCategory?.name || 'kategoria hii'}.
              </p>
              <button 
                className="empty-state-btn" 
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