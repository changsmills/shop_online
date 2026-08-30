import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, Send, Menu, 
  ChevronLeft, Home, ShoppingCart, User,
  Plus, Megaphone, Loader2, Image as ImageIcon 
} from 'lucide-react';

// 🔥 BADILISHA: Import api kutoka axiosConfig, sio supabase!
import api from "../axiosConfig"; 

import UserTools from '../components/UserTools';
import '../Messages.css';
import '../AccountSettings.css';
import messageImage from "../images/messageSent.svg"; 

const Messages = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ==========================================
  // 🔥 MPYA: PATA USER ID NA ROLE KUTOKA BACKEND
  // ==========================================
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userRole, setUserRole] = useState('customer');

 useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate('/dashboard/login');
          return;
        }
        const res = await api.get('/profile/');
        
        // 🔥 HAPA: API inarudisha 'id' ya Profile!
        setCurrentUserId(res.data.id); // Hii ni Profile ID (sio User ID)
        setUserRole(res.data.role || 'customer');
      } catch (err) {
        console.error("Failed to get profile ID:", err);
        navigate('/dashboard/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  // ==========================================
  // MWISHO WA LOGIC MPYA
  // ==========================================

  // Detect mobile screen
 useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth <= 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

  // Sikiliza kama kuna mteja anakuja kuanza chat mpya kupitia location.state
  useEffect(() => {
    
    const startNewChat = async () => {
      if (location.state?.sellerId && currentUserId) {
        const { sellerId, sellerName, productContext } = location.state;
        const existingChat = chats.find(c => c.id === sellerId);

        if (existingChat) {
          handleChatSelect(existingChat);
        } else {
          const temporaryChat = {
            id: sellerId,
            name: sellerName || "Seller",
            avatar: null,
            lastMsg: productContext ? `Ninaulizia: ${productContext}` : "",
            date: "Now"
          };
          setActiveChat(temporaryChat);
          if (productContext) {
             setNewMessage(`Habari, ninaulizia kuhusu bidhaa hii: ${productContext}`);
          }
          if (isMobile) setShowMobileChat(true);
        }
      }
    };

    if (location.state?.sellerId && currentUserId) {
      startNewChat();
    }
  }, [location.state, chats, isMobile, currentUserId]);

  useEffect(() => {
    if (!isMobile) {
      setShowMobileChat(false);
    }
  }, [isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==========================================
  // 🔥 FETCH MESSAGES (Django API)
  // ==========================================
  const fetchMessages = async (partnerId) => {
  if (!partnerId || !currentUserId) return;
  try {
    const res = await api.get('/messages/', {
      params: {
        user_id: currentUserId,
        receiver: partnerId
      }
    });
    // 🔥 BADILISHA HII - Hakikisha unachukua messages tu, si activeChat!
    setMessages(res.data.results || res.data || []);
  } catch (err) {
    console.error("Error fetching messages:", err.response?.data || err.message);
    setMessages([]);
  }
};

  // ==========================================
  // 🔥 FETCH INBOX (Django API)
  // ==========================================
const fetchInbox = async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      const res = await api.get('/messages/', {
        params: {
          user_id: currentUserId,
          ordering: '-created_at'
        }
      });

      const data = res.data.results || res.data || [];

      if (data) {
        const chatGroups = {};
        data.forEach(msg => {
          const isISender = msg.sender_id === currentUserId;
          const partnerId = isISender ? msg.receiver_id : msg.sender_id;
          
          // 🔥 BADILISHA HAPA: Tumia sender_name / receiver_name kutoka API!
          const partnerName = isISender ? msg.receiver_name : msg.sender_name;
          const partnerAvatar = isISender ? (msg.receiver_avatar || null) : (msg.sender_avatar || null);
          
          // 🔥 HAPA NDIPO JINA LA STORE LITAONEKANA!
          const displayName = partnerName || `User ${partnerId.slice(0,4)}`;

          if (partnerId && !chatGroups[partnerId]) {
            chatGroups[partnerId] = {
              id: partnerId,
              name: displayName, // 🔥 Jina la Store au Profile!
              avatar: partnerAvatar || null,
              lastMsg: msg.content,
              date: new Date(msg.created_at).toLocaleDateString(),
              timestamp: new Date(msg.created_at).getTime()
            };
          }
        });

        setChats(Object.values(chatGroups).sort((a,b) => b.timestamp - a.timestamp));
      }
    } catch (err) {
      console.error("Network error while fetching inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🔥 SEARCH STORES (Django API)
  // ==========================================
  const handleSearchStores = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Mfumo wa Search kwenye Django unahitaji 'search' kwenye filterset
      const res = await api.get('/stores/', { params: { search: query } });
      setSearchResults(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error searching stores:", err);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

const handleSelectStoreFromSearch = (store) => {
  // 🔥 HAKIKISHA TUNATUMIA Profile ID ya store owner!
  const partnerId = store.owner_profile_id || store.owner_id;  // Tumia Profile ID!
  
  console.log("🔍 Selected store:", store);
  console.log("🔍 Partner ID:", partnerId);
  
  const existingChat = chats.find(c => c.id === partnerId);
  
  if (existingChat) {
    handleChatSelect(existingChat);
  } else {
    const newChatPartner = {
      id: partnerId,
      name: store.store_name,
      avatar: store.store_logo || null,
      lastMsg: "Anza mazungumzo mapya...",
      date: "New"
    };
    setMessages([]); 
    setActiveChat(newChatPartner);
    if (isMobile) setShowMobileChat(true);
  }
  
  setSearchQuery("");
  setSearchResults([]);
};

  // ==========================================
  // 🔥 SEND MESSAGE (Django API)
  // ==========================================
const handleSendMessage = async (e) => {
  e.preventDefault();
  
  // 🔥 BADILISHA 1: Ruhusu kutuma kama kuna maandishi AU picha
  if ((!newMessage.trim() && !selectedImage) || !activeChat || !currentUserId) return;

  // 🔥 ONGEZA 2: Tengeneza FormData (Hili ni muhimu kwa kutuma picha)
  const formData = new FormData();
  formData.append('sender', currentUserId);
  formData.append('receiver', activeChat.id);
  formData.append('content', newMessage.trim() || 'Image'); // Kama hakuna text, tumia 'Image'
  
  if (selectedImage) {
    formData.append('image', selectedImage);
  }

  const tempMsg = {
    id: Date.now(),
    sender_id: currentUserId,
    receiver_id: activeChat.id,
    content: newMessage.trim(),
    image_url: imagePreview, // 🔥 ONGEZA 3: Onyesha preview ya picha mara moja
    created_at: new Date().toISOString(),
    isPending: true
  };

  setMessages(prev => [...prev, tempMsg]);
  const originalMessage = newMessage;
  setNewMessage("");
  
  // 🔥 ONGEZA 4: Safisha picha na preview baada ya kutuma
  setSelectedImage(null);
  setImagePreview(null);
  
  scrollToBottom();

  try {
    console.log("🔍 Sending message:", {
      sender: currentUserId,
      receiver: activeChat.id,
      content: originalMessage,
      hasImage: !!selectedImage
    });

    // 🔥 BADILISHA 5: Tuma FormData badala ya Object ya kawaida (Axios inaichukulia multipart/form-data yenyewe)
    await api.post('/messages/', formData);

    // 🔥 BADILISHA HII - Usipige fetchMessages baada ya kutuma!
    // Badala yake, weka tempMsg kwenye messages moja kwa moja!
    setMessages(prev => [...prev, {
      ...tempMsg,
      isPending: false
    }]);
    
    // 🔥 Au piga fetchMessages kwenye polling tu (kila sekunde 5)
  } catch (error) {
    console.error("Error sending:", error);
    console.error("Error response:", error.response?.data);
    setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
    setNewMessage(originalMessage);
    
    // 🔥 ONGEZA 6: Rudisha picha kwenye input kama imeshindikana
    setSelectedImage(selectedImage);
    setImagePreview(imagePreview);
  }
};

 const handleChatSelect = async (chat) => {
  setActiveChat(chat);
  await fetchMessages(chat.id);
  scrollToBottom();
  if (isMobile) {
    setShowMobileChat(true);
  }
};

  // ==========================================
  // 🔥 ZIADA: HII ILIKOSA, SASA IMEONGEWA (Inazuia White Screen!)
  // ==========================================
  // 🔥 Logic ya "Rudi Hatua Moja Nyuma" (Smart Back)
  const handleBackNavigation = () => {
    // 1. Kama uko ndani ya Chat moja (Mobile), rudi kwenye Inbox (Chat List)
    if (isMobile && showMobileChat) {
      setShowMobileChat(false);
      setActiveChat(null);
      setMessages([]);
    } 
    // 2. Kama uko kwenye Inbox (Chat List), rudi Dashboard
    else {
      navigate('/dashboard');
    }
  };

 
  // ==========================================
  // 🔥 POLLING: Kuchukua nafasi ya Supabase Realtime
  // ==========================================
  // 🔥 BADILISHA HII - Polling haipaswi kubadilisha activeChat!
useEffect(() => {
  let intervalId;
  if (activeChat && currentUserId) {
    intervalId = setInterval(() => {
      // 🔥 Hakikisha unapiga fetchMessages kwa activeChat.id tu!
      fetchMessages(activeChat.id);
    }, 5000);
  }
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [activeChat?.id, currentUserId]); // 🔥 Tumia activeChat?.id, si activeChat!

  // Initial fetch
  useEffect(() => {
    if (currentUserId) {
      fetchInbox();
    }
  }, [currentUserId]);

  // Hifadhi activeChat kwenye localStorage
  useEffect(() => {
    if (activeChat?.id) {
      localStorage.setItem('lastActiveChatId', activeChat.id);
    }
  }, [activeChat]);

  useEffect(() => {
    const lastChatId = localStorage.getItem('lastActiveChatId');
    if (lastChatId && chats.length > 0 && !activeChat) {
      const lastChat = chats.find(c => c.id === lastChatId);
      if (lastChat) {
        handleChatSelect(lastChat);
      }
    }
  }, [chats, activeChat]);

  const getSenderName = (msg) => {
    if (msg.sender_id === currentUserId) return "Me";
    return msg.sender?.full_name || "User";
  };

  // 🔥 SIDEBAR INABADILIKA KULINGANA NA ROLE
  const isSupplier = userRole === 'supplier';
  
  const sidebarItems = isSupplier ? [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard/sellerboard', label: 'Duka Lako' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Ujumbe' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/notifications', label: 'Arifa (Oda)' },
    { icon: <Settings size={20} />, path: '/dashboard/sellerboard', label: 'Mipangilio' },
  ] : [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

  const handleSearchNavigation = () => {
    setShowSearchModal(true);
  };

 

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
           {/* 🔥 MOBILE: FICHA HEADER KABISA (Kwenye Mobile Inaonekana tu ikiwa na Back Arrow) */}
      <header className="dashboard-header" style={{ position: 'sticky', top: 0, zIndex: 100, display: isMobile ? 'none' : 'block' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* 🔥 ONGEZA HII: Back Arrow ya Kurudi Dashboard - Inaonekana TU kwenye Mobile */}
          {isMobile && (
            <button 
              onClick={handleBackNavigation}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '4px', 
                display: 'flex', 
                alignItems: 'center',
                marginRight: '2px'
              }}
            >
              <ChevronLeft size={28} color="#333" />
            </button>
          )}

          {/* 🔥 Desktop Tu: Menu ya Kufungua Sidebar */}
          {!isMobile && (
            <Menu 
              size={22} 
              className="menu-toggle" 
              style={{ cursor: 'pointer', color: '#666' }} 
              onClick={() => setIsExpanded(!isExpanded)} 
            />
          )}

          {/* Logo */}
          <Link to="/dashboard" style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: '#ff6a00', textDecoration: 'none' }}>
            Skyfall.com
          </Link>

          {/* 🔥 Desktop Tu: Search Box */}
          {!isMobile && (
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search chats..." />
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-main" style={{ display: 'flex', flex: 1, overflow: 'hidden', paddingBottom: isMobile ? '0' : 0 }}>
        
        {/* 🔥 MOBILE: FICHA SIDEBAR KABISA (Desktop pekee) */}
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
            {sidebarItems.map((item) => {
              const isActive = isSupplier
                ? (item.path === '/dashboard/sellerboard' && location.pathname.startsWith('/dashboard/sellerboard'))
                : location.pathname === item.path;

              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '48px',
                    textDecoration: 'none',
                    color: isActive ? '#ff6a00' : '#666',
                    margin: '4px 10px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                    backgroundColor: isActive ? '#fff5ed' : 'transparent',
                  }}
                >
                  <div style={{ 
                    minWidth: '52px',
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center' 
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    opacity: isExpanded ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: isExpanded ? 'auto' : 'none'
                  }}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </aside>
        )}

        {/* MESSAGES CONTAINER */}
        <div className="messages-container" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* CHAT LIST SIDEBAR */}
          {(!isMobile || (isMobile && !showMobileChat)) && (
            <div className="messages-sidebar" style={{ 
              width: isMobile ? '100%' : '320px',
              flexShrink: 0,
              borderRight: '1px solid #eee'
            }}>
              <div className="sidebar-header-chat" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: isMobile ? '15px' : '15px' }}>
  
 

  <h3 style={{ margin: 0, flexShrink: 0 }}>Inbox</h3>
  
  <div className="search-bar-chat" style={{ position: 'relative', flex: isMobile ? '1' : 'auto' }}>
                  <Search size={14} className="search-icon-chat" />
                  <input 
                    type="text" 
                    placeholder="Tafuta duka..." 
                    value={searchQuery}
                    onChange={(e) => handleSearchStores(e.target.value)}
                    style={{
                      fontSize: isMobile ? '14px' : '13px',
                      padding: isMobile ? '10px 10px 10px 35px' : '8px 8px 8px 32px'
                    }}
                  />
                  {searchResults.length > 0 && (
                    <div className="search-results-dropdown" style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      zIndex: 1000,
                      marginTop: '8px',
                      maxHeight: isMobile ? '200px' : '300px',
                      overflowY: 'auto',
                      border: '1px solid #eee'
                    }}>
                      {searchResults.map(store => (
                        <div 
                          key={store.id || store.owner_id}
                          onClick={() => handleSelectStoreFromSearch(store)}
                          style={{
                            padding: isMobile ? '10px 12px' : '12px 15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            borderBottom: '1px solid #f8f8f8',
                            transition: 'background 0.2s'
                          }}
                        >
                          <div style={{ 
                            width: isMobile ? '30px' : '35px', 
                            height: isMobile ? '30px' : '35px', 
                            borderRadius: '50%', 
                            backgroundColor: '#ff6a00', 
                            color: '#fff',
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            fontSize: isMobile ? '12px' : '14px', 
                            fontWeight: 'bold' 
                          }}>
                            {store.store_logo ? (
                              <img src={store.store_logo} alt="" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                            ) : (
                              store.store_name[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#333' }}>{store.store_name}</div>
                            <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#ff6a00' }}>Anza mazungumzo sasa</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {isSearching && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      padding: '10px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#666',
                      borderRadius: '8px',
                      marginTop: '5px',
                      zIndex: 1000
                    }}>
                      Inatafuta...
                    </div>
                  )}
                </div>
              </div>

              <div className="chat-list" style={{ overflowY: 'auto' }}>
                {loading ? (
                  /* 🔥 SKELETON MPYA BADALA YA "Inapakia..." */
                  <div className="skeleton-chat-list">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="skeleton-chat-item">
                        <div className="skeleton-chat-avatar"></div>
                        <div className="skeleton-chat-lines">
                          <div className="skeleton-line skeleton-line-name"></div>
                          <div className="skeleton-line skeleton-line-text"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : chats.length === 0 ? (
                  <>
                    {isMobile && (
                      <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Hakuna mazungumzo bado</p>
                        <button 
                          onClick={() => setShowSearchModal(true)}
                          style={{
                            background: '#ff6a00',
                            border: 'none',
                            borderRadius: '30px',
                            padding: '12px 25px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <Search size={18} />
                          Tafuta Duka Kuanza Mazungumzo
                        </button>
                      </div>
                    )}
                    {!isMobile && (
                      <p style={{padding: '20px', textAlign: 'center', color: '#9ca3af'}}>Hakuna mazungumzo bado</p>
                    )}
                  </>
                ) : (
                  chats.map(chat => (
                    <div 
                      key={chat.id} 
                      className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="chat-avatar">
                        {chat.avatar ? (
                          <img src={chat.avatar} alt={chat.name} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                          <span style={{fontWeight: 'bold', fontSize: '16px'}}>{chat.name[0]?.toUpperCase() || '?'}</span>
                        )}
                      </div>
                      <div className="chat-info">
                        <div className="chat-info-top">
                          <span className="chat-name">{chat.name}</span>
                          <span className="chat-date">{chat.date}</span>
                        </div>
                        <p className="chat-preview">
                          {chat.lastMsg?.length > 40 ? chat.lastMsg.substring(0, 40) + '...' : chat.lastMsg}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* MOBILE SEARCH MODAL */}
              {isMobile && showSearchModal && (
                <div 
                  onClick={() => {
                    setShowSearchModal(false);
                    setSearchResults([]);
                    setSearchQuery('');
                  }}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '20px'
                  }}
                >
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      width: '100%',
                      maxWidth: '400px',
                      marginTop: '60px',
                      padding: '20px'
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                      <h3 style={{margin: 0, fontSize: '18px'}}>Tafuta Duka</h3>
                      <button 
                        onClick={() => {
                          setShowSearchModal(false);
                          setSearchResults([]);
                          setSearchQuery('');
                        }} 
                        style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="search-bar-chat" style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '25px', padding: '8px 15px' }}>
                        <Search size={18} color="#999" />
                        <input 
                          type="text" 
                          placeholder="Andika jina la duka..."
                          value={searchQuery}
                          onChange={(e) => handleSearchStores(e.target.value)}
                          autoFocus
                          style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 10px', fontSize: '14px', background: 'transparent' }}
                        />
                      </div>
                      
                      {searchResults.length > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          backgroundColor: '#fff',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          zIndex: 100,
                          marginTop: '8px',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          border: '1px solid #eee'
                        }}>
                          {searchResults.map(store => (
                            <div 
                              key={store.id || store.owner_id}
                              onClick={() => {
                                handleSelectStoreFromSearch(store);
                                setShowSearchModal(false);
                                setSearchQuery('');
                                setSearchResults([]);
                              }}
                              style={{
                                padding: '12px 15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                borderBottom: '1px solid #f5f5f5'
                              }}
                            >
                              <div style={{ 
                                width: '35px', height: '35px', borderRadius: '50%', 
                                backgroundColor: '#ff6a00', color: '#fff',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '14px', fontWeight: 'bold'
                              }}>
                                {store.store_logo ? (
                                  <img src={store.store_logo} alt="" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                                ) : (
                                  store.store_name[0].toUpperCase()
                                )}
                              </div>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{store.store_name}</div>
                                <div style={{ fontSize: '11px', color: '#ff6a00' }}>Bonyeza kuanza mazungumzo</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {isSearching && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          backgroundColor: '#fff',
                          padding: '12px',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: '#666',
                          borderRadius: '8px',
                          marginTop: '5px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          Inatafuta...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHAT WINDOW */}
          <div className={`chat-window ${isMobile && showMobileChat ? 'active-mobile-chat' : ''}`} style={{ 
  flex: 1, 
  display: 'flex', 
  flexDirection: 'column'
}}>
            {!activeChat ? (
              <div className="chat-empty-state">
                <div className="empty-state-content">
                  <img src={messageImage} alt="Chat Protection" className="empty-chat-img" />
                  <h2>Keep chats and transactions on Skyfall.com to enjoy order protection.</h2>
                </div>
              </div>
            ) : (
              <div className="active-chat-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="chat-header-active" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                    {activeChat && isMobile && showMobileChat && (
  <button 
    onClick={handleBackNavigation}
    className="mobile-back-btn"
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      marginRight: '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <ChevronLeft size={28} color="#333" />
  </button>
)}
                    <div className="chat-avatar" style={{ width: '40px', height: '40px' }}>
                      {activeChat.avatar ? (
                        <img src={activeChat.avatar} alt={activeChat.name} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        <span style={{fontWeight: 'bold'}}>{activeChat.name[0]?.toUpperCase() || '?'}</span>
                      )}
                    </div>
                    <h4 style={{ margin: 0 }}>{activeChat.name}</h4>
                  </div>
                </div>
                
                <div className="messages-display" style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '20px',
                  paddingBottom: isMobile ? '20px' : '60px', 
                   marginBottom: isMobile ? '60px' : '20px',
                  backgroundColor: '#f5f5f7'
                }}>
                  {messages.length === 0 ? (
                    <div style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#999', 
                      fontSize: '14px',
                      textAlign: 'center',
                      padding: '20px'
                    }}>
                      <p style={{ margin: 0 }}>Hakuna ujumbe bado.</p>
                      <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#bbb' }}>
                        Andika ujumbe ili kuanza mazungumzo na muuzaji!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div 
                        key={msg.id || `msg-${index}`} 
                        className={`message-bubble ${msg.sender_id === currentUserId ? 'sent' : 'received'}`}
                      >
                        <div className="bubble-content">
  <div className="message-sender-name" style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#ff6a00' }}>
    {getSenderName(msg)}
  </div>

  {/* 🔥 ONGEZA HII: Angalia kama kuna picha (msg.image) kisha ionyeshe */}
  {msg.image && (
    <img 
      src={msg.image} 
      alt="Sent attachment" 
      style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '5px', display: 'block' }} 
    />
  )}

  {/* 🔥 BADILISHA HII: Usionyeshe neno "Image" kama ni picha tu */}
  {msg.content && msg.content !== 'Image' && (
    <p style={{ margin: 0, wordBreak: 'break-word' }}>{msg.content}</p>
  )}

  <span className="msg-timestamp" style={{ fontSize: '10px', color: '#999', marginTop: '4px', display: 'block' }}>
    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </span>
</div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="message-input-area" onSubmit={handleSendMessage} style={{
  display: 'flex',
  flexDirection: 'column', // 🔥 TUMEBADILISHA: Sasa inaweza kuweka Preview juu
  gap: '10px',
  padding: '15px 20px',
  borderTop: '1px solid #eee',
  backgroundColor: '#fff'
}}>

  {/* 🔥 ONGEZA HII: PREVIEW YA PICHA KABLA YA KUTUMA */}
  {selectedImage && (
    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
      <img 
        src={imagePreview} 
        alt="Preview" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          borderRadius: '10px', 
          border: '1px solid #eee' 
        }} 
      />
      <button 
        type="button"
        onClick={() => { 
          setSelectedImage(null); 
          setImagePreview(null); 
        }}
        style={{ 
          position: 'absolute', 
          top: '-5px', 
          right: '-5px', 
          background: '#ff4d4d', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '50%', 
          width: '20px', 
          height: '20px', 
          cursor: 'pointer', 
          fontSize: '12px', 
          lineHeight: '20px', 
          textAlign: 'center' 
        }}
      >
        ✕
      </button>
    </div>
  )}

  {/* 🔥 SAFU YA CHINI: Icon ya Picha, Input, na Send Button */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    
    {/* 🔥 ICON YA KUPANGA PICHA */}
    <button 
      type="button" 
      onClick={() => document.getElementById('file-input').click()}
      style={{ 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        color: '#888', 
        padding: '5px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}
    >
      <ImageIcon size={24} /> {/* 🔥 Hakikisha umeimport ImageIcon kutoka lucide-react */}
    </button>

    {/* 🔥 INPUT YA FILE - Imefichwa (Inatumika tu kwa kupiga click icon) */}
    <input 
      id="file-input" 
      type="file" 
      accept="image/*" 
      style={{ display: 'none' }} 
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedImage(file);
          setImagePreview(URL.createObjectURL(file)); // 🔥 Inaonyesha preview mara moja
        }
      }}
    />

    <input 
      type="text" 
      placeholder="Type a message..." 
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      style={{
        flex: 1,
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '25px',
        outline: 'none',
        fontSize: '14px'
      }}
    />
    <button type="submit" className="send-btn" style={{
      background: '#ff6600',
      border: 'none',
      borderRadius: '50%',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      transition: 'background 0.2s'
    }}>
      <Send size={18} />
    </button>
  </div>
</form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 MOBILE: FICHA BOTTOM NAV KABISA */}
      {isMobile && (
        <nav 
          className="mobile-bottom-nav"
          style={{
            display: 'none', // 🔥 FICHA KABISA KWENYE MOBILE
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid #eee',
            zIndex: 1000,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
          }}
        >
          {/* Home */}
          <button 
            onClick={() => navigate(isSupplier ? '/dashboard/sellerboard' : '/dashboard')} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              padding: '4px 0'
            }}
          >
            <Home size={22} color={location.pathname.startsWith(isSupplier ? '/dashboard/sellerboard' : '/dashboard') ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname.startsWith(isSupplier ? '/dashboard/sellerboard' : '/dashboard') ? '#ff6600' : '#666' }}>
              {isSupplier ? 'Duka' : 'Home'}
            </span>
          </button>

          {/* Orders */}
          <button 
            onClick={() => navigate(isSupplier ? '/dashboard/notifications' : '/dashboard/orders')} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              padding: '4px 0'
            }}
          >
            <ClipboardList size={22} color={location.pathname === (isSupplier ? '/dashboard/notifications' : '/dashboard/orders') ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === (isSupplier ? '/dashboard/notifications' : '/dashboard/orders') ? '#ff6600' : '#666' }}>
              {isSupplier ? 'Oda' : 'Orders'}
            </span>
          </button>

          {/* Search */}
          <button 
            onClick={handleSearchNavigation}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              padding: '4px 0'
            }}
          >
            <div style={{ background: '#ff6600', padding: '8px', borderRadius: '50%', marginBottom: '4px' }}>
              <Search size={24} color="white" />
            </div>
            <span style={{ fontSize: '10px', color: '#ff6600', fontWeight: 'bold' }}>Search</span>
          </button>

          {/* Ads */}
          <button 
            onClick={() => navigate('/advertise')} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              padding: '4px 0'
            }}
          >
            <Megaphone size={22} color={location.pathname === '/advertise' ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/advertise' ? '#ff6600' : '#666' }}>Ads</span>
          </button>

          {/* Alerts */}
          <button 
            onClick={() => navigate('/dashboard/notifications')} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              padding: '4px 0'
            }}
          >
            <Bell size={22} color={location.pathname === '/dashboard/notifications' ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/dashboard/notifications' ? '#ff6600' : '#666' }}>Alerts</span>
          </button>
        </nav>
      )}

    </div>
  );
};

export default Messages;