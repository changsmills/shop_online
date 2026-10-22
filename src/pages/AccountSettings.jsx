// src/pages/AccountSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../axiosConfig'; // 🔥 Badilisha: Tumia api kutoka axiosConfig!
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, User, LogOut, ChevronRight, Menu, X, Eye, EyeOff,
  Camera, Upload, Save, HelpCircle, FileText, Shield, Phone, Mail, Globe, Truck, Store,
  ArrowLeft
} from 'lucide-react';
import UserTools from '../components/UserTools';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';
import toast from 'react-hot-toast';
//import '../AccountSettings.css';

const AccountSettings = () => { // 🔥 Imeondolewa { session }!
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ZA SIDEBAR NA DATA ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // --- STATE ZA EDIT PROFILE MODAL ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // --- STATE ZA EMAIL UPDATE ---
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [userStoreId, setUserStoreId] = useState(null);

  // --- STATE ZA PASSWORD UPDATE ---
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // =======================================================
  // 🔥 1. VUTA PROFILE KUTOKA DJANGO API
  // =======================================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/dashboard/login');
          return;
        }
        
        // Pata profile data
        const res = await api.get('/profile/');
        const data = res.data;
        
        setProfile(data);
        setCurrentUserId(data.id);
        setFullName(data.full_name || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        toast.error('Imeshindwa kupata taarifa za profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // =======================================================
  // 🔥 2. ANGAZIA KAMA MTUMIAJI ANA DUKA
  // =======================================================
  useEffect(() => {
    const checkUserStore = async () => {
      if (!currentUserId) return;
      try {
        const res = await api.get('/stores/', { params: { owner: currentUserId } });
        const stores = res.data.results || res.data || [];
        if (stores.length > 0) {
          setUserStoreId(stores[0].id);
        } else {
          setUserStoreId(null);
        }
      } catch (error) {
        console.error('Error checking store:', error);
        setUserStoreId(null);
      }
    };
    checkUserStore();
  }, [currentUserId]);

  // --- 2. HANDLE AVATAR FILE SELECTION ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Tafadhali chagua picha tu (JPEG, PNG, GIF)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Picha inapaswa kuwa chini ya 2MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // =======================================================
  // 🔥 3. UPDATE PROFILE (Picha na Maelezo)
  // =======================================================
  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error('Tafadhali weka jina lako kamili');
      return;
    }
    setProfileSaving(true);
    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('username', username || '');
      formData.append('bio', bio || '');

      // Kama kuna picha mpya, iongeze kwenye FormData
      if (avatarFile) {
        formData.append('avatar_file', avatarFile); // 🔥 SAHIHI!// Au 'avatar_file' kulingana na serializer yako
      }

      // Tumia PATCH kusasisha profile (Endpoints: /api/profile/ au /api/profiles/{id}/)
      const res = await api.patch('/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(res.data);
      toast.success('Profile imesasishwa kwa mafanikio!');
      setIsEditingProfile(false);
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Profile update error:', error.response?.data || error.message);
      toast.error('Imeshindikana kusasisha profile: ' + (error.response?.data?.detail || error.message));
    } finally {
      setProfileSaving(false);
    }
  };

  // --- 5. UPDATE EMAIL ---
  // 🔥 Django inahitaji endpoint maalum kwa mabadiliko ya email. 
  // Hii inatuma ombi kwa endpoint inayofaa (kama /api/change-email/)
  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast.error('Tafadhali weka email mpya');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error('Tafadhali weka email sahihi');
      return;
    }
    setEmailLoading(true);
    try {
      await api.post('/api/change-email/', { new_email: newEmail });
      toast.success('Maombi yamepokelewa! Kagua email yako mpya kuthibitisha.');
      setIsEditingEmail(false);
      setNewEmail('');
    } catch (error) {
      toast.error('Imeshindikana kusasisha email: ' + (error.response?.data?.detail || error.message));
    } finally {
      setEmailLoading(false);
    }
  };

  // --- 6. UPDATE PASSWORD ---
  // 🔥 Django inahitaji endpoint maalum kwa mabadiliko ya password (kama /api/change-password/)
  const handleUpdatePassword = async () => {
    if (!currentPassword.trim()) {
      toast.error('Tafadhali weka password yako ya sasa');
      return;
    }
    if (!newPassword.trim()) {
      toast.error('Tafadhali weka password mpya');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password mpya lazima iwe na herufi 6 au zaidi');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Password mpya na uthibitisho hazifanani');
      return;
    }
    setPasswordLoading(true);
    try {
      await api.post('/api/change-password/', {
        old_password: currentPassword,
        new_password: newPassword
      });
      toast.success('Password imesasishwa kwa mafanikio!');
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Imeshindikana kusasisha password: ' + (error.response?.data?.detail || error.message));
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- 7. RESET PASSWORD ---
  const handlePasswordReset = async () => {
    try {
      // Django inahitaji endpoint ya password reset (kama /api/password-reset/)
      await api.post('/api/password-reset/', { email: profile?.email });
      toast.success(`Link imetumwa kwenye email yako: ${profile?.email}`, { duration: 6000 });
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.detail || error.message));
    }
  };

  // --- 8. DELETE ACCOUNT ---
  const handleDeleteAccount = async () => {
    const confirm = window.confirm('Je, una uhakika unataka kufuta akaunti yako? Hatua hii haiwezi kubadilishwa!');
    if (!confirm) return;
    try {
      await api.delete('/api/delete-account/');
      toast.success('Akaunti imefutwa kwa mafanikio');
      // Logout baada ya kufuta
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/';
    } catch (error) {
      toast.error('Imeshindikana kufuta akaunti: ' + (error.response?.data?.detail || error.message));
    }
  };

  // =======================================================
  // 🔥 SIDEBAR LINKS
  // =======================================================
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <Store size={20} />, path: '/dashboard/seller', label: 'Sell on Skyfall' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];


    const handleSellNavigation = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate('/dashboard/register-supplier');
        return;
      }

      const profileRes = await api.get('/profile/');
      const profileData = profileRes.data;
      if (profileData?.role === 'supplier') {
        const storeRes = await api.get('/stores/', { params: { owner_id: profileData.id } });
        const storeData = storeRes.data;
        if (storeData && storeData.length > 0) {
          const store = storeData[0];
          const storeId = store.id;
          const verificationStatus = store.verification_status || store.status;

          // 🔥 MUHIMU: Kagua kama store inasubiri kupitishwa!
          if (verificationStatus === 'pending' || verificationStatus === 'unverified') {
            navigate(`/store-pending/${storeId}`);
          } else {
            navigate(`/dashboard/sellerboard/${storeId}`);
          }
        } else {
          navigate('/create-store');
        }
      } else {
        navigate('/dashboard/seller');
      }
    } catch (err) {
      console.error("🔥 Error:", err.response?.data || err.message);
      navigate('/dashboard/seller');
    }
  };

  const helpfulLinks = [
    { icon: <HelpCircle size={18} />, title: 'Help Center', path: '/help-center' },
    { icon: <FileText size={18} />, title: 'Tutorials', path: '/tutorials' },
    { icon: <Phone size={18} />, title: 'Contact Support', path: '/contact-support' },
    { icon: <Mail size={18} />, title: 'Contact Us', path: '/contact-us' },
    { icon: <Shield size={18} />, title: 'Privacy Policy', path: '/privacy' },
    { icon: <FileText size={18} />, title: 'Terms & Conditions', path: '/terms' },
    { icon: <Truck size={18} />, title: 'Shipping Info', path: '/shipping-info' },
    { icon: <FileText size={18} />, title: 'Refund Policy', path: '/refund-policy' },
    { icon: <Globe size={18} />, title: 'About Skyfall', path: '/about-skyfall' },
    { icon: <FileText size={18} />, title: 'How to Buy', path: '/how-to-buy' },
    { icon: <Store size={18} />, title: 'Sell on Skyfall', path: '/dashboard/seller' },
  ];

  // =======================================================
  // 🔥 SIGN OUT (Ondoa token na redirect)
  // =======================================================
  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
    toast.success('Umefanikiwa kutoka!');
  };

