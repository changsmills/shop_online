// src/pages/StorePending.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { Clock, Store } from 'lucide-react';

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
  // 🔥 ENDA DASHBOARD TU PALE ADMIN ANAPOAPPROVE
  // =======================================================
  useEffect(() => {
    if (storeStatus === 'approved' || storeStatus === 'verified') {
      navigate(`/dashboard/physical/${storeId}`);
    }
  }, [storeStatus, storeId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      
      {/* Custom Animation Keyframes kwa ajili ya Progress Bar */}
      <style>{`
        @keyframes progress-pulse {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>

      <div className="bg-white dark:bg-gray-800 rounded-[20px] px-6 py-10 md:px-8 max-w-[450px] w-full text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        
        <div className="flex justify-center mb-5">
          <Clock size={48} color="#ff6a00" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2.5">
          Store Pending Approval
        </h2>
        
        <p className="text-base font-semibold text-[#ff6a00] flex items-center justify-center gap-2 mb-4">
          <Store size={16} /> {storeName || 'Your Store'}
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
          Our verification system is reviewing your store details.
          <br />
          You will be redirected to the Dashboard once your store is approved by Admin.
        </p>
        
        {/* PROGRESS BAR */}
        <div className="relative mb-6">
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff6a00] to-[#ff9a44]"
              style={{ animation: 'progress-pulse 1.5s ease-in-out infinite' }}
            ></div>
          </div>
          <span className="block text-xs text-gray-400 mt-2.5">
            Waiting... {isChecking ? 'Checking' : ''}
          </span>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-2.5 bg-[#ff6a00] hover:bg-[#e55a00] text-white font-semibold rounded-lg transition-colors duration-200 active:scale-95"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}