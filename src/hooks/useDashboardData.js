// src/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import api from '../axiosConfig';

export const useDashboardData = () => {
  const [data, setData] = useState({
    categories: [],
    trendingProducts: [],
    ads: [],
    featuredProducts: [],
    subCategories: [],
    leafsForSub: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // 🔥 PATA TOKEN - kama hakuna, usitume ombi la 401!
        const token = localStorage.getItem("access_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 🔥 FETCH ZOTE KWA PAMOJA
        const [
          categoriesRes,
          trendingRes,
          adsRes,
          featuredRes,
          subCategoriesRes
        ] = await Promise.all([
          api.get('/categories/'), // Hii inaweza kuwa public!
          api.get('/products/', {
            params: { is_approved: true, ordering: '-views', limit: 8 },
            headers // Tuma header ikiwa token ipo
          }),
          api.get('/advertisements/', {
            params: { status: 'active' },
            headers // Tuma header ikiwa token ipo
          }),
          api.get('/products/', {
            params: { has_cover_image: true, limit: 50 },
            headers
          }),
          api.get('/subcategories/')
        ]);

        // ... (processing data kama kawaida) ...

        setData({
          categories: categoriesRes.data.results || categoriesRes.data || [],
          trendingProducts: trendingRes.data.results || trendingRes.data || [],
          ads: adsRes.data.results || adsRes.data || [],
          featuredProducts: featuredProducts || [],
          subCategories: subCategoriesRes.data.results || subCategoriesRes.data || [],
          leafsForSub: [],
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);

        // 🔥 KAMA NI 401, USISETI ERROR! Badala yake, weka data tupu.
        if (error.response?.status === 401) {
          console.warn("🔒 Mgeni anajaribu dashboard, data za public zimewekwa tupu.");
          setData(prev => ({
            ...prev,
            loading: false,
            error: null, // Hakuna error kwa mgeni!
            categories: prev.categories || [],
            trendingProducts: [],
            ads: [],
            featuredProducts: [],
            subCategories: []
          }));
        } else {
          // Kama ni error nyingine, ionyeshe
          setData(prev => ({
            ...prev,
            loading: false,
            error: error.response?.data?.detail || error.message
          }));
        }
      }
    };

    fetchAllData();
  }, []);

  return data;
};