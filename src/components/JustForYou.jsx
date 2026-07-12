// src/components/JustForYou.jsx (Refactored - No Inline CSS & No isMobile in Grid)
import React, { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "../supabaseClient";
import { Loader2, ChevronRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import DashboardCard from "./DashboardCard";
import "../JustForYou.css"; 

export default function JustForYou({ handleAction, search = "", selectedCategory, isMobile }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const navigate = useNavigate();

  const fetchJustForYou = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from("products_engines")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (selectedCategory?.id) {
        query = query.eq("parent_category_id", selectedCategory.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      if (isMounted.current) {
        setProducts(data || []);
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

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={40} color="#ff6600" />
      </div>
    );
  }

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
  
  const getCategoryName = () => {
    if (!selectedCategory) return '';
    return i18n.language === 'sw' 
      ? (selectedCategory.name_sw || selectedCategory.name) 
      : selectedCategory.name;
  };

  // Logic ya kuunda URL kwa desktop
  const handleCardClick = (item) => {
    const priorityId = item.id;
    const sectionName = encodeURIComponent(`${t('just_for_you')} ${selectedCategory && selectedCategory.id !== null ? `${t('in')} ${getCategoryName()}` : ''}`);
    const categoryId = selectedCategory?.id || '';
    const categoryName = encodeURIComponent(getCategoryName() || 'All');
    const url = `/products?priorityId=${priorityId}&sectionName=${sectionName}&categoryId=${categoryId}&categoryName=${categoryName}`;
    window.open(url, '_blank');
  };

  return (
    <section className="just-for-you-container">
      
      {/* Header - Responsive via CSS Media Queries */}
      <div className="section-header">
        <div className="header-main">
          <div className="header-text-group">
            <h2 className="just-title">
              {selectedCategory && selectedCategory.id !== null ? (
                `${t('just_for_you')} ${t('in')} ${getCategoryName()}`
              ) : (
                t('just_for_you')
              )}
            </h2>
            <p className="just-subtitle">
              {selectedCategory && selectedCategory.id !== null ? (
                `${t('curated_picks')} ${t('in')} ${getCategoryName()}`
              ) : (
                t('curated_picks')
              )}
            </p>
          </div>
        </div>
        
        {filteredProducts.length > 3 && (
          <button 
            className="view-all-just" 
            onClick={() => navigate("/products", { 
              state: { 
                sectionName: t('just_for_you'),
                categoryId: selectedCategory?.id 
              } 
            })}
          >
            <span>{t('view_all')}</span>
            <ChevronRight size={isMobile ? 12 : 16} />
          </button>
        )}
      </div>

      {/* ✅ GRID MOJA - INAJIPANGA KWA CSS MEDIA QUERIES (Hakuna isMobile) */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <DashboardCard 
              key={item.id}
              image={item.cover_image}
              title={item.name}
              price={item.price}
              originalPrice={item.original_price}
              isMobile={isMobile} // Hii bado inahitajika kwa styling ndani ya card
              moq={item.moq}
              subtitle={item.store_address}
              categoryName={item.category_name}
              isTopDeal={true}
              views={item.views}
              onClick={() => handleCardClick(item)}
            />
          ))
        ) : (
          /* ✅ EMPTY STATE CARD - Inaiga DashboardCard yenye Try Again */
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