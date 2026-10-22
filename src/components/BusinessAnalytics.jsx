import React, { useEffect, useState } from 'react';
import { Eye, MessageCircle, TrendingUp, Package } from 'lucide-react';
import api from '../axiosConfig';
// import '../BusinessAnalytics.css'; // ❌ IMEONDOLEWA

const BusinessAnalytics = ({ products = [], sellerId }) => {
    const [leadsCount, setLeadsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRealTimeStats = async () => {
            if (!sellerId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const token = localStorage.getItem("access_token");
                const response = await api.get('/leads/', {
                    params: { store_id: sellerId },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLeadsCount(response.data?.length || 0);
            } catch (err) {
                console.error("Analytics Error:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRealTimeStats();
    }, [sellerId]);
    
    const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
    const popularProduct = [...products].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

    return (
        <div className="py-4 animate-[fadeIn_0.6s_ease-out_forwards]">
          
          <h3 className="text-lg font-extrabold text-[#1f2937] dark:text-[#e2e8f0] m-0 mb-4 tracking-tight">
            Business Overview
          </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 md:gap-4">
                
                {/* 1. TOTAL VIEWS */}
                <div className="group bg-white dark:bg-[#1e293b] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-2 md:gap-4 border border-[#f1f5f9] dark:border-[#334155] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] dark:hover:border-[#ff6a00] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-default text-center md:text-left opacity-0 animate-[slideUp_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards] [animation-delay:0.05s]">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#eff6ff] text-[#3b82f6] dark:bg-[#1e3a5f] dark:text-[#60a5fa] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <Eye size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg md:text-[22px] font-black text-[#1f2937] dark:text-[#e2e8f0] m-0 mb-0.5 leading-tight">
                            {totalViews.toLocaleString()}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#9ca3af] dark:text-[#94a3b8] uppercase tracking-wide m-0">
                            Total Views
                        </p>
                    </div>
                </div>

                {/* 2. LEADS / CUSTOMERS */}
                <div className="group bg-white dark:bg-[#1e293b] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-2 md:gap-4 border border-[#f1f5f9] dark:border-[#334155] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] dark:hover:border-[#ff6a00] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-default text-center md:text-left opacity-0 animate-[slideUp_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards] [animation-delay:0.12s]">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#f0fdf4] text-[#22c55e] dark:bg-[#1a3a2a] dark:text-[#4ade80] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <MessageCircle size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg md:text-[22px] font-black text-[#1f2937] dark:text-[#e2e8f0] m-0 mb-0.5 leading-tight">
                            {loading ? (
                                <div className="inline-block w-[18px] h-[18px] border-2 border-[#e2e8f0] dark:border-[#4b5563] border-t-[#22c55e] dark:border-t-[#4ade80] rounded-full animate-spin" />
                            ) : leadsCount}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#9ca3af] dark:text-[#94a3b8] uppercase tracking-wide m-0">
                            Customers (WhatsApp)
                        </p>
                    </div>
                </div>

                {/* 3. MOST VIEWED PRODUCT */}
                <div className="group bg-white dark:bg-[#1e293b] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-2 md:gap-4 border border-[#f1f5f9] dark:border-[#334155] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] dark:hover:border-[#ff6a00] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-default text-center md:text-left opacity-0 animate-[slideUp_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards] [animation-delay:0.19s]">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#faf5ff] text-[#8b5cf6] dark:bg-[#2d1b4e] dark:text-[#a78bfa] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <TrendingUp size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] md:text-[15px] font-black text-[#f97316] dark:text-[#f97316] m-0 mb-0.5 leading-tight truncate">
                            {popularProduct?.name || 'N/A'}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#9ca3af] dark:text-[#94a3b8] uppercase tracking-wide m-0">
                            Most Viewed
                        </p>
                    </div>
                </div>

                {/* 4. PRODUCT TYPES */}
                <div className="group bg-white dark:bg-[#1e293b] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-2 md:gap-4 border border-[#f1f5f9] dark:border-[#334155] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] dark:hover:border-[#ff6a00] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-default text-center md:text-left opacity-0 animate-[slideUp_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards] [animation-delay:0.26s]">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#fff7ed] text-[#f97316] dark:bg-[#3d2a1a] dark:text-[#fb923c] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <Package size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg md:text-[22px] font-black text-[#1f2937] dark:text-[#e2e8f0] m-0 mb-0.5 leading-tight">
                            {products.length}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#9ca3af] dark:text-[#94a3b8] uppercase tracking-wide m-0">
                            Product Types
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BusinessAnalytics;