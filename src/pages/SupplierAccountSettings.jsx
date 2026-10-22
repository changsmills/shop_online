// src/pages/SupplierAccountSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../axiosConfig';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Bell, Search, User, LogOut, ChevronRight,
  Camera, Save, HelpCircle, FileText, Shield, Phone, Mail, Globe, Truck, Store, Home, Megaphone, X, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const SupplierAccountSettings = ({ session }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Effects
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) { navigate('/dashboard/login'); return; }
        const headers = { Authorization: `Bearer ${token}` };
        const response = await api.get('/profile/', { headers });
        setProfile(response.data);
        setFullName(response.data?.full_name || '');
        setUsername(response.data?.username || '');
        setBio(response.data?.bio || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Imeshindwa kupakia profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Handlers
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) { toast.error('Tafadhali chagua picha tu'); return; }
      if (file.size > 2 * 1024 * 1024) { toast.error('Picha inapaswa kuwa chini ya 2MB'); return; }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) { toast.error('Tafadhali weka jina lako kamili'); return; }
    setProfileSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) { toast.error("Session imeisha"); navigate('/dashboard/login'); return; }
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('username', username || '');
      formData.append('bio', bio || '');
      if (avatarFile) formData.append('avatar_file', avatarFile);
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.patch('/profile/', formData, { headers });
      setProfile({ ...profile, ...response.data });
      toast.success('Profile imesasishwa!');
      setIsEditingProfile(false);
      setAvatarFile(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Imeshindikana: ' + (error.response?.data?.detail || error.message));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdateEmail = async () => { toast.error("Kubadilisha Email bado haijakamilika."); };
  const handleUpdatePassword = async () => { toast.error("Kubadilisha Password bado haijakamilika."); };
  const handlePasswordReset = async () => { toast.error("Password Reset bado haijakamilika."); };
  const handleDeleteAccount = async () => { toast.error("Kufuta akaunti bado haijakamilika."); };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) await api.post('/supplier/logout/', {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) { console.error("Logout error:", err); }
    finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/dashboard/login', { replace: true });
      toast.success('Umefanikiwa kutoka!');
    }
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard/sellerboard', label: 'Duka Lako' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/supplier-messages', label: 'Ujumbe' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/supplier-notifications', label: 'Arifa (Oda)' },
    { icon: <Settings size={20} />, path: '/dashboard/supplier-settings', label: 'Mipangilio' },
  ];

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
  ];

  // ============ SKELETON LOADING ============
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-black overflow-hidden font-sans">
        <div className="h-[60px] bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 animate-pulse" />
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && <div className="w-[72px] bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 animate-pulse" />}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-[1000px] mx-auto w-full">
              <div className="h-[120px] bg-gray-200 dark:bg-gray-800 rounded-xl mb-5 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="h-[200px] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="h-[200px] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ MAIN RENDER ============
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden font-sans bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      
      {/* HEADER */}
      <header className="h-[60px] bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 z-[100] shrink-0">
        <div className="flex items-center gap-4">
          {!isMobile && (
            <Settings 
              size={22} 
              className="cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={() => setIsExpanded(!isExpanded)} 
            />
          )}
          <Link to="/dashboard/sellerboard" className="text-xl font-extrabold text-[#ff6a00] hover:opacity-80">
            Skyfall.com
          </Link>
          {!isMobile && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg ml-2">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none ml-2 text-sm text-gray-900 dark:text-white w-44" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && <Bell size={20} className="text-gray-500 hover:text-[#ff6a00] cursor-pointer" />}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR (Desktop) */}
        {!isMobile && (
          <aside 
            className={`bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 flex flex-col pt-2.5 transition-all duration-300 overflow-hidden shrink-0 z-10 ${
              isExpanded ? 'w-[240px]' : 'w-[72px]'
            }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center h-12 mx-2.5 my-1 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-[#ff6a00] bg-[#fff5ed] dark:bg-[#ff6a00]/10' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="min-w-[52px] flex justify-center items-center">
                    {item.icon}
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-opacity duration-200 ml-1 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 bg-gray-50 dark:bg-black p-4 md:p-6 overflow-y-auto pb-24 md:pb-6">
          <div className="max-w-[1000px] mx-auto w-full">

            {/* PROFILE HEADER */}
            <div className="bg-white dark:bg-[#111111] p-5 md:p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-5 shadow-sm">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                <div className="w-[70px] h-[70px] rounded-full bg-[#ff6a00] text-white flex items-center justify-center text-2xl font-bold overflow-hidden shrink-0">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (profile?.full_name || profile?.email || 'U')?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 text-center md:text-left min-w-0">
                  <h2 className="m-0 text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {profile?.full_name || "Mtumiaji"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 mb-0 text-sm truncate">
                    {profile?.email || "Hakuna Email"}
                  </p>
                  {profile?.username && (
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 mb-0">
                      @{profile.username}
                    </p>
                  )}
                </div>
                <button 
                  className="w-full md:w-auto px-6 py-2.5 bg-[#ff6a00] hover:bg-[#e55a00] text-white font-semibold text-sm rounded-lg transition-colors" 
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* SETTINGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Account Information */}
              <div className="bg-white dark:bg-[#111111] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
                  <User size={18} /> Account information
                </h3>
                <ul className="list-none p-0 m-0">
                  <li className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer text-sm text-gray-900 dark:text-white hover:text-[#ff6a00] transition-colors" onClick={() => setIsEditingProfile(true)}>
                    My profile <ChevronRight size={14} />
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer text-sm text-gray-900 dark:text-white hover:text-[#ff6a00] transition-colors" onClick={() => setIsEditingEmail(!isEditingEmail)}>
                    <span>Change email</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{profile?.email}</span>
                  </li>
                  
                  {isEditingEmail && (
                    <li className="py-2">
                      <div className="flex flex-col gap-2 mt-3 p-3 bg-gray-50 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                        <input 
                          type="email" 
                          placeholder="Andika email mpya" 
                          value={newEmail} 
                          onChange={(e) => setNewEmail(e.target.value)} 
                          className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111111] text-sm text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]"
                        />
                        <div className="flex gap-2 justify-end">
                          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700" onClick={() => setIsEditingEmail(false)}>Cancel</button>
                          <button className="px-4 py-2 bg-[#ff6a00] text-white rounded-lg text-sm font-semibold hover:bg-[#e55a00] disabled:opacity-50" onClick={handleUpdateEmail} disabled={emailLoading}>
                            {emailLoading ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Account Security */}
              <div className="bg-white dark:bg-[#111111] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
                  <Settings size={18} /> Account security
                </h3>
                <ul className="list-none p-0 m-0">
                  <li className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer text-sm text-gray-900 dark:text-white hover:text-[#ff6a00] transition-colors" onClick={() => setIsEditingPassword(!isEditingPassword)}>
                    Change password <ChevronRight size={14} />
                  </li>
                  
                  {isEditingPassword && (
                    <li className="py-2">
                      <div className="flex flex-col gap-2 mt-3 p-3 bg-gray-50 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="relative">
                          <input 
                            type={showCurrentPassword ? "text" : "password"} 
                            placeholder="Password ya sasa" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            className="w-full p-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111111] text-sm text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]"
                          />
                          <button 
                            type="button" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
                          className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111111] text-sm text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]"
                        />
                        
                        <input 
                          type="password" 
                          placeholder="Thibitisha password mpya" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111111] text-sm text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]"
                        />
                        
                        <div className="flex gap-2 justify-end mt-1">
                          <button 
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700" 
                            onClick={() => { 
                              setIsEditingPassword(false); 
                              setCurrentPassword(''); 
                              setNewPassword(''); 
                              setConfirmPassword(''); 
                            }}
                          >
                            Cancel
                          </button>
                          <button 
                            className="px-4 py-2 bg-[#ff6a00] text-white rounded-lg text-sm font-semibold hover:bg-[#e55a00] disabled:opacity-50" 
                            onClick={handleUpdatePassword} 
                            disabled={passwordLoading}
                          >
                            {passwordLoading ? 'Updating...' : 'Update'}
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                  
                  <li className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer text-sm text-gray-900 dark:text-white hover:text-[#ff6a00] transition-colors" onClick={handlePasswordReset}>
                    Forgot password? <ChevronRight size={14} />
                  </li>
                  <li className="flex justify-between items-center py-3 cursor-pointer text-sm text-red-500 hover:text-red-600 transition-colors" onClick={handleDeleteAccount}>
                    Delete account <ChevronRight size={14} />
                  </li>
                </ul>
              </div>
            </div>

            {/* STORE RETURN CARD */}
            <div className="flex items-center gap-3 p-4 md:px-5 bg-orange-50 dark:bg-[#ff6a00]/10 rounded-xl border border-[#ff6a00] cursor-pointer mt-8 transition-transform hover:-translate-y-0.5" onClick={() => navigate('/dashboard/sellerboard')}>
              <div className="w-10 h-10 rounded-full bg-[#ff6a00] flex items-center justify-center text-white shrink-0">
                <Store size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[#ff6a00]">Rudi kwenye Duka Lako</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-0">Dhibiti bidhaa, oda na taarifa za duka lako</p>
              </div>
              <ChevronRight size={18} className="text-[#ff6a00]" />
            </div>

            {/* HELPFUL LINKS */}
            <div className="mt-8">
              <h3 className="text-base font-bold mb-4 text-gray-900 dark:text-white pl-1">Help & Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {helpfulLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-[#111111] rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer transition-all hover:translate-x-1 hover:border-[#ff6a00]" onClick={() => navigate(link.path)}>
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#ff6a00]/10 flex items-center justify-center text-[#ff6a00] shrink-0">
                      {link.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white flex-1 truncate">{link.title}</span>
                    <ChevronRight size={14} className="text-gray-400 shrink-0" />
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="flex items-center justify-center gap-3 w-full p-3.5 bg-white dark:bg-[#111111] border border-red-500 rounded-xl text-red-500 font-semibold text-sm hover:bg-red-500 hover:text-white transition-colors" onClick={handleSignOut}>
                  <LogOut size={18} /> Sign Out
                </button>
              </div>

              <div className="text-center mt-6 p-4">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 m-0">Skyfall.com © 2024 • All rights reserved</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111111] border-t border-gray-200 dark:border-gray-800 flex justify-around items-center pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] z-[1000]">
          <button onClick={() => navigate('/dashboard/sellerboard')} className={`flex flex-col items-center bg-transparent border-none flex-1 gap-1 cursor-pointer ${location.pathname.startsWith('/dashboard/sellerboard') ? 'text-[#ff6a00]' : 'text-gray-500'}`}>
            <Home size={22} />
            <span className="text-[10px] font-medium">Duka</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} className={`flex flex-col items-center bg-transparent border-none flex-1 gap-1 cursor-pointer ${location.pathname === '/dashboard/supplier-notifications' ? 'text-[#ff6a00]' : 'text-gray-500'}`}>
            <ClipboardList size={22} />
            <span className="text-[10px] font-medium">Oda</span>
          </button>
          <button onClick={() => navigate('/advertise')} className={`flex flex-col items-center bg-transparent border-none flex-1 gap-1 cursor-pointer ${location.pathname === '/advertise' ? 'text-[#ff6a00]' : 'text-gray-500'}`}>
            <Megaphone size={22} />
            <span className="text-[10px] font-medium">Ads</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} className={`flex flex-col items-center bg-transparent border-none flex-1 gap-1 cursor-pointer ${location.pathname === '/dashboard/supplier-notifications' ? 'text-[#ff6a00]' : 'text-gray-500'}`}>
            <Bell size={22} />
            <span className="text-[10px] font-medium">Arifa</span>
          </button>
        </nav>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white dark:bg-[#111111] rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#111111] z-10">
              <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white">Edit Profile</h3>
              <button className="bg-transparent border-none cursor-pointer text-gray-500 hover:text-[#ff6a00] p-1" onClick={() => setIsEditingProfile(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              
              {/* Avatar */}
              <div className="text-center mb-5">
                <div className="relative inline-block w-[110px] h-[110px] rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {avatarPreview || profile?.avatar_url ? (
                    <img src={avatarPreview || profile?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={50} />
                    </div>
                  )}
                  <label htmlFor="supplier-avatar-upload" className="absolute bottom-1 right-1 bg-[#ff6a00] rounded-full w-[34px] h-[34px] flex items-center justify-center cursor-pointer text-white border-[3px] border-white dark:border-[#111111] hover:scale-110 transition-transform">
                    <Camera size={16} />
                    <input 
                      id="supplier-avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange} 
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2.5">Bonyeza kamera kubadilisha picha</p>
              </div>

              {/* Form */}
              <div className="mb-4">
                <label className="block mb-1.5 font-semibold text-sm text-gray-900 dark:text-white">Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black text-sm text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]" />
              </div>
              <div className="mb-4">
                <label className="block mb-1.5 font-semibold text-sm text-gray-900 dark:text-white">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black text-sm text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]" />
              </div>
              <div className="mb-4">
                <label className="block mb-1.5 font-semibold text-sm text-gray-900 dark:text-white">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black text-sm text-gray-900 dark:text-white outline-none focus:border-[#ff6a00] resize-y min-h-[80px]" />
              </div>

              <div className="flex gap-2.5 justify-end mt-5">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                <button className="px-4 py-2 bg-[#ff6a00] text-white rounded-lg text-sm font-semibold hover:bg-[#e55a00] disabled:opacity-50 flex items-center gap-2" onClick={handleUpdateProfile} disabled={profileSaving}>
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

export default SupplierAccountSettings;