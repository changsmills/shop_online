// src/pages/AdminStores.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { toast, Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import '../AdminStores.css'; // 🔥 Ingiza CSS!

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stores/', {
        params: { verification_status: 'pending' }
      });
      setStores(response.data.results || response.data || []);
    } catch (err) {
      console.error("Error fetching pending stores:", err.response?.data || err.message);
      toast.error("Huwezi kuona maduka haya. Hakikisha wewe ni Admin (is_staff).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleApprove = async (storeId) => {
    if (!window.confirm("Je, unathibitisha kupitisha duka hili?")) return;
    try {
      await api.patch(`/admin/stores/${storeId}/`, { verification_status: 'approved', status: 'active' });
      toast.success("Duka limepitishwa!");
      fetchStores();
    } catch (err) {
      toast.error("Imeshindwa: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleReject = async (storeId) => {
    if (!window.confirm("Je, una uhakika unataka kukataa duka hili?")) return;
    try {
      await api.patch(`/admin/stores/${storeId}/`, { verification_status: 'rejected', status: 'inactive' });
      toast.success("Duka limekataliwa.");
      fetchStores();
    } catch (err) {
      toast.error("Imeshindwa: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="admin-stores-page">
        <div className="admin-stores-loading">Loading stores...</div>
      </div>
    );
  }

  return (
    <div className="admin-stores-page">
      <Toaster position="top-center" />
      <h1 className="admin-stores-title">Admin Panel - Store Approvals</h1>
      
      {stores.length === 0 ? (
        <div className="admin-stores-empty">
          Hakuna maduka yanayosubiri kupitishwa.
        </div>
      ) : (
        <>
          {stores.map((store) => (
            <div key={store.id} className="admin-store-card">
              <div className="admin-store-info">
                {store.store_logo_url ? (
                  <img src={store.store_logo_url} alt="logo" className="admin-store-logo" />
                ) : (
                  <div className="admin-store-fallback-logo">{store.store_name?.charAt(0)}</div>
                )}
                <div>
                  <h3 className="admin-store-name">{store.store_name}</h3>
                  <p className="admin-store-sub">{store.business_type} • {store.city}</p>
                  <p className="admin-store-sub">TIN: {store.tin_number}</p>
                </div>
              </div>
              
              <div className="admin-actions">
                <button onClick={() => handleApprove(store.id)} className="admin-btn-approve">
                  <CheckCircle size={18} /> Approve
                </button>
                <button onClick={() => handleReject(store.id)} className="admin-btn-reject">
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}