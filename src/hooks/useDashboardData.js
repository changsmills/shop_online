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

        // 🔥 BADILISHA: TUMIA INDIVIDUAL try/catch badala ya Promise.all!
        let categories = [];
        let trendingProducts = [];
        let ads = [];
        let featuredProducts = [];
        let subCategories = [];

        // 1. Categories (Public)
        try {
          const res = await api.get('/categories/');
          const rawData = res.data.results || res.data;
          if (rawData) {
            const allCategory = { id: null, name: 'All', name_sw: 'Zote' };
            categories = [allCategory, ...rawData];
          }
        } catch (err) {
          console.warn("Failed to fetch categories:", err);
        }

        // 2. Trending Products (IsApproved)
        try {
          const res = await api.get('/products/', {
            params: { is_approved: true, ordering: '-views', limit: 8 },
            headers
          });
          trendingProducts = res.data.results || res.data || [];
        } catch (err) {
          console.warn("Failed to fetch trending products:", err);
        }

        // 3. Advertisements (Hata kama inatoa 401, haitavunja wengine!)
        try {
          const res = await api.get('/advertisements/', {
            params: { status: 'active' },
            headers
          });
          ads = res.data.results || res.data || [];
        } catch (err) {
          console.warn("Failed to fetch ads (likely 401):", err);
        }

        // 4. Featured Products (Leaf Categories)
        try {
          const res = await api.get('/products/', {
            params: { has_cover_image: true, limit: 50 },
            headers
          });
          const rawFeatured = res.data.results || res.data || [];
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
        } catch (err) {
          console.warn("Failed to fetch featured products:", err);
        }

        // 5. Subcategories
        try {
          const res = await api.get('/subcategories/');
          subCategories = res.data.results || res.data || [];
        } catch (err) {
          console.warn("Failed to fetch subcategories:", err);
        }

        // 🔥 SET DATA (Hata kama ads imeshindwa, categories bado zitaonekana!)
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