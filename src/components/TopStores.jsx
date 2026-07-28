import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Factory } from "lucide-react";
import api from "../axiosConfig";
import DashboardCard from "./DashboardCard";
import { useTranslation } from 'react-i18next';
import '../TopStores.css';

export default function TopStores({ navigate }) {
  const { t, i18n } = useTranslation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchTopStores = async () => {
      try {
        setLoading(true);
        const response = await api.get('/stores/', { params: { limit: 10 } });
        const storesData = response.data.results || response.data || [];
        setStores(storesData);
      } catch (error) {
        console.error("Error fetching stores:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopStores();
  }, [i18n.language]);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      setTimeout(checkScrollPosition, 100);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [stores]);

  if (loading) return null;
  if (stores.length === 0) return null;

  return (
    <div className="top-stores-main-wrapper">
      
      {/* Header Section - Kitufe kimeondolewa! */}
      <div className="ts-header">
        <div className="ts-header-left">
          <div className="ts-title-group">
            <Factory className="ts-factory-icon" />
            <h2 className="ts-title">{t('top_suppliers')}</h2>
          </div>
          <p className="ts-subtitle">{t('verified_wholesale_stores')}</p>
        </div>
      </div>

      {/* ✅ Layout Moja - Inabadilika automatically kwa CSS (Media Queries)! */}
      <div className="ts-desktop-wrapper">
        {showLeftArrow && (
          <button className="ts-arrow-btn ts-arrow-left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div ref={scrollContainerRef} className="ts-scroll-wrapper hide-scrollbar">
          {stores.map((store) => {
            let officeImg = 'https://via.placeholder.com/300x150?text=Verified+Store';
            try {
              if (store.office_images) {
                const images = typeof store.office_images === 'string' ? JSON.parse(store.office_images) : store.office_images;
                officeImg = Array.isArray(images) ? images.find(img => img !== null) : officeImg;
              }
            } catch (e) { officeImg = officeImg; }

            return (
              <div key={store.id} className="ts-card-wrapper">
                <DashboardCard 
                  image={officeImg}
                  logo={store.store_logo}
                  title={store.store_name}
                  subtitle={
                    store.category?.name 
                    ? `${store.category.name} • ${store.city}` 
                    : `${store.business_type} • ${store.city}`
                  }
                  isVerified={store.is_verified}
                  businessType={store.business_type}
                  moq={store.moq}
                  rating={store.average_rating}
                  isStore={true}
                  /* 🔥 TUMEONDOA KABISA `isMobile={isMobile}` HAPA! */
                  onClick={() => {
                    const storeData = {
                      id: store.id,
                      name: store.store_name,
                      categoryId: store.category_id,
                      city: store.city,
                      type: store.business_type
                    };
                    sessionStorage.setItem('selectedStore', JSON.stringify(storeData));
                    window.open(`/stores/${store.id}`, '_blank');
                  }}
                />
              </div>
            );
          })}
        </div>
        
        {showRightArrow && (
          <button className="ts-arrow-btn ts-arrow-right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}