// src/pages/AdminStores.jsx
import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { toast, Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

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

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="p-6 max-w-[1100px] mx-auto font-sans">
        <div className="text-center p-10 text-base md:text-lg text-gray-500 dark:text-slate-400">
          Loading stores...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto font-sans dark:bg-slate-900 min-h-screen">
      <Toaster position="top-center" />

      <h1 className="text-xl sm:text-2xl md:text-[28px] font-extrabold mb-6 text-gray-900 dark:text-white">
        Admin Panel - Store Approvals
      </h1>

      {stores.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-xl text-center text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
          Hakuna maduka yanayosubiri kupitishwa.
        </div>
      ) : (
        <>
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 flex-wrap"
            >
              {/* Store Info */}
              <div className="flex items-center gap-4 flex-1 min-w-full md:min-w-[250px]">
                {store.store_logo_url ? (
                  <img
                    src={store.store_logo_url}
                    alt="logo"
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-gray-400 dark:text-slate-400 flex-shrink-0">
                    {store.store_name?.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white m-0 mb-1">
                    {store.store_name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 my-0.5">
                    {store.business_type} • {store.city}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 my-0.5">
                    TIN: {store.tin_number}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 w-full md:w-auto md:justify-stretch">
                <button
                  onClick={() => handleApprove(store.id)}
                  className="flex-1 md:flex-initial bg-green-600 hover:bg-green-700 text-white border-none px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold transition-colors duration-200"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button
                  onClick={() => handleReject(store.id)}
                  className="flex-1 md:flex-initial bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold transition-colors duration-200"
                >
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