import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, User, LogOut, ChevronRight, Menu, X, Eye, EyeOff,
  Camera, Upload, Save, HelpCircle, FileText, Shield, Phone, Mail, Globe, Truck, Store
} from 'lucide-react';
import UserTools from '../components/UserTools';
import toast from 'react-hot-toast';
import '../AccountSettings.css';

const AccountSettings = ({ session }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = session?.user;

  // --- STATE ZA SIDEBAR NA DATA ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

  // ========== HELPFUL LINKS (LIST YA VIUNGO KWA MAELEZO) ==========
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

     { 
    icon: <Store size={18} />, 
    title: userStoreId ? 'Manage My Store' : 'Sell on Skyfall.com', 
    path: userStoreId ? `/dashboard/physical/${userStoreId}` : '/create-store',
    isStoreLink: true 
  },
  
  ];

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
{/* HEADER */}
<header className="dashboard-header" style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  padding: isMobile ? '10px 16px' : '10px 24px', 
  borderBottom: '1px solid #eee', 
  backgroundColor: '#fff',
  zIndex: 100 
}}>
  <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
    {/* Menu - Desktop TU, Mobile HAPANA */}
    {!isMobile && (
      <Menu 
        size={22} 
        style={{ cursor: 'pointer', color: '#666' }} 
        onClick={() => setIsExpanded(!isExpanded)} 
      />
    )}
    
    <Link to="/dashboard" style={{ fontSize: isMobile ? '20px' : '20px', fontWeight: '800', color: '#ff6a00', textDecoration: 'none' }}>
      Skyfall.com
    </Link>
    
    {/* Search - Desktop TU, Mobile HAPANA */}
    {!isMobile && (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '6px 12px', borderRadius: '8px', marginLeft: '10px' }}>
        <Search size={16} color="#999" />
        <input type="text" placeholder="Search in cart..." style={{ border: 'none', background: 'none', outline: 'none', marginLeft: '8px', fontSize: '14px' }} />
      </div>
    )}
  </div>

  {/* Bell na UserTools - Desktop TU, Mobile HAPANA */}
  <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    {!isMobile && (
      <>
        <Bell size={20} style={{ cursor: 'pointer', color: '#666' }} />
        <UserTools session={session} />
      </>
    )}
  </div>
</header>

      <div className="dashboard-main" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SIDEBAR - Hide on mobile */}
        {!isMobile && (
          <aside 
            onMouseEnter={() => setIsExpanded(true)} 
            onMouseLeave={() => setIsExpanded(false)} 
            style={{
              width: isExpanded ? '240px' : '72px',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
              borderRight: '1px solid #eee',
              paddingTop: '10px',
              flexShrink: 0,
              zIndex: 10
            }}
          >
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '48px',
                  textDecoration: 'none',
                  margin: '4px 10px',
                  borderRadius: '8px',
                  color: location.pathname === item.path ? '#ff6a00' : '#666',
                  backgroundColor: location.pathname === item.path ? '#fff5ed' : 'transparent'
                }}
              >
                <div style={{ minWidth: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {item.icon}
                </div>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  whiteSpace: 'nowrap',
                  opacity: isExpanded ? 1 : 0, 
                  transition: 'opacity 0.2s ease',
                  pointerEvents: isExpanded ? 'auto' : 'none',
                  marginLeft: '4px'
                }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </aside>
        )}

        {/* SETTINGS CONTENT */}
        <div className="settings-container" style={{ flex: 1, padding: isMobile ? '16px' : '24px', backgroundColor: '#f7f8fa', overflowY: 'auto' }}>
          <div className="settings-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* PROFILE CARD */}
            <div className="settings-card profile-header-card" style={{ background: '#fff', padding: isMobile ? '16px' : '24px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px' }}>
              <div className="profile-info-main" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div className="avatar-circle" style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#ff6a00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', overflow: 'hidden' }}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (profile?.full_name || user?.email)?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="user-details-text" style={{ flex: 1 }}>
                  <h2 className="user-full-name" style={{ margin: 0, fontSize: isMobile ? '18px' : '22px' }}>
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </h2>
                  <p className="user-email-sub" style={{ color: '#666', margin: '4px 0', fontSize: '13px' }}>{user?.email}</p>
                  {profile?.username && <p className="user-username" style={{ color: '#999', fontSize: '12px' }}>@{profile.username}</p>}
                </div>
                <button 
                  className="btn-edit-profile" 
                  onClick={() => setIsEditingProfile(true)}
                  style={{ padding: isMobile ? '8px 20px' : '10px 24px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              {/* ACCOUNT INFORMATION */}
              <div className="settings-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', borderBottom: '1px solid #f5f5f5', paddingBottom: '12px', marginBottom: '12px' }}>
                  <User size={18} /> Account information
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li onClick={() => setIsEditingProfile(true)} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #fafafa', cursor: 'pointer' }}>
                    My profile <ChevronRight size={14} color="#ccc" />
                  </li>
                  
                  <li style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', borderBottom: '1px solid #fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} onClick={() => setIsEditingEmail(!isEditingEmail)}>
                      <span>Change email</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>{user?.email}</span>
                    </div>
                    
                    {isEditingEmail && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                        <input type="email" placeholder="Andika email mpya" value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} autoFocus />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setIsEditingEmail(false); setNewEmail(''); }}
                            style={{ padding: '6px 12px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                          <button onClick={handleUpdateEmail} disabled={emailLoading}
                            style={{ padding: '6px 12px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: emailLoading ? 0.7 : 1 }}>
                            {emailLoading ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>

              {/* ACCOUNT SECURITY */}
              <div className="settings-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', borderBottom: '1px solid #f5f5f5', paddingBottom: '12px', marginBottom: '12px' }}>
                  <Settings size={18} /> Account security
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', borderBottom: '1px solid #fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} onClick={() => setIsEditingPassword(!isEditingPassword)}>
                      <span>Change password</span>
                      <ChevronRight size={14} color="#ccc" />
                    </div>
                    
                    {isEditingPassword && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <div style={{ position: 'relative' }}>
                          <input type={showCurrentPassword ? "text" : "password"} placeholder="Password ya sasa"
                            value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                          <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <input type={showNewPassword ? "text" : "password"} placeholder="Password mpya (min 6)"
                          value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        <input type="password" placeholder="Thibitisha password mpya"
                          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setIsEditingPassword(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                            style={{ padding: '6px 12px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                          <button onClick={handleUpdatePassword} disabled={passwordLoading}
                            style={{ padding: '6px 12px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: passwordLoading ? 0.7 : 1 }}>
                            {passwordLoading ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                  
                  <li onClick={handlePasswordReset} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #fafafa', cursor: 'pointer' }}>
                    <span>Forgot password?</span> <ChevronRight size={14} color="#ccc" />
                  </li>
                  
                  <li onClick={handleDeleteAccount} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', color: '#ff4d4f', cursor: 'pointer' }}>
                    Delete account <ChevronRight size={14} color="#ccc" />
                  </li>
                </ul>
              </div>
            </div>



{/* ========== STORE SECTION (JUU YA HELPFUL LINKS) ========== */}
<div className="store-section" style={{ marginTop: '32px' }}>
  <div 
    onClick={() => navigate(userStoreId ? `/dashboard/physical/${userStoreId}` : '/create-store')}
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
        {userStoreId ? 'Manage My Store' : 'Sell on Skyfall.com'}
      </span>
      <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
        {userStoreId ? 'Dhibiti bidhaa, oda na taarifa za duka lako' : 'Anzisha duka lako na uanze kuuza leo'}
      </p>
    </div>
    <ChevronRight size={18} color="#ff6a00" />
  </div>
</div>
            {/* ========== SEHEMU YA HELPFUL LINKS (CHINI KABISA) ========== */}
            <div className="helpful-links-section" style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#333', paddingLeft: '4px' }}>
                Help & Information
              </h3>
              <div className="helpful-links-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', 
                gap: '10px'
              }}>
                {helpfulLinks.map((link, index) => (
                  <div 
                    key={index}
                    onClick={() => navigate(link.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: '#fff',
                      borderRadius: '10px',
                      border: '1px solid #eee',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(3px)';
                      e.currentTarget.style.borderColor = '#ff6a00';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = '#eee';
                    }}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff5ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6a00' }}>
                      {link.icon}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{link.title}</span>
                    <ChevronRight size={14} color="#ccc" style={{ marginLeft: 'auto' }} />
                  </div>
                ))}
              </div>
              {/* ========== SIGN OUT BUTTON - WEKA HAPA CHINI YA STORE SECTION ========== */}
<div style={{ marginTop: '24px' }}>
  <button
    onClick={async () => {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Umefanikiwa kutoka!');
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
       width: 'auto',
      padding: '14px 20px',
      backgroundColor: '#fff',
      border: '1px solid #ff4d4f',
      borderRadius: '12px',
      color: '#ff4d4f',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#ff4d4f';
      e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#fff';
      e.currentTarget.style.color = '#ff4d4f';
    }}
  >
    <LogOut size={18} />
    Sign Out
  </button>
</div>
              
              {/* Simple footer */}
              <div style={{ textAlign: 'center', marginTop: '24px', padding: '16px' }}>
                <p style={{ fontSize: '11px', color: '#999' }}>
                  Skyfall.com © 2024 • All rights reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: 0 }}>Edit Profile</h3>
              <button onClick={() => { setIsEditingProfile(false); setAvatarFile(null); if(avatarPreview) URL.revokeObjectURL(avatarPreview); }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '20px' }}>
              {/* AVATAR UPLOAD */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {avatarPreview || profile?.avatar_url ? (
                      <img src={avatarPreview || profile?.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={50} color="#ccc" />
                    )}
                  </div>
                  <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: '#ff6a00', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                    <Camera size={16} />
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                  </label>
                </div>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Bonyeza kamera kubadilisha picha</p>
              </div>
              
              {/* FULL NAME */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              
              {/* USERNAME */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              
              {/* BIO */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }} />
              </div>
              
              {/* BUTTONS */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => { setIsEditingProfile(false); setAvatarFile(null); if(avatarPreview) URL.revokeObjectURL(avatarPreview); }} 
                  style={{ padding: '10px 20px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleUpdateProfile} disabled={profileSaving}
                  style={{ padding: '10px 20px', backgroundColor: '#ff6a00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: profileSaving ? 0.7 : 1 }}>
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