// ===== LOADING SKELETON =====
  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full overflow-hidden font-sans bg-white dark:bg-black">
        <div className="h-[60px] bg-white dark:bg-[#111] border-b border-gray-200 dark:border-[#1f1f1f] animate-pulse" />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block w-[72px] bg-white dark:bg-[#111] border-r border-gray-200 dark:border-[#1f1f1f] animate-pulse flex-shrink-0" />
          <div className="flex-1 bg-gray-50 dark:bg-black p-4 pt-6 md:pt-[50px] overflow-y-auto">
            <div className="max-w-[1000px] mx-auto">
              <div className="h-[120px] bg-white dark:bg-[#111] rounded-xl mb-5 animate-pulse" />
              <div className="h-[200px] bg-white dark:bg-[#111] rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden font-sans bg-white dark:bg-black text-gray-900 dark:text-white">

      {/* ===== HEADER ===== */}
      <header className="h-[60px] bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between px-3 md:px-5 z-[100] flex-shrink-0 relative">

        <div className="flex items-center gap-3 md:gap-5">
          {/* Back Arrow - mobile only */}
          <button
            className="md:hidden flex items-center justify-center bg-transparent border-none cursor-pointer text-[#ff5722] p-1"
            onClick={() => navigate(-1)}
            title="Back"
          >
            <ArrowLeft size={22} />
          </button>

          {/* Menu toggle - desktop only */}
          {!isExpanded && (
            <Menu
              size={22}
              className="hidden md:flex items-center text-gray-500 dark:text-slate-400 cursor-pointer hover:text-[#ff6a00] transition-colors p-1"
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}

          <Link to="/dashboard" className="text-lg md:text-[22px] font-extrabold text-[#ff6a00] no-underline tracking-tight whitespace-nowrap">
            Skyfall.com
          </Link>

          {/* Search - hidden mobile */}
          <div className="hidden md:flex bg-gray-100 dark:bg-[#111] items-center px-3.5 py-1.5 rounded-full w-[280px] text-gray-500 dark:text-[#b0b0b0] border dark:border-[#1f1f1f]">
            <Search size={16} className="text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search in cart..."
              className="bg-transparent border-none outline-none ml-2.5 text-sm w-full text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#6b7280]"
            />
          </div>
        </div>

        {/* Right - hidden on mobile */}
        <div className="hidden md:flex items-center gap-5">
          <Bell size={20} className="text-gray-500 dark:text-slate-400 cursor-pointer hover:text-[#ff6a00] transition-colors" />
          <UserTools profile={profile} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative w-full">

        {/* ===== SETTINGS CONTENT ===== */}
        <div className="flex-1 bg-gray-50 dark:bg-black px-3 md:px-6 pt-4 md:pt-6 pb-[80px] md:pb-6 overflow-y-auto min-w-0 w-full mt-0 md:mt-[50px] [scrollbar-width:thin] [scrollbar-color:#ff6a00_#f1f1f1] dark:[scrollbar-color:#333_#111] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-[#111] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#ff6a00] [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="max-w-[1000px] lg:max-w-[1200px] mx-auto">

            {/* ===== PROFILE CARD ===== */}
            <div className="bg-white dark:bg-[#111] rounded-xl p-4 md:p-6 mb-5 shadow-sm dark:shadow-black/60 border dark:border-[#1f1f1f] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 max-md:flex-col max-md:text-center md:flex md:justify-between md:items-center">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 w-full text-center md:text-left">
                <div className="w-[60px] h-[60px] md:w-[70px] md:h-[70px] bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-2xl md:text-[28px] font-bold text-[#ff6a00] border-[3px] border-white dark:border-[#111] shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover block" />
                  ) : (
                    (profile?.full_name || profile?.email)?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="m-0 text-lg md:text-[22px] text-gray-900 dark:text-white capitalize">
                    {profile?.full_name || profile?.email?.split('@')[0]}
                  </h2>
                  <p className="my-1 text-xs md:text-sm text-gray-500 dark:text-[#b0b0b0]">
                    {profile?.email}
                  </p>
                  {profile?.username && (
                    <p className="text-xs text-gray-400 dark:text-[#6b7280] font-mono">
                      @{profile.username}
                    </p>
                  )}
                </div>
                <button
                  className="w-full md:w-auto px-5 py-2.5 bg-[#ff6a00] hover:bg-[#e55a00] hover:-translate-y-px text-white border-none rounded-lg font-semibold text-[13px] cursor-pointer transition-all whitespace-nowrap mt-2 md:mt-0"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* ===== SETTINGS GRID ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">

              {/* ACCOUNT INFORMATION */}
              <div className="bg-white dark:bg-[#111] rounded-xl p-4 md:p-6 mb-5 shadow-sm dark:shadow-black/60 border dark:border-[#1f1f1f] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200">
                <h3 className="text-sm md:text-base font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-white">
                  <User size={18} /> Account information
                </h3>
                <ul className="list-none p-0 m-0">
                  <li
                    className="flex items-center justify-between px-3 py-2.5 md:px-3.5 md:py-3 rounded-lg transition-colors cursor-pointer text-sm text-gray-700 dark:text-[#b0b0b0] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#ff6a00]"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <span>My profile</span> <ChevronRight size={14} className="text-gray-300 dark:text-slate-600" />
                  </li>

                  <li
                    className="flex items-center justify-between px-3 py-2.5 md:px-3.5 md:py-3 rounded-lg transition-colors cursor-pointer text-sm text-gray-700 dark:text-[#b0b0b0] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#ff6a00]"
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                  >
                    <span>Change email</span>
                    <span className="text-xs md:text-[13px] text-gray-500 dark:text-[#6b7280] flex items-center gap-1.5">{profile?.email}</span>
                  </li>

                  <li className="flex items-center justify-between px-3 py-2.5 md:px-3.5 md:py-3 rounded-lg text-sm text-gray-700 dark:text-[#b0b0b0]">
                    <span>{t('language')}</span>
                    <div className="flex gap-1.5">
                      <button
                        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer border transition-all ${
                          language === 'en'
                            ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                            : 'bg-transparent text-gray-500 dark:text-[#b0b0b0] border-gray-200 dark:border-[#333] hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                        }`}
                        onClick={() => changeLanguage('en')}
                      >
                        EN
                      </button>
                      <button
                        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer border transition-all ${
                          language === 'sw'
                            ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                            : 'bg-transparent text-gray-500 dark:text-[#b0b0b0] border-gray-200 dark:border-[#333] hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                        }`}
                        onClick={() => changeLanguage('sw')}
                      >
                        SW
                      </button>
                    </div>
                  </li>
                </ul>

                {isEditingEmail && (
                  <div className="mt-3 flex flex-col gap-2.5 p-3 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-[#1f1f1f]">
                    <input
                      type="email"
                      placeholder="Andika email mpya"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-[#333] text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#6b7280] focus:outline-none focus:border-[#ff6a00]"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        className="px-4 py-2 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#333] rounded-lg text-xs font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-[#333] transition-colors cursor-pointer"
                        onClick={() => { setIsEditingEmail(false); setNewEmail(''); }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-[#ff6a00] hover:bg-[#e55a00] text-white rounded-md text-xs font-semibold cursor-pointer transition-colors disabled:opacity-70"
                        onClick={handleUpdateEmail}
                        disabled={emailLoading}
                      >
                        {emailLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCOUNT SECURITY */}
              <div className="bg-white dark:bg-[#111] rounded-xl p-4 md:p-6 mb-5 shadow-sm dark:shadow-black/60 border dark:border-[#1f1f1f] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200">
                <h3 className="text-sm md:text-base font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-white">
                  <Settings size={18} /> Account security
                </h3>
                <ul className="list-none p-0 m-0">
                  <li
                    className="flex items-center justify-between px-3 py-2.5 md:px-3.5 md:py-3 rounded-lg transition-colors cursor-pointer text-sm text-gray-700 dark:text-[#b0b0b0] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#ff6a00]"
                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                  >
                    <span>Change password</span> <ChevronRight size={14} className="text-gray-300 dark:text-slate-600" />
                  </li>

                  {isEditingPassword && (
                    <div className="mt-3 flex flex-col gap-2.5 p-3 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-[#1f1f1f]">
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Password ya sasa"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-[#333] text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:border-[#ff6a00]"
                        />
                        <button
                          type="button"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Password mpya (min 6)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-[#333] text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:border-[#ff6a00]"
                      />
                      <input
                        type="password"
                        placeholder="Thibitisha password mpya"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-[#333] text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:border-[#ff6a00]"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          className="px-4 py-2 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#333] rounded-lg text-xs font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-[#333] transition-colors cursor-pointer"
                          onClick={() => { setIsEditingPassword(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-[#ff6a00] hover:bg-[#e55a00] text-white rounded-md text-xs font-semibold cursor-pointer transition-colors disabled:opacity-70"
                          onClick={handleUpdatePassword}
                          disabled={passwordLoading}
                        >
                          {passwordLoading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  )}

                  <li
                    className="flex items-center justify-between px-3 py-2.5 md:px-3.5 md:py-3 rounded-lg transition-colors cursor-pointer text-sm text-gray-700 dark:text-[#b0b0b0] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#ff6a00]"
                    onClick={handlePasswordReset}
                  >
                    <span>Forgot password?</span> <ChevronRight size={14} className="text-gray-300 dark:text-slate-600" />
                  </li>

                  <li
                    className="flex items-center justify-between px-3 py-2.5 md:px-3.5 md:py-3 rounded-lg transition-colors cursor-pointer text-sm text-red-500 dark:text-[#f87171] hover:bg-red-50 dark:hover:bg-[#2d1a1a]"
                    onClick={handleDeleteAccount}
                  >
                    <span>Delete account</span> <ChevronRight size={14} className="text-gray-300 dark:text-slate-600" />
                  </li>
                </ul>
              </div>
            </div>

            {/* ===== HELPFUL LINKS ===== */}
            <div className="mt-8">
              <h3 className="text-sm md:text-base font-bold mb-4 text-gray-700 dark:text-white">
                Help & Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 md:gap-2.5">
                {helpfulLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#111] rounded-[10px] border border-gray-200 dark:border-[#1f1f1f] cursor-pointer transition-all hover:translate-x-[3px] hover:border-[#ff6a00]"
                    onClick={() => link.path === '/dashboard/seller' ? handleSellNavigation() : navigate(link.path)}
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#1a1a1a] flex items-center justify-center text-[#ff6a00] flex-shrink-0">
                      {link.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white flex-1">{link.title}</span>
                    <ChevronRight size={14} className="text-gray-300 dark:text-slate-600 ml-auto" />
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  className="flex items-center justify-center gap-3 px-5 py-3.5 bg-white dark:bg-[#111] border border-[#ff4d4f] dark:border-[#f87171] rounded-xl text-[#ff4d4f] dark:text-[#f87171] font-semibold text-sm cursor-pointer transition-all hover:bg-[#ff4d4f] hover:text-white dark:hover:bg-[#dc2626] w-full md:w-auto"
                  onClick={handleSignOut}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>

              <div className="text-center mt-6 p-4">
                <p className="text-[11px] text-gray-400 dark:text-[#6b7280]">
                  Skyfall.co.tz © 2024 • All rights reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/85 flex items-center justify-center z-[1000] p-5">
          <div className="bg-white dark:bg-[#111] rounded-2xl w-[95%] md:w-full max-w-[500px] max-h-[85vh] md:max-h-[90vh] overflow-y-auto pb-5 text-gray-900 dark:text-white">

            <div className="flex justify-between items-center px-4 md:px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] sticky top-0 bg-white dark:bg-[#111] z-10 rounded-t-2xl">
              <h3 className="m-0 text-base font-bold">Edit Profile</h3>
              <button
                className="bg-transparent border-none cursor-pointer p-1 transition-transform hover:scale-110 text-gray-500 dark:text-[#b0b0b0] hover:text-[#ff6a00] flex items-center"
                onClick={() => { setIsEditingProfile(false); setAvatarFile(null); if (avatarPreview) URL.revokeObjectURL(avatarPreview); }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 md:p-5">
              {/* Avatar Upload */}
              <div className="text-center mb-5 relative">
                <div className="relative inline-block w-[80px] h-[80px] md:w-[110px] md:h-[110px] rounded-full bg-gray-100 dark:bg-[#1a1a1a] border-[3px] border-[#ff6a00] shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-visible">
                  {avatarPreview || profile?.avatar_url ? (
                    <img src={avatarPreview || profile?.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full block" />
                  ) : (
                    <User size={50} className="text-gray-300 dark:text-slate-600 m-auto mt-2.5 md:mt-5" />
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-[#ff6a00] hover:bg-[#e55a00] hover:scale-110 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-white border-[3px] border-white dark:border-[#111] shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all z-[5]"
                  >
                    <Camera size={16} />
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
                <p className="text-xs md:text-[13px] text-gray-500 dark:text-[#6b7280] mt-3 font-medium">
                  Bonyeza kamera kubadilisha picha
                </p>
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 font-semibold text-sm text-gray-700 dark:text-white">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-[#333] text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 font-semibold text-sm text-gray-700 dark:text-white">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-[#333] text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 font-semibold text-sm text-gray-700 dark:text-white">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-[#333] text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-[inherit] focus:outline-none focus:border-[#ff6a00] resize-y"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:gap-2.5 justify-end pt-2.5">
                <button
                  className="w-full md:w-auto px-5 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#333] rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-[#333] transition-colors cursor-pointer"
                  onClick={() => { setIsEditingProfile(false); setAvatarFile(null); if (avatarPreview) URL.revokeObjectURL(avatarPreview); }}
                >
                  Cancel
                </button>
                <button
                  className="w-full md:w-auto px-5 py-2.5 bg-[#ff6a00] hover:bg-[#e55a00] hover:-translate-y-px text-white border-none rounded-lg cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold transition-all disabled:opacity-70"
                  onClick={handleUpdateProfile}
                  disabled={profileSaving}
                >
                  <Save size={16} /> {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;