import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../axiosConfig';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Bell, Search, User, LogOut, ChevronRight,
  Camera, Save, HelpCircle, FileText, Shield, Phone, Mail, Globe, Truck, Store, Home, Megaphone, X, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import '../SupplierAccountSettings.css';

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
      <div className="dashboard-layout">
        <div className="skeleton-header" />
        <div className="settings-main">
          {!isMobile && <div className="skeleton-sidebar" />}
          <div className="settings-container">
            <div className="settings-wrapper">
              <div className="skeleton-box skeleton-profile-card" />
              <div className="skeleton-settings-grid">
                <div className="skeleton-box" />
                <div className="skeleton-box" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ MAIN RENDER ============
  return (
    <div className="dashboard-layout">
      
      {/* HEADER */}
      <header className="settings-header">
        <div className="settings-header-left">
          {!isMobile && (
            <Settings 
              size={22} 
              style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} 
              onClick={() => setIsExpanded(!isExpanded)} 
            />
          )}
          <Link to="/dashboard/sellerboard" className="settings-header-logo">
            Skyfall.com
          </Link>
          {!isMobile && (
            <div className="settings-header-search">
              <Search size={16} color="var(--text-muted)" />
              <input type="text" placeholder="Search..." />
            </div>
          )}
        </div>
        <div className="settings-header-right">
          {!isMobile && <Bell size={20} className="settings-icon-btn" />}
        </div>
      </header>

      <div className="settings-main">
        
        {/* SIDEBAR (Desktop) */}
        {!isMobile && (
          <aside 
            className={`settings-sidebar ${isExpanded ? 'expanded' : ''}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`settings-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <div className="settings-sidebar-icon">{item.icon}</div>
                <span className="settings-sidebar-label">{item.label}</span>
              </Link>
            ))}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <div className="settings-container">
          <div className="settings-wrapper">

            {/* PROFILE HEADER */}
            <div className="profile-header-card">
              <div className="profile-info-main">
                <div className="avatar-circle">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" />
                  ) : (
                    (profile?.full_name || profile?.email || 'U')?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="user-details-text">
                  <h2 className="user-full-name">{profile?.full_name || "Mtumiaji"}</h2>
                  <p className="user-email-sub">{profile?.email || "Hakuna Email"}</p>
                  {profile?.username && <p className="user-username">@{profile.username}</p>}
                </div>
                <button className="btn-edit-profile" onClick={() => setIsEditingProfile(true)}>
                  Edit Profile
                </button>
              </div>
            </div>

            {/* SETTINGS GRID */}
            <div className="settings-grid">
              
              {/* Account Information */}
              <div className="settings-card">
                <h3><User size={18} /> Account information</h3>
                <ul className="settings-list">
                  <li className="settings-list-item" onClick={() => setIsEditingProfile(true)}>
                    My profile <ChevronRight size={14} />
                  </li>
                  <li className="settings-list-item" onClick={() => setIsEditingEmail(!isEditingEmail)}>
                    <span>Change email</span>
                    <span className="sub-text">{profile?.email}</span>
                  </li>
                  {isEditingEmail && (
                    <li>
                      <div className="inline-form">
                        <input 
                          type="email" 
                          placeholder="Andika email mpya" 
                          value={newEmail} 
                          onChange={(e) => setNewEmail(e.target.value)} 
                        />
                        <div className="inline-form-actions">
                          <button className="btn-secondary" onClick={() => setIsEditingEmail(false)}>Cancel</button>
                          <button className="btn-primary" onClick={handleUpdateEmail} disabled={emailLoading}>
                            {emailLoading ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Account Security */}
              <div className="settings-card">
                <h3><Settings size={18} /> Account security</h3>
                <ul className="settings-list">
                  <li className="settings-list-item" onClick={() => setIsEditingPassword(!isEditingPassword)}>
                    Change password <ChevronRight size={14} />
                  </li>
                  {isEditingPassword && (
                    <li>
                      <div className="inline-form">
                        {/* Password ya sasa */}
                        <div className="password-input-wrap">
                          <input 
                            type={showCurrentPassword ? "text" : "password"} 
                            placeholder="Password ya sasa" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                          />
                          <button 
                            type="button" 
                            className="toggle-password"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        
                        {/* Password mpya */}
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="Password mpya (min 6)" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                        />
                        
                        {/* Thibitisha password */}
                        <input 
                          type="password" 
                          placeholder="Thibitisha password mpya" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                        
                        <div className="inline-form-actions">
                          <button 
                            className="btn-secondary" 
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
                            className="btn-primary" 
                            onClick={handleUpdatePassword} 
                            disabled={passwordLoading}
                          >
                            {passwordLoading ? 'Updating...' : 'Update'}
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                  <li className="settings-list-item" onClick={handlePasswordReset}>
                    Forgot password? <ChevronRight size={14} />
                  </li>
                  <li className="settings-list-item danger" onClick={handleDeleteAccount}>
                    Delete account <ChevronRight size={14} />
                  </li>
                </ul>
              </div>
            </div>

            {/* STORE RETURN CARD */}
            <div className="store-return-card" onClick={() => navigate('/dashboard/sellerboard')}>
              <div className="store-return-icon"><Store size={20} /></div>
              <div className="store-return-text">
                <div className="store-return-title">Rudi kwenye Duka Lako</div>
                <p className="store-return-sub">Dhibiti bidhaa, oda na taarifa za duka lako</p>
              </div>
              <ChevronRight size={18} color="var(--accent)" />
            </div>

            {/* HELPFUL LINKS */}
            <div className="helpful-links-section">
              <h3>Help & Information</h3>
              <div className="helpful-links-grid">
                {helpfulLinks.map((link, index) => (
                  <div key={index} className="helpful-link-item" onClick={() => navigate(link.path)}>
                    <div className="helpful-icon-box">{link.icon}</div>
                    <span className="helpful-link-title">{link.title}</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                ))}
              </div>

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

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <nav className="mobile-bottom-nav">
          <button onClick={() => navigate('/dashboard/sellerboard')} className={location.pathname.startsWith('/dashboard/sellerboard') ? 'active' : ''}>
            <Home size={22} />
            <span>Duka</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} className={location.pathname === '/dashboard/supplier-notifications' ? 'active' : ''}>
            <ClipboardList size={22} />
            <span>Oda</span>
          </button>
          <button onClick={() => navigate('/advertise')} className={location.pathname === '/advertise' ? 'active' : ''}>
            <Megaphone size={22} />
            <span>Ads</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} className={location.pathname === '/dashboard/supplier-notifications' ? 'active' : ''}>
            <Bell size={22} />
            <span>Arifa</span>
          </button>
        </nav>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close" onClick={() => setIsEditingProfile(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              
              {/* Avatar */}
              <div className="avatar-upload-area">
                <div className="avatar-upload-circle">
                  {avatarPreview || profile?.avatar_url ? (
                    <img src={avatarPreview || profile?.avatar_url} alt="Avatar" className="avatar-preview-img" />
                  ) : (
                    <div className="avatar-placeholder"><User size={50} /></div>
                  )}
                  <label htmlFor="supplier-avatar-upload" className="avatar-upload-label">
                    <Camera size={16} />
                    <input 
                      id="supplier-avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleAvatarChange} 
                    />
                  </label>
                </div>
                <p className="avatar-hint">Bonyeza kamera kubadilisha picha</p>
              </div>

              {/* Form */}
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" />
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleUpdateProfile} disabled={profileSaving}>
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