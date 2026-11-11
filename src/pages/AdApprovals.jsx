// src/pages/AdApprovals.jsx
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'; // 🔥 Ongeza hii
import api from '../axiosConfig';
import { 
  Megaphone, CheckCircle, XCircle, Clock, Eye, Trash2, 
  Image as ImageIcon, Video, Star, X, Check, Building2, Calendar,
  Menu, LogOut // 🔥 Ongeza hizi kwa ajili ya header
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar'; // 🔥 Ingiza Sidebar

// Function ya kuvuta matangazo
const fetchAds = async () => {
  const response = await api.get("/advertisements/", {
    params: { ordering: "-created_at" },
  });
  return response.data.results || response.data || [];
};

export default function AdApprovals() {
  const navigate = useNavigate(); // 🔥 Ongeza hii
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [selectedAd, setSelectedAd] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  // 🔥 State ya Sidebar kwa Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: ads = [], isLoading: loading } = useQuery({
    queryKey: ['adminAds'],
    queryFn: fetchAds,
    refetchInterval: 30000, 
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    queryClient.clear();
    navigate('/dashboard/login');
  };

  // ==========================================
  // ACTIONS (Approve, Reject, Delete)
  // ==========================================
  const handleApproveAd = async (adId) => {
    setActionLoading(true);
    try {
      await api.patch(`/advertisements/${adId}/`, { status: "active" });
      alert(`✅ Advertisement approved!`);
      queryClient.invalidateQueries({ queryKey: ['adminAds'] });
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectAd = async (adId) => {
    if (!rejectionReason) return alert("Please enter a reason!");
    setActionLoading(true);
    try {
      await api.patch(`/advertisements/${adId}/`, {
        status: "rejected",
        rejection_reason: rejectionReason,
      });
      setRejectModal(false);
      setRejectionReason("");
      alert(`❌ Advertisement rejected.`);
      queryClient.invalidateQueries({ queryKey: ['adminAds'] });
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    setActionLoading(true);
    try {
      await api.delete(`/advertisements/${adId}/`);
      alert(`🗑️ Advertisement deleted.`);
      queryClient.invalidateQueries({ queryKey: ['adminAds'] });
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // HELPERS & STATISTICS
  // ==========================================
  const isVideo = (url) => {
    if (!url) return false;
    return [".mp4", ".webm", ".mov"].some(ext => url.toLowerCase().endsWith(ext));
  };

  const stats = {
    pending: ads.filter((ad) => ad.status === "pending").length,
    active: ads.filter((ad) => ad.status === "active").length,
    rejected: ads.filter((ad) => ad.status === "rejected").length,
    total: ads.length,
    businesses: new Set(ads.map((ad) => ad.business_name)).size,
  };

  const filteredAds = ads.filter((ad) => filter === "all" ? true : ad.status === filter);

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      active: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-100"}`}>{status}</span>;
  };

  return (
    // 🔥 Nimeongeza Layout mzima hapa sawa na AdminStores.jsx
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans relative w-full">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar activePage="ads" onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full min-w-0 transition-all duration-300">
        
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Ad Approvals</h1>
          </div>
          <button onClick={handleLogout} className="md:hidden flex items-center gap-2 text-red-500 font-medium text-sm">
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-[1200px] mx-auto w-full">
            
            {/* HEADER TEXT */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advertisement Management</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Review, approve, and manage customer advertisements</p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
              {[
                { icon: Clock, label: "Pending", value: stats.pending, color: "text-yellow-600 bg-yellow-100" },
                { icon: CheckCircle, label: "Active", value: stats.active, color: "text-green-600 bg-green-100" },
                { icon: XCircle, label: "Rejected", value: stats.rejected, color: "text-red-600 bg-red-100" },
                { icon: Building2, label: "Businesses", value: stats.businesses, color: "text-blue-600 bg-blue-100" },
                { icon: Megaphone, label: "Total Ads", value: stats.total, color: "text-purple-600 bg-purple-100" },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}><stat.icon size={20} /></div>
                  <div>
                    <p className="text-[11px] md:text-xs text-gray-500 dark:text-slate-400 font-medium">{stat.label}</p>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* FILTER TABS */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-200 dark:border-slate-700">
              {["all", "pending", "active", "rejected"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize whitespace-nowrap transition-colors ${
                    filter === type 
                      ? "bg-orange-500 text-white" 
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {type} ({type === 'all' ? stats.total : stats[type]})
                </button>
              ))}
            </div>

            {/* ADS GRID */}
            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div></div>
            ) : filteredAds.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <Megaphone size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-white">No advertisements found</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAds.map((ad) => (
                  <div key={ad.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
                    
                    {/* Media Area */}
                    <div className="h-40 bg-gray-100 dark:bg-slate-900 relative cursor-pointer group" onClick={() => { setSelectedAd(ad); setPreviewModal(true); }}>
                      {isVideo(ad.media_url) ? (
                        <video src={ad.media_url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={ad.media_url} alt="Ad" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="text-white" size={24} />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{ad.business_name}</h3>
                        <StatusBadge status={ad.status} />
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 truncate">{ad.description || "No description"}</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-1 rounded">
                          {ad.ad_type}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(ad.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-2">
                        {ad.status === "pending" && (
                          <>
                            <button onClick={() => handleApproveAd(ad.id)} disabled={actionLoading} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                              <Check size={14} /> Approve
                            </button>
                            <button onClick={() => { setSelectedAd(ad); setRejectModal(true); }} disabled={actionLoading} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                        {(ad.status === "active" || ad.status === "rejected") && (
                          <button onClick={() => handleDeleteAd(ad.id)} disabled={actionLoading} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* PREVIEW MODAL */}
      {previewModal && selectedAd && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="font-bold text-lg dark:text-white">Full Advertisement</h2>
              <button onClick={() => setPreviewModal(false)} className="text-gray-500 hover:text-red-500"><X size={20} /></button>
            </div>
            <div className="h-64 md:h-96 bg-black">
              {isVideo(selectedAd.media_url) ? (
                <video src={selectedAd.media_url} controls className="w-full h-full object-contain" />
              ) : (
                <img src={selectedAd.media_url} alt="Ad" className="w-full h-full object-contain" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedAd.business_name}</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{selectedAd.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && selectedAd && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setRejectModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Reject Advertisement</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Business: {selectedAd.business_name}</p>
            <textarea
              placeholder="Rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-sm dark:text-white outline-none focus:border-orange-500 mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => handleRejectAd(selectedAd.id)} disabled={actionLoading} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold text-sm">
                {actionLoading ? "Processing..." : "Reject Ad"}
              </button>
              <button onClick={() => setRejectModal(false)} className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white py-2 rounded-lg font-bold text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}