// src/hooks/useDashboardData.js
import { useQuery } from '@tanstack/react-query';
import api from '../axiosConfig';

// Function ya kuchukua data yote (Tunatumia Promise.allSettled kama ulivyofanya)
const fetchDashboardData = async () => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const results = await Promise.allSettled([
    api.get('/categories/'),
    api.get('/products/', {
      params: { is_approved: true, ordering: '-views', limit: 8 },
      headers
    }),
    api.get('/advertisements/', {
      params: { status: 'active' },
      headers
    })
  ]);

  let categories = [];
  let trendingProducts = [];
  let ads = [];

  if (results[0].status === 'fulfilled') {
    const rawData = results[0].value.data.results || results[0].value.data;
    if (rawData) {
      categories = [...rawData].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
  }

  if (results[1].status === 'fulfilled') {
    trendingProducts = results[1].value.data.results || results[1].value.data || [];
  }

  if (results[2].status === 'fulfilled') {
    ads = results[2].value.data.results || results[2].value.data || [];
  }

  return {
    categories,
    trendingProducts,
    ads,
    featuredProducts: [],
    subCategories: [],
    leafsForSub: []
  };
};

export const useDashboardData = () => {
  // TanStack Query inasimamia cache yote, huna haja ya localStorage tena
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    categories: data?.categories || [],
    trendingProducts: data?.trendingProducts || [],
    ads: data?.ads || [],
    featuredProducts: data?.featuredProducts || [],
    subCategories: data?.subCategories || [],
    loading: isLoading, // TanStack Query inatoa isLoading
    error: error?.message || null,
  };
};