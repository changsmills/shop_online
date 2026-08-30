import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../axiosConfig'; // 🔥 Tumia api
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Bell, Search, User, LogOut, ChevronRight, Menu, X, Eye, EyeOff,
  Camera, Save, HelpCircle, FileText, Shield, Phone, Mail, Globe, Truck, Store, Home, Megaphone
} from 'lucide-react';
import toast from 'react-hot-toast';
import '../AccountSettings.css';

const SupplierAccountSettings = ({ session }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // 🔥 1. MPYA: State za Kupakia Picha
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate('/dashboard/login');
          return;
        }

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

  // 🔥 2. MPYA: Function ya kuchagua Picha
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

  // 🔥 3. BADILISHA: Inatumia FormData na avatar_file
  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error('Tafadhali weka jina lako kamili');
      return;
    }
    
    setProfileSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Session imeisha, tafadhali login tena.");
        navigate('/dashboard/login');
        return;
      }

      // 🔥 TENGENEZA FORMDATA (Muhimu kwa picha!)
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('username', username || '');
      formData.append('bio', bio || '');

      if (avatarFile) {
        formData.append('avatar_file', avatarFile); // 🔥 Hii ndiyo inayotumiwa na Backend!
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.patch('/profile/', formData, { headers });

      setProfile({ ...profile, ...response.data });
      toast.success('Profile imesasishwa kwa mafanikio!');
      setIsEditingProfile(false);
      setAvatarFile(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
      
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Imeshindikana kusasisha profile: ' + (error.response?.data?.detail || error.message));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    toast.error("Kubadilisha Email bado haijakamilika kwenye Backend.");
  };

  const handleUpdatePassword = async () => {
    toast.error("Kubadilisha Password inahitaji endpoint ya ziada kwenye Backend.");
  };

  const handlePasswordReset = async () => {
    toast.error("Huduma ya Password Reset bado haijakamilika kwenye Backend.");
  };

  const handleDeleteAccount = async () => {
    toast.error("Kufuta akaunti bado haijakamilika kwenye Backend.");
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

  const handleSignOut = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      await api.post('/supplier/logout/', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/dashboard/login', { replace: true });
    toast.success('Umefanikiwa kutoka!');
  }
};

  // 🔥 4. MPYA: SKELETON LOADING (Ili page isionekane tupu)
  if (loading) {
    return (
      <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className="skeleton-header"></div>
        <div className="dashboard-main" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {!isMobile && <div className="skeleton-sidebar-account"></div>}
          <div className="settings-container" style={{ flex: 1, padding: isMobile ? '16px' : '24px', backgroundColor: '#f7f8fa' }}>
            <div className="settings-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="skeleton-profile-card"></div>
              <div className="skeleton-settings-grid"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* HEADER */}
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '10px 16px' : '10px 24px', borderBottom: '1px solid #eee', backgroundColor: '#fff', zIndex: 100 }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
          {!isMobile && <Menu size={22} style={{ cursor: 'pointer', color: '#666' }} onClick={() => setIsExpanded(!isExpanded)} />}
          <Link to="/dashboard/sellerboard" style={{ fontSize: isMobile ? '20px' : '20px', fontWeight: '800', color: '#ff6a00', textDecoration: 'none' }}>Skyfall.com</Link>
          {!isMobile && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '6px 12px', borderRadius: '8px', marginLeft: '10px' }}>
              <Search size={16} color="#999" />
              <input type="text" placeholder="Search..." style={{ border: 'none', background: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' }} />
            </div>
          )}
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!isMobile && <Bell size={20} style={{ cursor: 'pointer', color: '#666' }} />}
        </div>
      </header>

      <div className="dashboard-main" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {!isMobile && (
          <aside onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)} style={{ width: isExpanded ? '240px' : '72px', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflowX: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRight: '1px solid #eee', paddingTop: '10px', flexShrink: 0, zIndex: 10 }}>
            {sidebarItems.map((item) => (
              <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', height: '48px', textDecoration: 'none', margin: '4px 10px', borderRadius: '8px', color: location.pathname === item.path ? '#ff6a00' : '#666', backgroundColor: location.pathname === item.path ? '#fff5ed' : 'transparent' }}>
                <div style={{ minWidth: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.icon}</div>
                <span style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: isExpanded ? 'auto' : 'none', marginLeft: '4px' }}>{item.label}</span>
              </Link>
            ))}
          </aside>
        )}

        <div className="settings-container" style={{ flex: 1, padding: isMobile ? '16px' : '24px', backgroundColor: '#f7f8fa', overflowY: 'auto' }}>
          <div className="settings-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            <div className="settings-card profile-header-card" style={{ background: '#fff', padding: isMobile ? '16px' : '24px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px' }}>
              <div className="profile-info-main" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div className="avatar-circle" style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#ff6a00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', overflow: 'hidden' }}>
                  {profile?.avatar_url ? (<img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : ((profile?.full_name || profile?.email || 'U')?.charAt(0).toUpperCase())}
                </div>
                <div className="user-details-text" style={{ flex: 1 }}>
                  <h2 className="user-full-name" style={{ margin: 0, fontSize: isMobile ? '18px' : '22px' }}>{profile?.full_name || "Mtumiaji"}</h2>
                  <p className="user-email-sub" style={{ color: '#666', margin: '4px 0', fontSize: '13px' }}>{profile?.email || "Hakuna Email"}</p>
                  {profile?.username && <p className="user-username" style={{ color: '#999', fontSize: '12px' }}>@{profile.username}</p>}
                </div>
                <button className="btn-edit-profile" onClick={() => setIsEditingProfile(true)} style={{ padding: isMobile ? '8px 20px' : '10px 24px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Edit Profile</button>
              </div>
            </div>

            {/* ... Rest ya Settings (Email, Password, Helpful Links, Bottom Nav) inabaki ile ile ... */}

            <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* (Nimeacha Account Information na Security Cards kama zilivyokuwa, hakuna haja ya kuzibadilisha) */}
              <div className="settings-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', borderBottom: '1px solid #f5f5f5', paddingBottom: '12px', marginBottom: '12px' }}><User size={18} /> Account information</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li onClick={() => setIsEditingProfile(true)} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #fafafa', cursor: 'pointer' }}>My profile <ChevronRight size={14} color="#ccc" /></li>
                  <li style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', borderBottom: '1px solid #fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} onClick={() => setIsEditingEmail(!isEditingEmail)}>
                      <span>Change email</span> <span style={{ fontSize: '12px', color: '#999' }}>{profile?.email}</span>
                    </div>
                    {isEditingEmail && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                        <input type="email" placeholder="Andika email mpya" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} autoFocus />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setIsEditingEmail(false); setNewEmail(''); }} style={{ padding: '6px 12px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                          <button onClick={handleUpdateEmail} disabled={emailLoading} style={{ padding: '6px 12px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: emailLoading ? 0.7 : 1 }}>{emailLoading ? 'Saving...' : 'Save'}</button>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>

              <div className="settings-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', borderBottom: '1px solid #f5f5f5', paddingBottom: '12px', marginBottom: '12px' }}><Settings size={18} /> Account security</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', borderBottom: '1px solid #fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} onClick={() => setIsEditingPassword(!isEditingPassword)}><span>Change password</span><ChevronRight size={14} color="#ccc" /></div>
                    {isEditingPassword && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <div style={{ position: 'relative' }}>
                          <input type={showCurrentPassword ? "text" : "password"} placeholder="Password ya sasa" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                          <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>{showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                        </div>
                        <input type={showNewPassword ? "text" : "password"} placeholder="Password mpya (min 6)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        <input type="password" placeholder="Thibitisha password mpya" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setIsEditingPassword(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }} style={{ padding: '6px 12px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                          <button onClick={handleUpdatePassword} disabled={passwordLoading} style={{ padding: '6px 12px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: passwordLoading ? 0.7 : 1 }}>{passwordLoading ? 'Updating...' : 'Update Password'}</button>
                        </div>
                      </div>
                    )}
                  </li>
                  <li onClick={handlePasswordReset} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #fafafa', cursor: 'pointer' }}><span>Forgot password?</span> <ChevronRight size={14} color="#ccc" /></li>
                  <li onClick={handleDeleteAccount} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', color: '#ff4d4f', cursor: 'pointer' }}>Delete account <ChevronRight size={14} color="#ccc" /></li>
                </ul>
              </div>
            </div>

                       {/* 🔥 ONGEZA HII SEHEMU ILIYOKOSA: Rudi kwenye Duka Lako */}
            <div className="store-section" style={{ marginTop: '32px' }}>
              <div 
                onClick={() => navigate('/dashboard/sellerboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  backgroundColor: '#fff5ed',
                  borderRadius: '12px',
                  border: '1px solid #ff6a00',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ff6a00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Store size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#ff6a00' }}>
                    Rudi kwenye Duka Lako
                  </span>
                  <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
                    Dhibiti bidhaa, oda na taarifa za duka lako
                  </p>
                </div>
                <ChevronRight size={18} color="#ff6a00" />
              </div>
            </div>

            <div className="helpful-links-section" style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#333', paddingLeft: '4px' }}>Help & Information</h3>
              <div className="helpful-links-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                {helpfulLinks.map((link, index) => (
                  <div key={index} onClick={() => navigate(link.path)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #eee', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.borderColor = '#ff6a00'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = '#eee'; }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff5ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6a00' }}>{link.icon}</div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{link.title}</span>
                    <ChevronRight size={14} color="#ccc" style={{ marginLeft: 'auto' }} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px' }}>
                <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: 'auto', padding: '14px 20px', backgroundColor: '#fff', border: '1px solid #ff4d4f', borderRadius: '12px', color: '#ff4d4f', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff4d4f'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#ff4d4f'; }}><LogOut size={18} /> Sign Out</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '24px', padding: '16px' }}><p style={{ fontSize: '11px', color: '#999' }}>Skyfall.com © 2024 • All rights reserved</p></div>
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 20px', borderTop: '1px solid #eee', zIndex: 1000 }}>
          <button onClick={() => navigate('/dashboard/sellerboard')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1 }}><Home size={22} color={location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6600' : '#666'} /><span style={{ fontSize: '10px', color: location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6600' : '#666' }}>Duka</span></button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1 }}><ClipboardList size={22} color={location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666'} /><span style={{ fontSize: '10px', color: location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666' }}>Oda</span></button>
          <button onClick={() => navigate('/advertise')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1 }}><Megaphone size={22} color={location.pathname === '/advertise' ? '#ff6600' : '#666'} /><span style={{ fontSize: '10px', color: location.pathname === '/advertise' ? '#ff6600' : '#666' }}>Ads</span></button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1 }}><Bell size={22} color={location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666'} /><span style={{ fontSize: '10px', color: location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666' }}>Arifa</span></button>
        </nav>
      )}

      {/* 🔥 MODAL MPYA YA EDIT PROFILE (Ina Uwezo wa Kupakia Picha) */}
      {isEditingProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: 0 }}>Edit Profile</h3>
              <button onClick={() => { setIsEditingProfile(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              
              {/* 🔥 HAPA: Badilisha sehemu ya Picha - Sasa Inaweza Kupakia */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {avatarPreview || profile?.avatar_url ? (
                      <img src={avatarPreview || profile?.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={50} color="#ccc" />
                    )}
                  </div>
                  <label htmlFor="supplier-avatar-upload" style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: '#ff6a00', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                    <Camera size={16} />
                    <input id="supplier-avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                  </label>
                </div>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Bonyeza kamera kubadilisha picha</p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => { setIsEditingProfile(false); }} style={{ padding: '10px 20px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleUpdateProfile} disabled={profileSaving} style={{ padding: '10px 20px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: profileSaving ? 0.7 : 1 }}><Save size={16} /> {profileSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierAccountSettings;