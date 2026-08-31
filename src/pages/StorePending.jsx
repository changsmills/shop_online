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
        setStoreStatus(data.status || 'pending');
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
  // 🔥 KAMA STORE IMEPITISHWA, ENDA KWA DASHBOARD
  // =======================================================
  useEffect(() => {
    if (storeStatus === 'approved' || storeStatus === 'active') {
      navigate(`/dashboard/physical/${storeId}`);
    }
  }, [storeStatus, storeId, navigate]);

  return (
    <div className="store-pending-page">
      <div className="store-pending-card">
        <div className="store-pending-icon">
          <Clock size={48} color="#ff6a00" />
        </div>
        
        <h2 className="store-pending-title">Duka Linasubiri Kupitishwa</h2>
        <p className="store-pending-store-name">
          <Store size={16} /> {storeName || 'Duka Lako'}
        </p>
        
        <p className="store-pending-text">
          Mfumo wetu wa ukaguzi unapitia taarifa za duka lako. 
          <br />
          Hutumwa kwenye Dashboard mara tu duka litakapopitishwa na Admin.
        </p>
        
        <div className="store-pending-progress">
          <div className="progress-bar"></div>
          <span className="progress-text">Inasubiri... {isChecking ? 'Inakagua' : ''}</span>
        </div>

        <button onClick={() => navigate('/')} className="back-home-btn">
          Rudi Nyumbani
        </button>
      </div>
    </div>
  );
}