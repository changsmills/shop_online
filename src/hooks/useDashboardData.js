// src/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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

        // 🔥 QUERY ZOTE KWA PAMOJA - Parallel fetching
        const [
          categoriesRes,
          trendingRes,
          adsRes,
          featuredRes,
          subCategoriesRes
        ] = await Promise.all([
          // 1. Categories
          supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true }),
          
          // 2. Trending Products
          supabase
            .from('products_engines')
            .select('*')
            .eq('is_approved', true)
            .order('views', { ascending: false })
            .limit(8),
          
          // 3. Advertisements
          supabase
            .from('advertisements')
            .select('*')
            .eq('status', 'active'),
          
          // 4. Featured Products (All categories)
          supabase
            .from('products_engines')
            .select(`
              leaf_category_id,
              cover_image,
              leaf_categories!inner (
                id,
                name,
                name_sw
              )
            `)
            .not('cover_image', 'is', null)
            .limit(50),
          
          // 5. Sub Categories (All)
          supabase
            .from('sub_categories')
            .select('*')
            .order('name', { ascending: true })
        ]);

        // Process categories (add "All")
        let categories = [];
        if (!categoriesRes.error && categoriesRes.data) {
          const allCategory = { id: null, name: 'All', name_sw: 'Zote' };
          categories = [allCategory, ...categoriesRes.data];
        }

        // Process featured products (unique)
        let featuredProducts = [];
        if (!featuredRes.error && featuredRes.data) {
          const seenIds = new Set();
          featuredRes.data.forEach(item => {
            if (!seenIds.has(item.leaf_category_id)) {
              seenIds.add(item.leaf_category_id);
              featuredProducts.push({
                id: item.leaf_category_id,
                leaf_category_id: item.leaf_category_id,
                cover_image: item.cover_image,
                leaf_categories: item.leaf_categories
              });
            }
          });
          featuredProducts = featuredProducts.slice(0, 17);
        }

        setData({
          categories,
          trendingProducts: trendingRes.data || [],
          ads: adsRes.data || [],
          featuredProducts,
          subCategories: subCategoriesRes.data || [],
          leafsForSub: [],
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }));
      }
    };

    fetchAllData();
  }, []);

  return data;
};