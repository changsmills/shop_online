import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, Send, Menu, 
  ChevronLeft, Home, ShoppingCart, User,
  Plus, Megaphone, Loader2, Image as ImageIcon 
} from 'lucide-react';

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
        setCurrentUserId(res.data.id);
        setUserRole(res.data.role || 'customer');
      } catch (err) {
        console.error("Failed to get profile ID:", err);
        navigate('/dashboard/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const fetchMessages = async (partnerId) => {
    if (!partnerId || !currentUserId) return;
    try {
      const res = await api.get('/messages/', {
        params: {
          user_id: currentUserId,
          receiver: partnerId
        }
      });
      setMessages(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err.response?.data || err.message);
      setMessages([]);
    }
  };

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
          const partnerName = isISender ? msg.receiver_name : msg.sender_name;
          const partnerAvatar = isISender ? (msg.receiver_avatar || null) : (msg.sender_avatar || null);
          const displayName = partnerName || `User ${partnerId.slice(0,4)}`;

          if (partnerId && !chatGroups[partnerId]) {
            chatGroups[partnerId] = {
              id: partnerId,
              name: displayName,
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

  const handleSearchStores = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await api.get('/stores/', { params: { search: query } });
      setSearchResults(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error searching stores:", err);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleSelectStoreFromSearch = (store) => {
    const partnerId = store.owner_profile_id || store.owner_id;
    
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedImage) || !activeChat || !currentUserId) return;

    const formData = new FormData();
    formData.append('sender', currentUserId);
    formData.append('receiver', activeChat.id);
    formData.append('content', newMessage.trim() || 'Image');
    
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    const tempMsg = {
      id: Date.now(),
      sender_id: currentUserId,
      receiver_id: activeChat.id,
      content: newMessage.trim(),
      image_url: imagePreview,
      created_at: new Date().toISOString(),
      isPending: true
    };

    setMessages(prev => [...prev, tempMsg]);
    const originalMessage = newMessage;
    setNewMessage("");
    
    setSelectedImage(null);
    setImagePreview(null);
    
    scrollToBottom();

    try {
      await api.post('/messages/', formData);

      setMessages(prev => [...prev, {
        ...tempMsg,
        isPending: false
      }]);
    } catch (error) {
      console.error("Error sending:", error);
      console.error("Error response:", error.response?.data);
      setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
      setNewMessage(originalMessage);
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

  const handleBackNavigation = () => {
    if (isMobile && showMobileChat) {
      setShowMobileChat(false);
      setActiveChat(null);
      setMessages([]);
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    let intervalId;
    if (activeChat && currentUserId) {
      intervalId = setInterval(() => {
        fetchMessages(activeChat.id);
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeChat?.id, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchInbox();
    }
  }, [currentUserId]);

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
    <div className="messages-page-layout">
      
      {/* HEADER */}
      {(!isMobile || (isMobile && !showMobileChat)) && (
        <header className="messages-header">
          <div className="messages-header-left">
            {isMobile && (
              <button onClick={handleBackNavigation} className="messages-back-btn">
                <ChevronLeft size={28} color="#333" />
              </button>
            )}

            {!isMobile && (
              <Menu
                size={22}
                className="messages-menu-icon"
                onClick={() => setIsExpanded(!isExpanded)}
              />
            )}

            <Link to="/dashboard" className={`messages-logo ${isMobile ? 'mobile' : ''}`}>
              Skyfall.com
            </Link>

            {!isMobile && (
              <div className="messages-search-box">
                <Search size={16} color="#999" />
                <input type="text" placeholder="Search chats..." />
              </div>
            )}
          </div>
        </header>
      )}

      <div className="messages-main-body">
        
        {/* SIDEBAR - Desktop pekee */}
        {!isMobile && (
          <aside
            className={`messages-sidebar-nav ${isExpanded ? 'expanded' : ''}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            {sidebarItems.map((item) => {
              const isActive = isSupplier
                ? (item.path === '/dashboard/sellerboard' && location.pathname.startsWith('/dashboard/sellerboard'))
                : location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`messages-sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <div className="messages-sidebar-icon">{item.icon}</div>
                  <span className="messages-sidebar-label">{item.label}</span>
                </Link>
              );
            })}
          </aside>
        )}

        {/* MESSAGES CONTAINER */}
        <div className="messages-container">
          
          {/* CHAT LIST SIDEBAR */}
          {(!isMobile || (isMobile && !showMobileChat)) && (
            <div className={`chat-list-sidebar ${isMobile ? 'mobile' : ''}`}>
              <div className="chat-list-header">
                <h3>Inbox</h3>

                <div className="chat-search-wrapper">
                  <Search size={14} className="search-icon-chat" />
                  <input
                    type="text"
                    placeholder="Tafuta duka..."
                    value={searchQuery}
                    onChange={(e) => handleSearchStores(e.target.value)}
                    className={`chat-search-input ${isMobile ? 'mobile' : ''}`}
                  />

                  {searchResults.length > 0 && (
                    <div className={`chat-search-dropdown ${isMobile ? 'mobile' : ''}`}>
                      {searchResults.map(store => (
                        <div
                          key={store.id || store.owner_id}
                          onClick={() => handleSelectStoreFromSearch(store)}
                          className={`chat-search-result ${isMobile ? 'mobile' : ''}`}
                        >
                          <div className={`chat-search-avatar ${isMobile ? 'mobile' : ''}`}>
                            {store.store_logo ? (
                              <img src={store.store_logo} alt="" />
                            ) : (
                              store.store_name[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className={`chat-search-name ${isMobile ? 'mobile' : ''}`}>
                              {store.store_name}
                            </div>
                            <div className={`chat-search-hint ${isMobile ? 'mobile' : ''}`}>
                              Anza mazungumzo sasa
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isSearching && (
                    <div className="chat-searching-text">Inatafuta...</div>
                  )}
                </div>
              </div>

              <div className="chat-list-body">
                {loading ? (
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
                  <div className={`chat-list-empty ${isMobile ? 'mobile' : ''}`}>
                    <p>Hakuna mazungumzo bado</p>
                    {isMobile && (
                      <button
                        onClick={() => setShowSearchModal(true)}
                        className="chat-list-empty-btn"
                      >
                        <Search size={18} />
                        Tafuta Duka Kuanza Mazungumzo
                      </button>
                    )}
                  </div>
                ) : (
                  chats.map(chat => (
                    <div
                      key={chat.id}
                      className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="chat-avatar">
                        {chat.avatar ? (
                          <img src={chat.avatar} alt={chat.name} />
                        ) : (
                          <span>{chat.name[0]?.toUpperCase() || '?'}</span>
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
                  className="search-modal-overlay"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="search-modal-content"
                  >
                    <div className="search-modal-header">
                      <h3>Tafuta Duka</h3>
                      <button
                        onClick={() => {
                          setShowSearchModal(false);
                          setSearchResults([]);
                          setSearchQuery('');
                        }}
                        className="search-modal-close"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="chat-search-wrapper">
                      <div className="search-modal-input-wrapper">
                        <Search size={18} color="#999" />
                        <input
                          type="text"
                          placeholder="Andika jina la duka..."
                          value={searchQuery}
                          onChange={(e) => handleSearchStores(e.target.value)}
                          autoFocus
                          className="search-modal-input"
                        />
                      </div>

                      {searchResults.length > 0 && (
                        <div className="chat-search-dropdown">
                          {searchResults.map(store => (
                            <div
                              key={store.id || store.owner_id}
                              onClick={() => {
                                handleSelectStoreFromSearch(store);
                                setShowSearchModal(false);
                                setSearchQuery('');
                                setSearchResults([]);
                              }}
                              className="chat-search-result"
                            >
                              <div className="chat-search-avatar">
                                {store.store_logo ? (
                                  <img src={store.store_logo} alt="" />
                                ) : (
                                  store.store_name[0].toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="chat-search-name">{store.store_name}</div>
                                <div className="chat-search-hint">Bonyeza kuanza mazungumzo</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {isSearching && (
                        <div className="chat-searching-text">Inatafuta...</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHAT WINDOW */}
          <div className={`chat-window-container ${isMobile && showMobileChat ? 'active-mobile-chat' : ''}`}>
            {!activeChat ? (
              <div className="chat-empty-state">
                <div className="empty-state-content">
                  <img src={messageImage} alt="Chat Protection" className="empty-chat-img" />
                  <h2>Keep chats and transactions on Skyfall.com to enjoy order protection.</h2>
                </div>
              </div>
            ) : (
              <div className="active-chat-content">
                <div className="chat-header-active">
                  <div className="chat-header-active-left">
                    {activeChat && isMobile && showMobileChat && (
                      <button onClick={handleBackNavigation} className="mobile-back-btn">
                        <ChevronLeft size={28} color="#333" />
                      </button>
                    )}
                    <div className="chat-avatar chat-header-avatar">
                      {activeChat.avatar ? (
                        <img src={activeChat.avatar} alt={activeChat.name} />
                      ) : (
                        <span>{activeChat.name[0]?.toUpperCase() || '?'}</span>
                      )}
                    </div>
                    <h4>{activeChat.name}</h4>
                  </div>
                </div>

                <div className={`messages-display ${isMobile ? 'mobile' : 'desktop'}`}>
                  {messages.length === 0 ? (
                    <div className="messages-empty">
                      <p>Hakuna ujumbe bado.</p>
                      <p className="hint">Andika ujumbe ili kuanza mazungumzo na muuzaji!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={msg.id || `msg-${index}`}
                        className={`message-bubble ${msg.sender_id === currentUserId ? 'sent' : 'received'}`}
                      >
                        <div className="bubble-content">
                          <div className="message-sender-name">
                            {getSenderName(msg)}
                          </div>

                          {msg.image && (
                            <img src={msg.image} alt="Sent attachment" className="message-image" />
                          )}

                          {msg.content && msg.content !== 'Image' && (
                            <p className="message-text">{msg.content}</p>
                          )}

                          <span className="msg-timestamp">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="message-input-area" onSubmit={handleSendMessage}>
                  {selectedImage && (
                    <div className="image-preview-wrapper">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="image-preview-remove"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="message-input-row">
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-input').click()}
                      className="image-upload-btn"
                    >
                      <ImageIcon size={24} />
                    </button>

                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      className="file-input-hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedImage(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="message-text-input"
                    />

                    <button type="submit" className="send-btn">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV - Imefichwa */}
      {isMobile && (
        <nav className="mobile-bottom-nav" style={{ display: 'none' }}>
          <button onClick={() => navigate(isSupplier ? '/dashboard/sellerboard' : '/dashboard')}>
            <Home size={22} />
            <span>{isSupplier ? 'Duka' : 'Home'}</span>
          </button>

          <button onClick={() => navigate(isSupplier ? '/dashboard/notifications' : '/dashboard/orders')}>
            <ClipboardList size={22} />
            <span>{isSupplier ? 'Oda' : 'Orders'}</span>
          </button>

          <button onClick={handleSearchNavigation}>
            <div className="search-btn-circle">
              <Search size={24} color="white" />
            </div>
            <span>Search</span>
          </button>

          <button onClick={() => navigate('/advertise')}>
            <Megaphone size={22} />
            <span>Ads</span>
          </button>

          <button onClick={() => navigate('/dashboard/notifications')}>
            <Bell size={22} />
            <span>Alerts</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default Messages;