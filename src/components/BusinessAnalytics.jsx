import React, { useEffect, useState } from 'react';
import { Eye, MessageCircle, TrendingUp, Package } from 'lucide-react';
import axios from 'axios';
import '../BusinessAnalytics.css';

const API_BASE_URL = "http://127.0.0.1:8000/api";

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
                const response = await axios.get(`${API_BASE_URL}/leads/`, {
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
                            {/* ✅ Hapa tumebadilisha Loader2 kuwa CSS spinner */}
                            {loading ? <div className="spinner-css" /> : leadsCount}
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
                        {/* ✅ Jina linaingia moja kwa moja, CSS inalikata (ellipsis) */}
                        <h4 className="stat-number product-name">
                            {popularProduct?.name || 'N/A'}
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