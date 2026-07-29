import React, { useState, useEffect, useRef } from 'react';
import api from '../axiosConfig'; // 🔥 Tumia api
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, Send, Menu, ChevronLeft, Home, Bell, Megaphone
} from 'lucide-react';

import '../Messages.css';
import '../AccountSettings.css';
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate('/dashboard/login');
          return;
        }
        // 🔥 MABADILIKO: api.get na kuondoa API_BASE_URL
        const res = await api.get('/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
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

      // 🔥 MABADILIKO: api.get na kuondoa API_BASE_URL
      const response = await api.get('/messages/', {
        params: {
          sender: currentUserId,
          receiver: partnerId
        },
        headers
      });

      setMessages(response.data || []);
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

      // 🔥 MABADILIKO: api.get na kuondoa API_BASE_URL
      const response = await api.get('/messages/', {
        params: {
          user_id: currentUserId,
          ordering: '-created_at'
        },
        headers
      });

      const data = response.data || [];
      const chatGroups = {};

      data.forEach(msg => {
        const isISender = msg.sender_id === currentUserId;
        const partnerId = isISender ? msg.receiver_id : msg.sender_id;
        const partnerData = isISender ? msg.receiver : msg.sender;
        const partnerName = partnerData?.full_name || `Mteja ${partnerId.slice(0,4)}`;
        
        if (partnerId && !chatGroups[partnerId]) {
          chatGroups[partnerId] = {
            id: partnerId,
            name: partnerName,
            avatar: partnerData?.avatar_url || null,
            lastMsg: msg.content,
            date: new Date(msg.created_at).toLocaleDateString(),
            timestamp: new Date(msg.created_at).getTime()
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
    if (!newMessage.trim() || !activeChat || !currentUserId) return;

    const tempMsg = { 
      id: Date.now(), 
      sender_id: currentUserId, 
      receiver_id: activeChat.id, 
      content: newMessage, 
      created_at: new Date().toISOString() 
    };
    setMessages(prev => [...prev, tempMsg]);
    const originalMessage = newMessage;
    setNewMessage("");
    scrollToBottom();

    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      // 🔥 MABADILIKO: api.post na kuondoa API_BASE_URL
      await api.post(
        '/messages/',
        {
          sender_id: currentUserId,
          receiver_id: activeChat.id,
          content: originalMessage
        },
        { headers }
      );

      fetchMessages(activeChat.id);
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      setNewMessage(originalMessage);
    }
  };

  const handleChatSelect = async (chat) => {
    setActiveChat(chat);
    await fetchMessages(chat.id);
    scrollToBottom();
    if (isMobile) setShowMobileChat(true);
  };

  const handleBackToChatList = () => setShowMobileChat(false);

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard/sellerboard', label: 'Duka Lako' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/supplier-messages', label: 'Ujumbe' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/supplier-notifications', label: 'Arifa (Oda)' },
    { icon: <Settings size={20} />, path: '/dashboard/supplier-settings', label: 'Mipangilio' },
  ];

  return (
    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="dashboard-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!isMobile && <Menu size={22} style={{ cursor: 'pointer', color: '#666' }} onClick={() => setIsExpanded(!isExpanded)} />}
          <Link to="/dashboard/sellerboard" style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: '#ff6a00', textDecoration: 'none' }}>
            Skyfall.com
          </Link>
        </div>
      </header>

      <div className="dashboard-main" style={{ display: 'flex', flex: 1, overflow: 'hidden', paddingBottom: isMobile ? '70px' : 0 }}>
        {!isMobile && (
          <aside onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)} style={{ width: isExpanded ? '240px' : '72px', transition: 'width 0.3s', overflowX: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRight: '1px solid #eee', paddingTop: '10px', flexShrink: 0, zIndex: 10 }}>
            {sidebarItems.map((item) => (
              <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', height: '48px', textDecoration: 'none', color: location.pathname.startsWith(item.path) ? '#ff6a00' : '#666', margin: '4px 10px', borderRadius: '8px', transition: 'background 0.2s', backgroundColor: location.pathname.startsWith(item.path) ? '#fff5ed' : 'transparent' }}>
                <div style={{ minWidth: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.icon}</div>
                <span style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s ease' }}>{item.label}</span>
              </Link>
            ))}
          </aside>
        )}

        <div className="messages-container" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {(!isMobile || (isMobile && !showMobileChat)) && (
            <div className="messages-sidebar" style={{ width: isMobile ? '100%' : '320px', flexShrink: 0, borderRight: '1px solid #eee' }}>
              <div className="sidebar-header-chat" style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ margin: 0 }}>Mazungumzo</h3>
              </div>
              <div className="chat-list" style={{ overflowY: 'auto', height: '100%' }}>
                {loading ? (<p style={{ padding: '20px', textAlign: 'center' }}>Inapakia...</p>) : chats.length === 0 ? (
                  <p style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>Hakuna mazungumzo bado</p>
                ) : (
                  chats.map(chat => (
                    <div key={chat.id} className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`} onClick={() => handleChatSelect(chat)} style={{ padding: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f5f5f5', backgroundColor: activeChat?.id === chat.id ? '#f3f4f6' : 'transparent' }}>
                      <div className="chat-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ff6a00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                        {chat.avatar ? (<img src={chat.avatar} alt={chat.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />) : (chat.name[0]?.toUpperCase() || '?')}
                      </div>
                      <div className="chat-info" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: '600' }}>{chat.name}</span><span style={{ fontSize: '11px', color: '#999' }}>{chat.date}</span></div>
                        <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.lastMsg?.length > 40 ? chat.lastMsg.substring(0, 40) + '...' : chat.lastMsg}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="chat-window" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: isMobile && showMobileChat ? '100%' : 'auto' }}>
            {!activeChat ? (
              <div className="chat-empty-state" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#999' }}>
                <img src={messageImage} alt="Chat" style={{ width: '150px', maxWidth: '100%' }} />
                <h2 style={{ margin: '20px 0 0', fontSize: '18px' }}>Endelea mazungumzo salama kwenye Skyfall.</h2>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isMobile && showMobileChat && <button onClick={handleBackToChatList} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronLeft size={24} color="#666" /></button>}
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ff6a00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{activeChat.name[0]}</div>
                  <h4 style={{ margin: 0 }}>{activeChat.name}</h4>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f5f5f7' }}>
                  {messages.length === 0 ? <p style={{ textAlign: 'center', color: '#999' }}>Hakuna ujumbe bado</p> : messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.sender_id === currentUserId ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                      <div style={{ maxWidth: '70%', padding: '10px 15px', borderRadius: '12px', backgroundColor: msg.sender_id === currentUserId ? '#ff6a00' : '#e5e7eb', color: msg.sender_id === currentUserId ? '#fff' : '#333' }}>
                        <p style={{ margin: 0 }}>{msg.content}</p>
                        <span style={{ fontSize: '10px', opacity: 0.7, display: 'block', marginTop: '4px' }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', backgroundColor: '#fff' }}>
                  <input type="text" placeholder="Andika ujumbe..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, padding: '12px', border: '1px solid #e0e0e0', borderRadius: '25px', outline: 'none' }} />
                  <button type="submit" style={{ background: '#ff6600', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}><Send size={18} /></button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobile && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 20px', borderTop: '1px solid #eee', zIndex: 1000 }}>
          <button onClick={() => navigate('/dashboard/sellerboard')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1 }}>
            <Home size={22} color={location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname.startsWith('/dashboard/sellerboard') ? '#ff6600' : '#666' }}>Duka</span>
          </button>

          <button onClick={() => navigate('/dashboard/supplier-orders')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1 }}>
            <ClipboardList size={22} color={location.pathname === '/dashboard/supplier-orders' ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/dashboard/supplier-orders' ? '#ff6600' : '#666' }}>Oda</span>
          </button>

          <button onClick={() => navigate('/advertise')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1 }}>
            <Megaphone size={22} color={location.pathname === '/advertise' ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/advertise' ? '#ff6600' : '#666' }}>Ads</span>
          </button>

          <button onClick={() => navigate('/dashboard/supplier-notifications')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', flex: 1 }}>
            <Bell size={22} color={location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666'} />
            <span style={{ fontSize: '10px', color: location.pathname === '/dashboard/supplier-notifications' ? '#ff6600' : '#666' }}>Arifa</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default SupplierMessages;