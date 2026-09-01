// src/pages/StorePending.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { Clock, Store, CheckCircle, RefreshCw } from 'lucide-react';
import '../StorePending.css'; // Hakikisha una CSS!

export default function StorePending() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [storeStatus, setStoreStatus] = useState('pending');
  const [storeName, setStoreName] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  // =======================================================
  // 🔥 ANGALIA STATUS YA STORE KILA BAADA YA SEKUNDE 5
  // =======================================================
  useEffect(() => {
    const fetchStoreStatus = async () => {
      if (!storeId) return;
      try {
        const response = await api.get(`/stores/${storeId}/`);
        const data = response.data;
        
        // 🔥 MUHIMU SANA: Soma 'verification_status' KWANZA!
        // Kama ni 'pending', mtumiaji abaki hapa. Usitumie 'status' kwa sababu ni 'active'.
        const currentStatus = data.verification_status || data.status || 'pending';
        
        setStoreStatus(currentStatus);
        setStoreName(data.store_name || '');
      } catch (error) {
        console.error("Error fetching store status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    fetchStoreStatus();
    const interval = setInterval(fetchStoreStatus, 5000); // Angalia kila sekunde 5!

    return () => clearInterval(interval);
  }, [storeId]);

  // =======================================================
  // 🔥 ENDA DASHBOARD TU PALE ADMIN ANAPOBADILISHA VERIFICATION_STATUS KUWA APPROVED!
  // =======================================================
  useEffect(() => {
    if (storeStatus === 'approved' || storeStatus === 'verified') {
      navigate(`/dashboard/physical/${storeId}`);
    }
  }, [storeStatus, storeId, navigate]);

  return (
    <div className="store-pending-page">
      <div className="store-pending-card">
        <div className="store-pending-icon">
          <Clock size={48} color="#ff6a00" />
        </div>
        
        {/* 🔥 Maneno yote ni ya Kiingereza */}
        <h2 className="store-pending-title">Store Pending Approval</h2>
        <p className="store-pending-store-name">
          <Store size={16} /> {storeName || 'Your Store'}
        </p>
        
        <p className="store-pending-text">
          Our verification system is reviewing your store details.
          <br />
          You will be redirected to the Dashboard once your store is approved by Admin.
        </p>
        
        <div className="store-pending-progress">
          <div className="progress-bar"></div>
          <span className="progress-text">Waiting... {isChecking ? 'Checking' : ''}</span>
        </div>

        <button onClick={() => navigate('/')} className="back-home-btn">
          Back to Home
        </button>
      </div>
    </div>
  );
}