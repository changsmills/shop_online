// src/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import api from '../axiosConfig'; // ✅ MUHIMU: Tumia api!

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

        // 🔥 FETCH ZOTE KWA PAMOJA - Tumia api.get (sio axios.get!)
        const [
          categoriesRes,
          trendingRes,
          adsRes,
          featuredRes,
          subCategoriesRes
        ] = await Promise.all([
          api.get('/categories/'),
          api.get('/products/', {
            params: { is_approved: true, ordering: '-views', limit: 8 }
          }),
          api.get('/advertisements/', {
            params: { status: 'active' }
          }),
          api.get('/products/', {
            params: { has_cover_image: true, limit: 50 }
          }),
          api.get('/subcategories/')
        ]);

        const categoriesData = categoriesRes.data.results || categoriesRes.data;
        const trendingData = trendingRes.data.results || trendingRes.data;
        const adsData = adsRes.data.results || adsRes.data;
        const featuredData = featuredRes.data.results || featuredRes.data;
        const subCategoriesData = subCategoriesRes.data.results || subCategoriesRes.data;

        let categories = [];
        if (categoriesData) {
          const allCategory = { id: null, name: 'All', name_sw: 'Zote' };
          categories = [allCategory, ...categoriesData];
        }

        let featuredProducts = [];
        if (featuredData) {
          const seenIds = new Set();
          featuredData.forEach(item => {
            if (!seenIds.has(item.leaf_category_id)) {
              seenIds.add(item.leaf_category_id);
              featuredProducts.push({
                id: item.leaf_category_id,
                leaf_category_id: item.leaf_category_id,
                cover_image: item.cover_image,
                leaf_categories: item.leaf_categories || { name: 'Unknown', name_sw: 'Haijulikani' }
              });
            }
          });
          featuredProducts = featuredProducts.slice(0, 17);
        }

        setData({
          categories,
          trendingProducts: trendingData || [],
          ads: adsData || [],
          featuredProducts,
          subCategories: subCategoriesData || [],
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