// src/pages/AccountSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, User, LogOut, ChevronRight, Menu, X, Eye, EyeOff,
  Camera, Upload, Save, HelpCircle, FileText, Shield, Phone, Mail, Globe, Truck, Store
} from 'lucide-react';
import UserTools from '../components/UserTools';
import { useTranslation } from 'react-i18next'; // ✅ Ongeza hii
import { useLanguage } from '../context/LanguageContext.jsx'; // ✅ Ongeza hii
import toast from 'react-hot-toast';
import '../AccountSettings.css';

const AccountSettings = ({ session }) => {
  const { t } = useTranslation(); // ✅ Tafsiri
  const { language, changeLanguage } = useLanguage(); // ✅ Language hook
  const navigate = useNavigate();
  const location = useLocation();
  const user = session?.user;

  // --- STATE ZA SIDEBAR NA DATA ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // --- 1. VUTA DATA KUTOKA DATABASE ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        setFullName(data?.full_name || '');
        setUsername(data?.username || '');
        setBio(data?.bio || '');
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Check if user has a store
  useEffect(() => {
    const checkUserStore = async () => {
      if (!user) return;
      try {
        const { data: store, error } = await supabase
          .from('stores_engine')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();
        if (!error && store) {
          setUserStoreId(store.id);
        } else {
          setUserStoreId(null);
        }
      } catch (error) {
        console.error('Error checking store:', error);
        setUserStoreId(null);
      }
    };
    checkUserStore();
  }, [user]);

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

  // --- 3. UPLOAD AVATAR TO SUPABASE STORAGE ---
  const uploadAvatar = async (userId, file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = fileName;
    try {
      const { data: existingFiles } = await supabase.storage
        .from('avatars')
        .list('', { search: userId });
      if (existingFiles && existingFiles.length > 0) {
        await supabase.storage.from('avatars').remove([existingFiles[0].name]);
      }
    } catch (error) {
      console.log('No existing avatar to delete');
    }
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }
    const { data: publicUrl } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    return publicUrl.publicUrl;
  };

  // --- 4. UPDATE PROFILE ---
  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error('Tafadhali weka jina lako kamili');
      return;
    }
    setProfileSaving(true);
    try {
      let avatarUrl = profile?.avatar_url;
      if (avatarFile) {
        toast.loading('Inapakia picha...', { id: 'avatar-upload' });
        const uploadedUrl = await uploadAvatar(user.id, avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
          toast.success('Picha imepakiwa!', { id: 'avatar-upload' });
        } else {
          toast.error('Imeshindikana kupakia picha', { id: 'avatar-upload' });
        }
      }
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username || null,
          bio: bio || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      if (error) throw error;
      setProfile({
        ...profile,
        full_name: fullName,
        username: username,
        bio: bio,
        avatar_url: avatarUrl
      });
      toast.success('Profile imesasishwa kwa mafanikio!');
      setIsEditingProfile(false);
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Imeshindikana kusasisha profile: ' + error.message);
    } finally {
      setProfileSaving(false);
    }
  };

  // --- 5. UPDATE EMAIL ---
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
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      await supabase.from('profiles').update({ email: newEmail }).eq('id', user.id);
      toast.success('Maombi yamepokelewa! Kagua email yako mpya kuthibitisha.');
      setIsEditingEmail(false);
      setNewEmail('');
    } catch (error) {
      toast.error('Imeshindikana kusasisha email: ' + error.message);
    } finally {
      setEmailLoading(false);
    }
  };

  // --- 6. UPDATE PASSWORD ---
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      if (signInError) {
        toast.error('Password yako ya sasa si sahihi');
        setPasswordLoading(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password imesasishwa kwa mafanikio!');
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Imeshindikana kusasisha password: ' + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- 7. RESET PASSWORD ---
  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/account-settings`,
      });
      if (error) throw error;
      toast.success(`Link imetumwa kwenye email yako: ${user.email}`, { duration: 6000 });
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  // --- 8. DELETE ACCOUNT ---
  const handleDeleteAccount = async () => {
    const confirm = window.confirm('Je, una uhakika unataka kufuta akaunti yako? Hatua hii haiwezi kubadilishwa!');
    if (!confirm) return;
    try {
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.admin.deleteUser(user.id);
      toast.success('Akaunti imefutwa kwa mafanikio');
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      toast.error('Imeshindikana kufuta akaunti: ' + error.message);
    }
  };

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
          <UserTools session={session} />
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
                    (profile?.full_name || user?.email)?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="user-details-text">
                  <h2 className="user-full-name">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </h2>
                  <p className="user-email-sub">{user?.email}</p>
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
                    <span className="sub-text">{user?.email}</span>
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
                <button
                  className="sign-out-btn"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/');
                    toast.success('Umefanikiwa kutoka!');
                  }}
                >
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