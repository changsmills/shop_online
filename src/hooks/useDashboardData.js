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

        const token = localStorage.getItem("access_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 🔥 ZOTE ZINAKIMBIA SAMBAMBA - Promise.allSettled!
        const results = await Promise.allSettled([
          // 1. Categories
          api.get('/categories/'),
          
          // 2. Trending Products
          api.get('/products/', {
            params: { is_approved: true, ordering: '-views', limit: 8 },
            headers
          }),
          
          // 3. Advertisements
          api.get('/advertisements/', {
            params: { status: 'active' },
            headers
          }),
          
          // 4. Featured Products
          api.get('/products/', {
            params: { has_cover_image: true, limit: 50 },
            headers
          }),
          
          // 5. Subcategories
          api.get('/subcategories/')
        ]);

        // 🔥 PROCESS RESULTS - Hata kama moja imeshindwa!
        let categories = [];
        let trendingProducts = [];
        let ads = [];
        let featuredProducts = [];
        let subCategories = [];

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

        // 4. Featured Products
        if (results[3].status === 'fulfilled') {
          const rawFeatured = results[3].value.data.results || results[3].value.data || [];
          const seenIds = new Set();
          const featured = [];
          rawFeatured.forEach(item => {
            if (!seenIds.has(item.leaf_category_id)) {
              seenIds.add(item.leaf_category_id);
              featured.push({
                id: item.leaf_category_id,
                leaf_category_id: item.leaf_category_id,
                cover_image_url: item.cover_image_url,
                leaf_categories: item.leaf_categories || { name: 'Unknown', name_sw: 'Haijulikani' }
              });
            }
          });
          featuredProducts = featured.slice(0, 17);
        } else {
          console.warn("Failed to fetch featured products:", results[3].reason);
        }

        // 5. Subcategories
        if (results[4].status === 'fulfilled') {
          subCategories = results[4].value.data.results || results[4].value.data || [];
        } else {
          console.warn("Failed to fetch subcategories:", results[4].reason);
        }

        // 🔥 SET DATA
        setData({
          categories,
          trendingProducts,
          ads,
          featuredProducts,
          subCategories,
          leafsForSub: [],
          loading: false,
          error: null
        });

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