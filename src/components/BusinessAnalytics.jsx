import React, { useEffect, useState } from 'react';
import { Eye, MessageCircle, TrendingUp, Package } from 'lucide-react';
import api from '../axiosConfig'; // 🔥 Tumia api
import '../BusinessAnalytics.css';

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
                // 🔥 MABADILIKO: api.get na kuondoa API_BASE_URL
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
        <div className="analytics-container">
            <h3 className="analytics-title">Muhtasari wa Biashara</h3>
            
            <div className="analytics-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper icon-blue">
                        <Eye size={20} />
                    </div>
                    <div className="stat-info">
                        <h4 className="stat-number">{totalViews.toLocaleString()}</h4>
                        <p className="stat-label">Views za Bidhaa</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper icon-green">
                        <MessageCircle size={20} />
                    </div>
                    <div className="stat-info">
                        <h4 className="stat-number">
                            {loading ? <div className="spinner-css" /> : leadsCount}
                        </h4>
                        <p className="stat-label">Wateja (WhatsApp)</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper icon-purple">
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-info">
                        <h4 className="stat-number product-name">
                            {popularProduct?.name || 'N/A'}
                        </h4>
                        <p className="stat-label">Inayotazamwa Sana</p>
                    </div>
                </div>

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