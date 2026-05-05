import React, { useEffect, useState } from 'react';
import { Eye, MessageCircle, TrendingUp, Package, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import '../BusinessAnalytics.css';

const BusinessAnalytics = ({ products = [], sellerId }) => {
    const [leadsCount, setLeadsCount] = useState(0);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchRealTimeStats = async () => {
        // Ikiwa ID haijafika bado, zima spinner ili isizunguke milele
        if (!sellerId) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const { count, error } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                // Hakikisha hapa tunatumia column ya store_id
                .eq('store_id', sellerId); 

            if (error) throw error;
            setLeadsCount(count || 0);
        } catch (err) {
            console.error("Analytics Error:", err.message);
        } finally {
            setLoading(false); // Hii itazima spinner iwe namba imepatikana au la
        }
    };

    fetchRealTimeStats();
}, [sellerId]);
    
    // Mahesabu ya Views kutoka kwenye array ya products
    const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
    
    // Tafuta bidhaa inayopendwa (views nyingi zaidi)
    const popularProduct = [...products].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

    return (
        <div className="analytics-container">
            <h3 className="analytics-title">Muhtasari wa Biashara</h3>
            
            <div className="analytics-grid">
                {/* Card 1: Views */}
                <div className="stat-card">
                    <div className="stat-icon-wrapper icon-blue">
                        <Eye size={20} />
                    </div>
                    <div className="stat-info">
                        <h4 className="stat-number">{totalViews.toLocaleString()}</h4>
                        <p className="stat-label">Views za Bidhaa</p>
                    </div>
                </div>

                {/* Card 2: WhatsApp Leads */}
                <div className="stat-card">
                    <div className="stat-icon-wrapper icon-green">
                        <MessageCircle size={20} />
                    </div>
                    <div className="stat-info">
                        <h4 className="stat-number">
                            {loading ? <Loader2 className="spinner-icon" size={16} /> : leadsCount}
                        </h4>
                        <p className="stat-label">Wateja (WhatsApp)</p>
                    </div>
                </div>

                {/* Card 3: Inayopendwa */}
                <div className="stat-card">
                    <div className="stat-icon-wrapper icon-purple">
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-info">
                        <h4 className="stat-number product-name-stat">
                            {popularProduct?.name ? popularProduct.name.substring(0, 12) + '...' : 'N/A'}
                        </h4>
                        <p className="stat-label">Inayotazamwa Sana</p>
                    </div>
                </div>

                {/* Card 4: Stock Quantity */}
                <div className="stat-card">
                    <div className="stat-icon-wrapper icon-orange">
                        <Package size={20} />
                    </div>
                    <div className="stat-info">
                        <h4 className="stat-number">{products.length}</h4>
                        <p className="stat-label">Aina za Bidhaa</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessAnalytics;