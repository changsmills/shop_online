// src/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import api from '../axiosConfig';

export const useDashboardData = () => {
  const [data, setData] = useState({
    categories: [],
    trendingProducts: [],
    ads: [],
    featuredProducts: [],   // Sasa tupu, Dashboard itafetch kwa category
    subCategories: [],      // Sasa tupu, Dashboard itafetch kwa category
    leafsForSub: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 🔥 1. Angalia cache kwanza (dakika 5)
        const cacheKey = 'dashboard_data';
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        
        if (cachedData && cachedTime && (Date.now() - Number(cachedTime) < 5 * 60 * 1000)) {
          console.log('📦 Using cached dashboard data');
          setData(JSON.parse(cachedData));
          setData(prev => ({ ...prev, loading: false }));
          return;
        }

        console.log('🔄 Fetching fresh dashboard data...');
        setData(prev => ({ ...prev, loading: true, error: null }));

        const token = localStorage.getItem("access_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 🔥 2. Sasa tunafetch tu data zinazohitajika mara moja
        const results = await Promise.allSettled([
          // 1. Categories (zote)
          api.get('/categories/'),
          
          // 2. Trending Products (bidhaa popular)
          api.get('/products/', {
            params: { is_approved: true, ordering: '-views', limit: 8 },
            headers
          }),
          
          // 3. Advertisements (active)
          api.get('/advertisements/', {
            params: { status: 'active' },
            headers
          })
          // ❌ Hakuna Featured Products wala Subcategories hapa tena!
        ]);

        // 🔥 3. PROCESS RESULTS
        let categories = [];
        let trendingProducts = [];
        let ads = [];

        // 1. Categories
        if (results[0].status === 'fulfilled') {
          const rawData = results[0].value.data.results || results[0].value.data;
          if (rawData) {
            const allCategory = { id: null, name: 'All', name_sw: 'Zote' };
            categories = [allCategory, ...rawData];
          }
        } else {
          console.warn("Failed to fetch categories:", results[0].reason);
        }

        // 2. Trending Products
        if (results[1].status === 'fulfilled') {
          trendingProducts = results[1].value.data.results || results[1].value.data || [];
        } else {
          console.warn("Failed to fetch trending products:", results[1].reason);
        }

        // 3. Advertisements
        if (results[2].status === 'fulfilled') {
          ads = results[2].value.data.results || results[2].value.data || [];
        } else {
          console.warn("Failed to fetch ads:", results[2].reason);
        }

        // 🔥 4. Prepare data - featuredProducts na subCategories zitaanza tupu
        const newData = {
          categories,
          trendingProducts,
          ads,
          featuredProducts: [],  // Dashboard itajaza baada ya kuchagua category
          subCategories: [],     // Dashboard itajaza baada ya kuchagua category
          leafsForSub: [],
          loading: false,
          error: null
        };

        // 🔥 5. HIFADHI KWENYE CACHE
        localStorage.setItem(cacheKey, JSON.stringify(newData));
        localStorage.setItem(`${cacheKey}_time`, String(Date.now()));
        console.log('✅ Dashboard data cached successfully');

        setData(newData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.detail || error.message
        }));
      }
    };

    fetchAllData();
  }, []);

  return data;
};