// src/pages/AccountSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../axiosConfig'; // 🔥 Badilisha: Tumia api kutoka axiosConfig!
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, User, LogOut, ChevronRight, Menu, X, Eye, EyeOff,
  Camera, Upload, Save, HelpCircle, FileText, Shield, Phone, Mail, Globe, Truck, Store
} from 'lucide-react';
import UserTools from '../components/UserTools';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';
import toast from 'react-hot-toast';
import '../AccountSettings.css';

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

  if (loading) {
    return (
      <div className="dashboard-layout">
        {/* 🔥 Skeleton Header */}
        <div className="skeleton-header"></div>

        <div className="dashboard-main">
          {/* 🔥 Skeleton Sidebar (Inaonekana Desktop tu) */}
          <div className="skeleton-sidebar-account"></div>

          {/* 🔥 Skeleton Content */}
          <div className="settings-container">
            <div className="settings-wrapper">
              <div className="skeleton-profile-card"></div>
              <div className="skeleton-settings-grid"></div>
            </div>
          </div>
        </div>
      </div>
    );
}

  return (
    <div className="dashboard-layout">
      
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          {!isExpanded && (
            <Menu 
              size={22} 
              className="icon-btn menu-toggle" 
              onClick={() => setIsExpanded(!isExpanded)} 
            />
          )}
          <Link to="/dashboard" className="logo-text">
            Skyfall.com
          </Link>
          <div className="search-box">
            <Search size={16} color="#999" />
            <input type="text" placeholder="Search in cart..." />
          </div>
        </div>

        <div className="header-right">
          <Bell size={20} className="icon-btn" />
          {/* 🔥 UserTools sasa inaweza kupokea profile kupitia prop au context */}
          <UserTools profile={profile} /> 
        </div>
      </header>

      <div className="dashboard-main">
        
        {/* SIDEBAR */}
        <aside 
          className={`dashboard-sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
          onMouseEnter={() => setIsExpanded(true)} 
          onMouseLeave={() => setIsExpanded(false)} 
        >
          {sidebarItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              data-tooltip={item.label}
            >
              {item.icon}
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </aside>

        {/* SETTINGS CONTENT */}
        <div className="settings-container">
          <div className="settings-wrapper">
            
            {/* PROFILE CARD */}
            <div className="settings-card profile-header-card">
              <div className="profile-info-main">
                <div className="avatar-circle">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="avatar-img-real" />
                  ) : (
                    (profile?.full_name || profile?.email)?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="user-details-text">
                  <h2 className="user-full-name">
                    {profile?.full_name || profile?.email?.split('@')[0]}
                  </h2>
                  <p className="user-email-sub">{profile?.email}</p>
                  {profile?.username && <p className="user-username">@{profile.username}</p>}
                </div>
                <button className="btn-edit-profile" onClick={() => setIsEditingProfile(true)}>
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="settings-grid">
              
              {/* ACCOUNT INFORMATION */}
              <div className="settings-card">
                <h3 className="section-title">
                  <User size={18} /> Account information
                </h3>
                <ul className="settings-links-list">
                  <li className="link-item" onClick={() => setIsEditingProfile(true)}>
                    <span>My profile</span> <ChevronRight size={14} color="#ccc" />
                  </li>
                  
                  <li className="link-item flex-between" onClick={() => setIsEditingEmail(!isEditingEmail)}>
                    <span>Change email</span>
                    <span className="sub-text">{profile?.email}</span>
                  </li>
                  
                  {/* Language Switcher */}
                  <li className="link-item flex-between">
                    <span>{t('language')}</span>
                    <div className="language-switcher">
                      <button
                        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                        onClick={() => changeLanguage('en')}
                      >
                        EN
                      </button>
                      <button
                        className={`lang-btn ${language === 'sw' ? 'active' : ''}`}
                        onClick={() => changeLanguage('sw')}
                      >
                        SW
                      </button>
                    </div>
                  </li>
                </ul>

                {/* Email Edit Form - Inline */}
                {isEditingEmail && (
                  <div className="email-edit-form">
                    <input 
                      type="email" 
                      placeholder="Andika email mpya" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="modal-input"
                      autoFocus 
                    />
                    <div className="inline-actions">
                      <button 
                        className="btn-cancel"
                        onClick={() => { setIsEditingEmail(false); setNewEmail(''); }}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn-save"
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
              <div className="settings-card">
                <h3 className="section-title">
                  <Settings size={18} /> Account security
                </h3>
                <ul className="settings-links-list">
                  <li className="link-item flex-between" onClick={() => setIsEditingPassword(!isEditingPassword)}>
                    <span>Change password</span> <ChevronRight size={14} color="#ccc" />
                  </li>

                  {/* Password Edit Form - Inline */}
                  {isEditingPassword && (
                    <div className="password-edit-form">
                      <div className="input-group">
                        <input 
                          type={showCurrentPassword ? "text" : "password"} 
                          placeholder="Password ya sasa"
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="modal-input"
                        />
                        <button 
                          type="button" 
                          className="toggle-password"
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
                        className="modal-input"
                      />
                      <input 
                        type="password" 
                        placeholder="Thibitisha password mpya"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="modal-input"
                      />
                      <div className="inline-actions">
                        <button 
                          className="btn-cancel"
                          onClick={() => { setIsEditingPassword(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn-save"
                          onClick={handleUpdatePassword} 
                          disabled={passwordLoading}
                        >
                          {passwordLoading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  )}

                  <li className="link-item" onClick={handlePasswordReset}>
                    <span>Forgot password?</span> <ChevronRight size={14} color="#ccc" />
                  </li>
                  
                  <li className="link-item delete-acc" onClick={handleDeleteAccount}>
                    <span>Delete account</span> <ChevronRight size={14} color="#ccc" />
                  </li>
                </ul>
              </div>
            </div>

            {/* HELPFUL LINKS */}
            <div className="helpful-links-section">
              <h3 className="section-title">Help & Information</h3>
              <div className="helpful-links-grid">
                {helpfulLinks.map((link, index) => (
                  <div 
                    key={index}
                    className="helpful-link-item"
                    onClick={() => navigate(link.path)}
                  >
                    <div className="helpful-icon-box">
                      {link.icon}
                    </div>
                    <span className="helpful-link-title">{link.title}</span>
                    <ChevronRight size={14} color="#ccc" className="helpful-arrow" />
                  </div>
                ))}
              </div>

              {/* SIGN OUT BUTTON */}
              <div className="sign-out-wrapper">
                <button className="sign-out-btn" onClick={handleSignOut}>
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
              
              <div className="footer-copyright">
                <p>Skyfall.com © 2024 • All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button 
                className="modal-close"
                onClick={() => { setIsEditingProfile(false); setAvatarFile(null); if(avatarPreview) URL.revokeObjectURL(avatarPreview); }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="avatar-upload-area">
                <div className="avatar-upload-circle">
                  {avatarPreview || profile?.avatar_url ? (
                    <img src={avatarPreview || profile?.avatar_url} alt="Avatar" className="avatar-preview-img" />
                  ) : (
                    <User size={50} color="#ccc" />
                  )}
                </div>
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  <Camera size={16} />
                  <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden-input" />
                </label>
                <p className="avatar-hint">Bonyeza kamera kubadilisha picha</p>
              </div>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="modal-input" />
              </div>
              
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="modal-input" />
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" className="modal-textarea" />
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => { setIsEditingProfile(false); setAvatarFile(null); if(avatarPreview) URL.revokeObjectURL(avatarPreview); }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-save-primary"
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