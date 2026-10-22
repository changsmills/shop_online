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
//import '../Messages.css';
//import '../AccountSettings.css';
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
    <div className="flex flex-col h-screen w-full bg-white dark:bg-[#1e293b] text-black dark:text-white font-sans overflow-hidden">
      
      {/* HEADER (Desktop tu) */}
      {!isMobile && (
        <header className="sticky top-0 z-[100] bg-white dark:bg-[#1e293b] border-b border-[#eee] dark:border-[#334155] shrink-0">
          <div className="flex items-center gap-4 px-5 py-2.5">
            <Menu size={22} className="cursor-pointer text-gray-600 dark:text-gray-400" onClick={() => setIsExpanded(!isExpanded)} />
            <Link to="/dashboard" className="text-xl font-extrabold text-brand-orange no-underline">Skyfall.com</Link>
            <div className="flex items-center gap-2 bg-[#f4f4f4] dark:bg-[#0f172a] px-3.5 py-2 rounded-lg ml-2.5">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search chats..." className="border-none bg-transparent outline-none text-sm w-[200px] text-black dark:text-white" />
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR NAV (Desktop tu) */}
        {!isMobile && (
          <aside 
            className={`flex flex-col bg-white dark:bg-[#1e293b] border-r border-[#eee] dark:border-[#334155] pt-2.5 shrink-0 z-10 transition-all duration-300 ease-in-out ${isExpanded ? 'w-[240px]' : 'w-[72px]'}`}
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
                  className={`flex items-center h-12 no-underline mx-2.5 my-1 rounded-lg transition-colors overflow-hidden ${isActive ? 'text-brand-orange bg-[#fff5ed] dark:bg-[#2d2419]' : 'text-gray-500 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#334155]'}`}
                >
                  <div className="min-w-[52px] flex justify-center items-center">{item.icon}</div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                </Link>
              );
            })}
          </aside>
        )}

        {/* MESSAGES CONTAINER */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* CHAT LIST SIDEBAR */}
          <div className={`flex flex-col shrink-0 border-r border-[#eee] dark:border-[#334155] ${isMobile ? (showMobileChat ? 'hidden' : 'w-full') : 'w-[320px]'}`}>
            
            <div className="flex items-center gap-2.5 p-4 border-b border-[#f1f5f9] dark:border-[#334155] shrink-0">
              <h3 className="m-0 text-lg font-bold text-gray-800 dark:text-white">Inbox</h3>
              
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tafuta duka..."
                  value={searchQuery}
                  onChange={(e) => handleSearchStores(e.target.value)}
                  className="w-full py-2 pr-2 pl-8 border border-[#e0e0e0] dark:border-[#334155] rounded-full text-sm outline-none bg-[#f8f8f8] dark:bg-[#0f172a] text-black dark:text-white"
                />

                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1e293b] shadow-lg rounded-lg z-[1000] mt-2 max-h-[300px] overflow-y-auto border border-[#eee] dark:border-[#334155]">
                    {searchResults.map(store => (
                      <div
                        key={store.id || store.owner_id}
                        onClick={() => handleSelectStoreFromSearch(store)}
                        className="flex items-center gap-3 p-3 px-4 cursor-pointer border-b border-[#f8f8f8] dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#0f172a]"
                      >
                        <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center text-sm font-bold overflow-hidden shrink-0">
                          {store.store_logo ? <img src={store.store_logo} alt="" className="w-full h-full object-cover" /> : store.store_name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800 dark:text-white">{store.store_name}</div>
                          <div className="text-[11px] text-brand-orange">Anza mazungumzo sasa</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isSearching && <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1e293b] p-2.5 text-center text-xs text-gray-500 mt-1 z-[1000]">Inatafuta...</div>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-2.5">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-4 border-b border-[#f5f5f5] dark:border-[#334155] animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#334155] shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-3.5 w-[40%] bg-gray-200 dark:bg-[#334155] rounded mb-2"></div>
                        <div className="h-3 w-[80%] bg-gray-200 dark:bg-[#334155] rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : chats.length === 0 ? (
                <div className="p-5 text-center text-gray-400">
                  <p className="mb-4">Hakuna mazungumzo bado</p>
                  {isMobile && (
                    <button onClick={() => setShowSearchModal(true)} className="bg-brand-orange text-white rounded-full px-6 py-3 text-sm font-semibold flex items-center justify-center gap-2 mx-auto">
                      <Search size={18} /> Tafuta Duka Kuanza Mazungumzo
                    </button>
                  )}
                </div>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    className={`flex p-3 px-4 gap-3 cursor-pointer transition-colors border-b border-[#f9fafb] dark:border-[#334155] ${activeChat?.id === chat.id ? 'bg-[#fff0e6] dark:bg-[#2d2419] border-l-[3px] border-brand-orange' : 'hover:bg-gray-50 dark:hover:bg-[#334155]'}`}
                  >
                    <div className="w-11 h-11 bg-gray-200 dark:bg-[#334155] rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-white shrink-0">
                      {chat.avatar ? <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover rounded-full" /> : <span>{chat.name[0]?.toUpperCase() || '?'}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{chat.name}</span>
                        <span className="text-[11px] text-gray-400 dark:text-[#94a3b8]">{chat.date}</span>
                      </div>
                      <p className="text-[13px] text-gray-500 dark:text-[#94a3b8] truncate m-0">
                        {chat.lastMsg?.length > 40 ? chat.lastMsg.substring(0, 40) + '...' : chat.lastMsg}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className={`flex-1 flex flex-col ${isMobile ? (showMobileChat ? 'flex' : 'hidden') : 'flex'}`}>
            {!activeChat ? (
              <div className="flex items-center justify-center h-full p-10 bg-[#fafafa] dark:bg-[#0f172a]">
                <div className="text-center max-w-[500px]">
                  <img src={messageImage} alt="Chat Protection" className="max-w-[300px] mb-5 mx-auto opacity-80" />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-[#cbd5e1] leading-relaxed">Keep chats and transactions on Skyfall.com to enjoy order protection.</h2>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                
                <div className="flex items-center justify-between p-3 md:px-5 border-b border-[#eee] dark:border-[#334155] bg-white dark:bg-[#1e293b] shrink-0">
                  <div className="flex items-center gap-3">
                    {isMobile && showMobileChat && (
                      <button onClick={handleBackNavigation} className="flex items-center justify-center bg-[#f0f0f0] dark:bg-[#334155] rounded-full w-10 h-10 border-none cursor-pointer">
                        <ChevronLeft size={28} className="text-[#333] dark:text-white" />
                      </button>
                    )}
                    <div className="w-10 h-10 bg-gray-200 dark:bg-[#334155] rounded-full flex items-center justify-center overflow-hidden">
                      {activeChat.avatar ? <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" /> : <span className="font-bold">{activeChat.name[0]?.toUpperCase() || '?'}</span>}
                    </div>
                    <h4 className="m-0 text-base font-bold text-gray-900 dark:text-white">{activeChat.name}</h4>
                  </div>
                </div>

                <div className={`flex-1 overflow-y-auto p-4 md:p-5 bg-[#f5f5f7] dark:bg-[#0f172a] flex flex-col gap-3 ${isMobile ? 'mb-[60px]' : 'pb-[60px] mb-5'}`}>
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm text-center p-5">
                      <p className="m-0">Hakuna ujumbe bado.</p>
                      <p className="mt-1 text-xs text-gray-300 dark:text-gray-600">Andika ujumbe ili kuanza mazungumzo na muuzaji!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={msg.id || `msg-${index}`} className={`flex flex-col max-w-[70%] ${msg.sender_id === currentUserId ? 'self-end' : 'self-start'}`}>
                        <div className={`${msg.sender_id === currentUserId ? 'bg-[#dcf8c6] dark:bg-[#7c2d12] text-[#303030] dark:text-white rounded-[15px_15px_0_15px]' : 'bg-white dark:bg-[#1e293b] text-[#303030] dark:text-[#e2e8f0] rounded-[15px_15px_15px_0]'} p-2.5 px-4 shadow-sm`}>
                          
                          <div className="text-[10px] font-bold text-gray-500 dark:text-[#94a3b8] mb-1">
                            {getSenderName(msg)}
                          </div>

                          {msg.image && <img src={msg.image} alt="Sent attachment" className="max-w-full rounded-lg mb-1.5" />}

                          {msg.content && msg.content !== 'Image' && (
                            <p className="m-0 text-sm leading-relaxed">{msg.content}</p>
                          )}

                          <span className="text-[10px] text-gray-500 dark:text-[#94a3b8] mt-1 self-end block text-right">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className={`flex flex-col gap-2.5 p-3 md:px-5 border-t border-[#eee] dark:border-[#334155] bg-white dark:bg-[#1e293b] shrink-0 ${isMobile ? 'fixed bottom-0 left-0 right-0 z-[10000]' : ''}`} onSubmit={handleSendMessage}>
                  {selectedImage && (
                    <div className="relative w-[100px] h-[100px]">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[10px] border border-[#eee] dark:border-[#334155]" />
                      <button
                        type="button"
                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs border-none cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5">
                    <button type="button" onClick={() => document.getElementById('file-input').click()} className="bg-transparent border-none cursor-pointer text-gray-500 dark:text-[#94a3b8] p-1 flex items-center justify-center">
                      <ImageIcon size={24} />
                    </button>

                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) { setSelectedImage(file); setImagePreview(URL.createObjectURL(file)); }
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 p-3 border border-[#e0e0e0] dark:border-[#334155] rounded-full outline-none text-sm bg-white dark:bg-[#0f172a] text-black dark:text-white"
                    />

                    <button type="submit" className="bg-brand-orange hover:bg-brand-hover border-none rounded-full w-11 h-11 flex items-center justify-center cursor-pointer text-white shrink-0 transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </form>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH MODAL */}
      {isMobile && showSearchModal && (
        <div onClick={() => { setShowSearchModal(false); setSearchResults([]); setSearchQuery(''); }} className="fixed inset-0 bg-black/50 z-[2000] flex items-start justify-center p-5">
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-[400px] mt-[60px] p-5 border border-transparent dark:border-[#334155]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-lg font-bold text-gray-800 dark:text-white">Tafuta Duka</h3>
              <button onClick={() => { setShowSearchModal(false); setSearchResults([]); setSearchQuery(''); }} className="border-none bg-transparent text-2xl cursor-pointer text-gray-500 dark:text-white">✕</button>
            </div>

            <div className="relative">
              <div className="flex items-center border border-[#e0e0e0] dark:border-[#334155] rounded-full p-2 px-4">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="Andika jina la duka..." value={searchQuery} onChange={(e) => handleSearchStores(e.target.value)} autoFocus className="flex-1 border-none outline-none p-2 px-2.5 text-sm bg-transparent text-black dark:text-white" />
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1e293b] shadow-lg rounded-lg z-[1000] mt-2 max-h-[200px] overflow-y-auto border border-[#eee] dark:border-[#334155]">
                  {searchResults.map(store => (
                    <div key={store.id || store.owner_id} onClick={() => { handleSelectStoreFromSearch(store); setShowSearchModal(false); setSearchQuery(''); setSearchResults([]); }} className="flex items-center gap-3 p-3 px-3.5 cursor-pointer border-b border-[#f8f8f8] dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                      <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                        {store.store_logo ? <img src={store.store_logo} alt="" className="w-full h-full object-cover" /> : store.store_name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-white">{store.store_name}</div>
                        <div className="text-[10px] text-brand-orange">Bonyeza kuanza mazungumzo</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isSearching && <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1e293b] p-2.5 text-center text-xs text-gray-500 mt-1 z-[1000]">Inatafuta...</div>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Messages;