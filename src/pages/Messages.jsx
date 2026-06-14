import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, 
  Settings, BarChart3, Bell, Search, Send, Menu, 
  ChevronLeft, Home, ShoppingCart, User,
  Plus, Megaphone, Loader2 // ← Ongeza Loader2 hapa
} from 'lucide-react';

import UserTools from '../components/UserTools';
import '../Messages.css';
import '../AccountSettings.css';
import messageImage from "../images/messageSent.svg"; 

const Messages = ({ session }) => {
  const navigate = useNavigate();
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
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [showSearchModal, setShowSearchModal] = useState(false);


  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Sikiliza kama kuna mteja anakuja kuanza chat mpya kutoka kwenye bidhaa
useEffect(() => {
  const startNewChat = async () => {
    if (location.state?.sellerId) {
      const { sellerId, sellerName, productContext } = location.state;

      // 1. Angalia kama huyu seller tayari yupo kwenye list yako ya chats
      const existingChat = chats.find(c => c.id === sellerId);

      if (existingChat) {
        // Kama yupo, mfungue tu
        handleChatSelect(existingChat);
      } else {
        // Kama hayupo (ni mara ya kwanza), tengeneza "Temporary Chat" object
        const temporaryChat = {
          id: sellerId,
          name: sellerName || "Seller",
          avatar: null,
          lastMsg: productContext ? `Ninaulizia: ${productContext}` : "",
          date: "Now"
        };
        
        setActiveChat(temporaryChat);
        
        // Kama unataka kutuma ujumbe wa kwanza automatic kuhusu bidhaa:
        if (productContext) {
           setNewMessage(`Habari, ninaulizia kuhusu bidhaa hii: ${productContext}`);
        }

        if (isMobile) setShowMobileChat(true);
      }
    }
  };

  if (!loading) { // Hakikisha inbox imeshaload kwanza
    startNewChat();
  }
}, [location.state, chats, loading]);

  // Close mobile chat when screen becomes desktop
  useEffect(() => {
    if (!isMobile) {
      setShowMobileChat(false);
    }
  }, [isMobile]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const fetchMessages = async (partnerId) => {
  if (!partnerId || !session?.user?.id) return;

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id ( id, full_name, avatar_url ),
      receiver:receiver_id ( id, full_name, avatar_url )
    `)
    .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${session.user.id})`)
    .order('created_at', { ascending: true });

  if (!error && data) setMessages(data);
  else console.error("Error fetching messages:", error);
};

const fetchInbox = async () => {
  if (!session?.user) return;
  setLoading(true);

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id ( id, full_name, avatar_url ),
      receiver:receiver_id ( id, full_name, avatar_url )
    `)
    .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching inbox:", error);
    setLoading(false);
    return;
  }

  if (data) {
    const chatGroups = {};

    data.forEach(msg => {
      const isISender = msg.sender_id === session.user.id;
      const partnerId = isISender ? msg.receiver_id : msg.sender_id;
      const partnerData = isISender ? msg.receiver : msg.sender;

      if (partnerId && !chatGroups[partnerId]) {
        chatGroups[partnerId] = {
          id: partnerId,
          name: partnerData?.full_name || `User ${partnerId.slice(0,4)}`,
          avatar: partnerData?.avatar_url || null,
          lastMsg: msg.content,
          date: new Date(msg.created_at).toLocaleDateString(),
          timestamp: new Date(msg.created_at).getTime()
        };
      }
    });

    setChats(Object.values(chatGroups).sort((a,b) => b.timestamp - a.timestamp));
  }
  setLoading(false);
};

const handleSearchStores = async (query) => {
  setSearchQuery(query);
  if (query.trim().length < 2) {
    setSearchResults([]);
    return;
  }

  setIsSearching(true);
  const { data, error } = await supabase
    .from('stores_engine')
    .select('owner_id, store_name, store_logo')
    .ilike('store_name', `%${query}%`)
    .neq('owner_id', session.user.id)  // ← ONGEZA HII! Inachuja maduka yako
    .limit(5);

  if (!error && data) {
    setSearchResults(data);
  }
  setIsSearching(false);
};

const handleSelectStoreFromSearch = (store) => {
  const existingChat = chats.find(c => c.id === store.owner_id);
  
  if (existingChat) {
    handleChatSelect(existingChat);
  } else {
    const newChatPartner = {
      id: store.owner_id, 
      name: store.store_name,
      avatar: store.store_logo || null,
      lastMsg: "Anza mazungumzo mapya...",
      date: "New"
    };

    // 1. Safisha meseji za nyuma kwanza
    setMessages([]); 
    
    // 2. Fungua chat mpya
    setActiveChat(newChatPartner);
    
    if (isMobile) setShowMobileChat(true);
  }
  
  setSearchQuery("");
  setSearchResults([]);
};

const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim() || !activeChat) return;

  // 1. Tunatengeneza 'Temporary Message' ya kuonyesha kwenye UI
  const tempMsg = {
    id: Date.now(), // ID ya muda
    sender_id: session.user.id,
    receiver_id: activeChat.id,
    content: newMessage,
    created_at: new Date().toISOString(),
    isPending: true // Hii inatusaidia kujua meseji bado haijafika server
  };

  // 2. Tunaongeza meseji kwenye state KABLA hatujaituma (Optimistic)
  setMessages(prev => [...prev, tempMsg]);
  const originalMessage = newMessage; // Tunahifadhi meseji
  setNewMessage(""); // Tunafuta input
  scrollToBottom();

  // 3. Tunatuma kwenye Supabase
  const { error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: session.user.id,
        receiver_id: activeChat.id,
        content: originalMessage,
      }
    ]);

  if (error) {
    console.error("Error sending:", error);
    // Kama kuna error, tunatoa ile meseji ya muda
    setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
    setNewMessage(originalMessage); // Tunairudisha kwenye input ili mtumiaji ajue haikutumika
  } else {
    // 4. Meseji ikifanikiwa, tunaita fetchMessages ili kupata data rasmi kutoka Supabase (na ID sahihi)
    // TUNAONDOA fetchInbox HAPA ili kuzuia screen kuruka-ruka (kama unataka update, fanya kwenye background)
    fetchMessages(activeChat.id); 
  }
};

  // Handle chat selection (mobile friendly)
  const handleChatSelect = async (chat) => {
    setActiveChat(chat);
    await fetchMessages(chat.id);
    scrollToBottom();
    if (isMobile) {
      setShowMobileChat(true);
    }
  };

  // Handle back button on mobile
  const handleBackToChatList = () => {
    setShowMobileChat(false);
  };

  // Initial fetch & realtime subscription
  useEffect(() => {
    fetchInbox();
    
    const channel = supabase
      .channel('realtime_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        async (payload) => {
          await fetchInbox();
          if (activeChat && (payload.new.sender_id === activeChat.id || payload.new.receiver_id === activeChat.id)) {
            await fetchMessages(activeChat.id);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, activeChat]);

  // Hifadhi activeChat kwenye localStorage kila inapobadilika
useEffect(() => {
  if (activeChat?.id) {
    localStorage.setItem('lastActiveChatId', activeChat.id);
  }
}, [activeChat]);

// Wakati chats zikipakiwa, jaribu kurejesha chat ya mwisho
useEffect(() => {
  const lastChatId = localStorage.getItem('lastActiveChatId');
  if (lastChatId && chats.length > 0 && !activeChat) {
    const lastChat = chats.find(c => c.id === lastChatId);
    if (lastChat) {
      handleChatSelect(lastChat);
    }
  }
}, [chats, activeChat]);

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

  const getSenderName = (msg) => {
    if (msg.sender_id === session.user.id) return "Me";
    return msg.sender?.full_name || "User";
  };

 const handleStoreNavigation = async () => {
  setLoading(true); 

  try {
    const { data: store, error } = await supabase
      .from('stores_engine')
      .select('id') // Hakikisha unachukua ID ya duka (au owner_id)
      .eq('owner_id', session.user.id)
      .maybeSingle();

    if (error) throw error;

    if (store) {
      // HAPA: Ongeza ID ya duka kwenye URL ili ilingane na Route yako
      navigate(`/dashboard/physical/${store.id}`); 
    } else {
      navigate('/create-store');
    }
  } catch (err) {
    console.error("Error:", err);
    navigate('/create-store');
  } finally {
    setLoading(false);
  }
};

  return (

    <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* HEADER */}
      <header className="dashboard-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!isMobile && (
          <Menu 
            size={22} 
            className="menu-toggle" 
            style={{ cursor: 'pointer', color: '#666' }} 
            onClick={() => setIsExpanded(!isExpanded)} 
          />
          )}

          <Link to="/dashboard" style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: '#ff6a00', textDecoration: 'none' }}>
            Skyfall.com
          </Link>

          {!isMobile && (
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search chats..." />
            </div>
          )}
        </div>


       {/* HAPA NDIPO ULIPOTAKIWA KUWEKA SHARTI LA !isMobile */}
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!isMobile && (
            <>
              <Bell size={20} style={{ cursor: 'pointer', color: '#666' }} />
              <UserTools session={session} />
            </>
          )}
        </div>

      </header>

      <div className="dashboard-main" style={{ display: 'flex', flex: 1, overflow: 'hidden',paddingBottom: isMobile ? '70px' : 0 }}>
        {/* SIDEBAR - Hide on mobile (use bottom nav instead) */}
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
                  color: location.pathname === item.path ? '#ff6a00' : '#666',
                  margin: '4px 10px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                  backgroundColor: location.pathname === item.path ? '#fff5ed' : 'transparent',
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
            ))}
          </aside>
        )}

        {/* MESSAGES CONTAINER */}
        <div className="messages-container" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* CHAT LIST SIDEBAR - Hide on mobile when chat is open */}
          {(!isMobile || (isMobile && !showMobileChat)) && (
            <div className="messages-sidebar" style={{ 
              width: isMobile ? '100%' : '320px',
              flexShrink: 0,
              borderRight: '1px solid #eee'
            }}>

<div className="sidebar-header-chat">
  <h3>Inbox</h3>
  <div className="search-bar-chat" style={{ position: 'relative' }}>
    <Search size={14} className="search-icon-chat" />
    <input 
      type="text" 
      placeholder="Tafuta duka..." 
      value={searchQuery}
      onChange={(e) => handleSearchStores(e.target.value)}
      style={{
        // Ongeza hizi kwa mobile experience nzuri
        fontSize: isMobile ? '14px' : '13px',
        padding: isMobile ? '10px 10px 10px 35px' : '8px 8px 8px 32px'
      }}
    />

    {/* Dropdown ya matokeo - itafanya kazi kwenye mobile pia */}
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
        maxHeight: isMobile ? '200px' : '300px', // Mobile smaller height
        overflowY: 'auto',
        border: '1px solid #eee'
      }}>
        {searchResults.map(store => (
          <div 
            key={store.owner_id}
            onClick={() => handleSelectStoreFromSearch(store)}
            style={{
              padding: isMobile ? '10px 12px' : '12px 15px', // Smaller padding for mobile
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
    
    {/* Ongeza loading indicator kwa mobile */}
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
    <p style={{padding: '20px', textAlign: 'center'}}>Inapakia...</p>
  ) : chats.length === 0 ? (
    <>
      {/* Kwa mobile tu - onyesha button ya kutafuta duka */}
      {isMobile && (
        <div style={{
          padding: '30px 20px',
          textAlign: 'center'
        }}>
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
      
      {/* Kwa desktop - onyesha text tu */}
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

{/* SEARCH MODAL - ONLY ON MOBILE */}
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
      onClick={(e) => e.stopPropagation()}  // Ongeza hii - inazuia modal isifunge unapobonyeza ndani
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        marginTop: '60px',
        padding: '20px'
      }}
    >
      {/* Rest of your modal content remains the same */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <h3 style={{margin: 0, fontSize: '18px'}}>Tafuta Duka</h3>
        <button 
          onClick={() => {
            setShowSearchModal(false);
            setSearchResults([]);
            setSearchQuery('');
          }} 
          style={{
            border: 'none', 
            background: 'none', 
            fontSize: '24px', 
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ✕
        </button>
      </div>
      
    {/* The rest of your search input and dropdown remains exactly the same */}
<div className="search-bar-chat" style={{ position: 'relative' }}>
  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '25px', padding: '8px 15px' }}>
    <Search size={18} color="#999" />
    <input 
      type="text" 
      placeholder="Andika jina la duka..."
      value={searchQuery}
      onChange={(e) => handleSearchStores(e.target.value)}
      autoFocus
      style={{
        flex: 1,
        border: 'none',
        outline: 'none',
        padding: '8px 10px',
        fontSize: '14px',
        background: 'transparent'
      }}
    />
  </div>
  
  {/* Dropdown results inside modal */}
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
          key={store.owner_id}
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
          <div className="chat-window" style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            width: isMobile && showMobileChat ? '100%' : 'auto'
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
                    {/* Back button for mobile */}
                    {isMobile && showMobileChat && (
                      <button 
                        onClick={handleBackToChatList}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '4px'
                        }}
                      >
                        <ChevronLeft size={24} color="#666" />
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
                    paddingBottom: isMobile ? 'calc(20px + 70px)' : '20px',  // ← HAPA
                  backgroundColor: '#f5f5f7'
                }}>
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`message-bubble ${msg.sender_id === session.user.id ? 'sent' : 'received'}`}
                    >
                      <div className="bubble-content">
                        <div className="message-sender-name" style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#ff6a00' }}>
                          {getSenderName(msg)}
                        </div>
                        <p style={{ margin: 0, wordBreak: 'break-word' }}>{msg.content}</p>
                        <span className="msg-timestamp" style={{ fontSize: '10px', color: '#999', marginTop: '4px', display: 'block' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className="message-input-area" onSubmit={handleSendMessage} style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '15px 20px',
                  borderTop: '1px solid #eee',
                  backgroundColor: '#fff'
                }}>
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
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

{/* MOBILE BOTTOM NAVIGATION - SAHIHI */}
{isMobile && (
  <nav 
    className="mobile-bottom-nav"
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 0 calc(20px + env(safe-area-inset-bottom, 0px))',
      borderTop: '1px solid #eee',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    }}
  >
    {/* Home */}
    <button 
      onClick={() => navigate('/dashboard')} 
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
      <Home size={22} color={location.pathname === '/dashboard' ? '#ff6600' : '#666'} />
      <span style={{ fontSize: '10px', color: location.pathname === '/dashboard' ? '#ff6600' : '#666' }}>Home</span>
    </button>

    {/* My Orders */}
    <button 
      onClick={() => navigate('/dashboard/orders')} 
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
      <ClipboardList size={22} color={location.pathname === '/dashboard/orders' ? '#ff6600' : '#666'} />
      <span style={{ fontSize: '10px', color: location.pathname === '/dashboard/orders' ? '#ff6600' : '#666' }}>Orders</span>
    </button>

    <button 
  onClick={handleStoreNavigation} // ← Ibadilishe iwe hivi
  disabled={loading} // ← Inazuia kubonyeza mara nyingi wakati inacheki
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    flex: 1,
    padding: '4px 0',
    opacity: loading ? 0.6 : 1 // Inapunguza mwanga wakati inaload
  }}
>
  <div style={{ background: '#ff6600', padding: '8px', borderRadius: '50%', marginBottom: '4px' }}>
    {loading ? (
      <Loader2 size={24} color="white" className="animate-spin" /> // Ongeza icon ya loading ikiwa unayo
    ) : (
      <Plus size={24} color="white" />
    )}
  </div>
  <span style={{ fontSize: '10px', color: '#ff6600', fontWeight: 'bold' }}>
    {loading ? "Inacheki..." : "Store"}
  </span>
</button>

    {/* Advertise */}
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

    {/* Notifications */}
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

      {/* Add padding bottom for mobile to avoid content hiding under bottom nav */}
    {/*   {isMobile && <div style={{ height: '70px' }} />}*/}
    </div>
  );
};

export default Messages;