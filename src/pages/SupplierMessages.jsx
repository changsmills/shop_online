// src/pages/SupplierMessages.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../axiosConfig';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Send, Menu, ChevronLeft, Home, Bell, Megaphone,
  Search, Image as ImageIcon 
} from 'lucide-react';
import messageImage from "../images/messageSent.svg"; 

const SupplierMessages = () => { 
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBackToDashboard = () => {
    navigate('/dashboard/sellerboard');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate('/dashboard/login');
          return;
        }
        const res = await api.get('/profile/', { headers: { Authorization: `Bearer ${token}` } });
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error("Failed to get profile ID:", err);
      }
    };
    fetchProfile();
  }, [navigate]);

  const fetchMessages = async (partnerId) => {
    if (!partnerId || !currentUserId) return;
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.get('/messages/', {
        params: { user_id: currentUserId, partner_id: partnerId, ordering: 'created_at' },
        headers
      });

      const data = response.data.results || response.data || [];
      setMessages(data); 
    } catch (err) {
      console.error("Error fetching messages:", err.response?.data || err.message);
      setMessages([]);
    }
  };

  const fetchInbox = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await api.get('/messages/', {
        params: { user_id: currentUserId, ordering: '-created_at' },
        headers
      });

      const data = response.data.results || response.data || [];
      const chatGroups = {};

      data.forEach(msg => {
        const isISender = msg.sender_id === currentUserId;
        const actualPartnerId = isISender ? msg.receiver_id : msg.sender_id;
        const partnerName = isISender ? msg.receiver_name : msg.sender_name;
        const finalName = partnerName || `Mteja ${actualPartnerId.slice(0,4)}`;
        
        if (actualPartnerId && !chatGroups[actualPartnerId]) {
          chatGroups[actualPartnerId] = {
            id: actualPartnerId,
            name: finalName,
            avatar: isISender ? (msg.receiver_avatar || null) : (msg.sender_avatar || null),
            lastMsg: msg.content || (msg.image ? '📷 Picha' : ''),
            date: new Date(msg.created_at).toLocaleDateString(),
            timestamp: new Date(msg.created_at).getTime(),
            isUnread: msg.is_read === false && msg.sender_id !== currentUserId
          };
        }
      });

      setChats(Object.values(chatGroups).sort((a,b) => b.timestamp - a.timestamp));
    } catch (err) {
      console.error("Error fetching inbox:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (currentUserId) fetchInbox(); 
  }, [currentUserId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !activeChat || !currentUserId) return;

    const formData = new FormData();
    formData.append('sender', currentUserId);
    formData.append('receiver', activeChat.id);
    formData.append('content', newMessage.trim() || 'Image');
    if (selectedImage) formData.append('image', selectedImage);

    const tempMsg = { 
      id: Date.now(), 
      sender_id: currentUserId, 
      receiver_id: activeChat.id, 
      content: newMessage.trim(),
      image: imagePreview,
      created_at: new Date().toISOString() 
    };
    setMessages(prev => [...prev, tempMsg]);
    const originalMessage = newMessage;
    setNewMessage("");
    setSelectedImage(null);
    setImagePreview(null);
    scrollToBottom();

    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };
      await api.post('/messages/', formData, { headers });
      fetchMessages(activeChat.id);
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      setNewMessage(originalMessage);
      setSelectedImage(selectedImage);
      setImagePreview(imagePreview);
    }
  };

  const handleChatSelect = async (chat) => {
    setActiveChat(chat);
    await fetchMessages(chat.id);
    scrollToBottom();
    if (isMobile) setShowMobileChat(true);
  };

  const handleBackToChatList = () => {
    setShowMobileChat(false);
    setActiveChat(null);
    setMessages([]);
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard/sellerboard', label: 'My Store' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/supplier-messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/supplier-notifications', label: 'Order Alerts' },
    { icon: <Settings size={20} />, path: '/dashboard/supplier-settings', label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-white dark:bg-black font-sans overflow-hidden">
      
      {/* DESKTOP HEADER */}
      {!isMobile && (
        <header className="sticky top-0 z-[100] h-[60px] bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-4">
            <Menu size={22} className="cursor-pointer text-gray-500 hover:text-brand-orange transition-colors" onClick={() => setIsExpanded(!isExpanded)} />
            <Link to="/dashboard/sellerboard" className="text-xl font-extrabold text-brand-orange tracking-tight">Skyfall.com</Link>
          </div>
        </header>
      )}

      <div className={`flex flex-1 overflow-hidden ${isMobile ? 'pb-[70px]' : ''}`}>
        
        {/* DESKTOP SIDEBAR */}
        {!isMobile && (
          <aside 
            onMouseEnter={() => setIsExpanded(true)} 
            onMouseLeave={() => setIsExpanded(false)} 
            className={`${isExpanded ? 'w-[240px]' : 'w-[72px]'} transition-all duration-300 flex flex-col bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 pt-2 shrink-0 z-10 overflow-x-hidden`}
          >
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center h-[48px] mx-2.5 my-1 rounded-lg transition-colors ${location.pathname.startsWith(item.path) ? 'bg-orange-50 dark:bg-orange-950/30 text-brand-orange' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
              >
                <div className="min-w-[52px] flex justify-center items-center">{item.icon}</div>
                <span className={`text-sm font-semibold whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
              </Link>
            ))}
          </aside>
        )}

        {/* MESSAGES CONTAINER */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* CHAT LIST SIDEBAR (INBOX) */}
          {(!isMobile || (isMobile && !showMobileChat)) && (
            <div className={`${isMobile ? 'w-full' : 'w-[320px]'} shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-black`}>
              
              {/* INBOX HEADER + SEARCH */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
                {isMobile && (
                  <button onClick={handleBackToDashboard} className="p-1 bg-transparent border-none cursor-pointer">
                    <ChevronLeft size={24} className="text-gray-800 dark:text-gray-200" />
                  </button>
                )}
                <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white shrink-0">Inbox</h3>
                <div className="relative flex-1 min-w-0">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" placeholder="Tafuta..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full pl-8 pr-2 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white outline-none focus:border-brand-orange transition-colors" 
                  />
                </div>
              </div>

              {/* CHAT LIST */}
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="p-2.5 animate-pulse">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-3.5 w-2/5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : chats.length === 0 ? (
                  <p className="p-5 text-center text-gray-400">Hakuna mazungumzo bado</p>
                ) : (
                  chats.map(chat => (
                    <div 
                      key={chat.id} 
                      onClick={() => handleChatSelect(chat)} 
                      className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-50 dark:border-gray-800 transition-colors ${chat.isUnread ? 'bg-orange-50/50 dark:bg-orange-950/10' : activeChat?.id === chat.id ? 'bg-gray-100 dark:bg-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                        {chat.avatar ? (<img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />) : (chat.name[0]?.toUpperCase() || '?')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className={`${chat.isUnread ? 'font-bold text-brand-orange' : 'font-semibold text-gray-900 dark:text-white'} truncate`}>{chat.name}</span>
                          <span className="text-[11px] text-gray-400 ml-2 shrink-0">{chat.date}</span>
                        </div>
                        <p className={`text-[13px] mt-1 truncate ${chat.isUnread ? 'font-bold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                          {chat.lastMsg?.length > 40 ? chat.lastMsg.substring(0, 40) + '...' : chat.lastMsg}
                        </p>
                      </div>
                      {chat.isUnread && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange shrink-0 shadow-[0_0_5px_rgba(255,106,0,0.5)]"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* CHAT WINDOW */}
          <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-[#0a0a0a] ${isMobile && showMobileChat ? 'fixed inset-0 z-[9999] h-full' : (isMobile ? 'hidden' : 'flex')}`}>
            {!activeChat ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                <img src={messageImage} alt="Chat" className="w-[150px] max-w-full opacity-80" />
                <h2 className="mt-5 text-lg font-semibold text-gray-600 dark:text-gray-300">Endelea mazungumzo salama kwenye Skyfall.</h2>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                
                {/* CHAT HEADER */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black shrink-0">
                  {isMobile && showMobileChat && (
                    <button onClick={handleBackToChatList} className="p-1 bg-transparent border-none cursor-pointer">
                      <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold shrink-0">{activeChat.name[0]}</div>
                  <h4 className="m-0 text-base font-bold text-gray-900 dark:text-white">{activeChat.name}</h4>
                </div>
                
                {/* MESSAGES DISPLAY */}
                <div className="flex-1 overflow-y-auto p-4 md:p-5 pb-[100px] md:pb-[40px]">
                  {messages.length === 0 ? <p className="text-center text-gray-400">Hakuna ujumbe bado</p> : messages.map((msg, idx) => (
                    <div key={idx} className={`flex mb-3 ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-xl ${msg.sender_id === currentUserId ? 'bg-brand-orange text-white rounded-tr-sm' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                        {msg.image && (
                          <img src={msg.image} alt="Attachment" className="max-w-[200px] rounded-lg mb-1.5 block" />
                        )}
                        {msg.content && msg.content !== 'Image' && (
                          <p className="m-0 text-sm leading-relaxed">{msg.content}</p>
                        )}
                        <span className="text-[10px] opacity-70 block mt-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="mb-[20px]" />
                </div>

                {/* MESSAGE INPUT */}
                <form onSubmit={handleSendMessage} className="fixed md:relative bottom-0 left-0 right-0 p-3 md:p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2 z-[10000]">
                  
                  {selectedImage && (
                    <div className="relative w-24 h-24">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                      <button type="button" onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs">✕</button>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => document.getElementById('supplier-file-input').click()} className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-brand-orange transition-colors">
                      <ImageIcon size={24} />
                    </button>
                    <input id="supplier-file-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedImage(file); setImagePreview(URL.createObjectURL(file)); } }} />
                    
                    <input 
                      type="text" placeholder="Andika ujumbe..." 
                      value={newMessage} 
                      onChange={(e) => setNewMessage(e.target.value)} 
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-transparent rounded-full text-sm text-gray-800 dark:text-white outline-none focus:border-brand-orange transition-colors" 
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

      {/* MOBILE BOTTOM NAV */}
      {isMobile && !showMobileChat && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black flex justify-around items-center pt-3 pb-5 border-t border-gray-200 dark:border-gray-800 z-[1000]">
          <button onClick={() => navigate('/dashboard/sellerboard')} className="flex flex-col items-center bg-transparent border-none flex-1">
            <Home size={22} className={location.pathname.startsWith('/dashboard/sellerboard') ? 'text-brand-orange' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1 ${location.pathname.startsWith('/dashboard/sellerboard') ? 'text-brand-orange' : 'text-gray-500'}`}>Duka</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-orders')} className="flex flex-col items-center bg-transparent border-none flex-1">
            <ClipboardList size={22} className={location.pathname === '/dashboard/supplier-orders' ? 'text-brand-orange' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1 ${location.pathname === '/dashboard/supplier-orders' ? 'text-brand-orange' : 'text-gray-500'}`}>Oda</span>
          </button>
          <button onClick={() => navigate('/advertise')} className="flex flex-col items-center bg-transparent border-none flex-1">
            <Megaphone size={22} className={location.pathname === '/advertise' ? 'text-brand-orange' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1 ${location.pathname === '/advertise' ? 'text-brand-orange' : 'text-gray-500'}`}>Ads</span>
          </button>
          <button onClick={() => navigate('/dashboard/supplier-notifications')} className="flex flex-col items-center bg-transparent border-none flex-1">
            <Bell size={22} className={location.pathname === '/dashboard/supplier-notifications' ? 'text-brand-orange' : 'text-gray-500'} />
            <span className={`text-[10px] mt-1 ${location.pathname === '/dashboard/supplier-notifications' ? 'text-brand-orange' : 'text-gray-500'}`}>Arifa</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default SupplierMessages;