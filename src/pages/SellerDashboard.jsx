import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const navigate = useNavigate();

  const handleStartSelling = () => {
    navigate('/create-store'); 
  };

  // Styles constants
  const styles = {
    // Styles za Hero
    heroContainer: {
      position: 'relative', width: '100%', height: '650px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', color: '#fff', overflow: 'hidden',
      backgroundColor: '#000', // 🔥 Badilisha kuwa nyeusi tu
    },
    videoBackground: {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      objectFit: 'cover', opacity: 1, zIndex: 0, // 🔥 Opacity 1 - video inaonekana!
    },
    overlay: {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.2))', // 🔥 Punguza giza
      zIndex: 1,
    },
    content: {
      position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px',
    },
    stepsContainer: {
      background: '#050c1a', padding: '60px 20px', textAlign: 'center', color: '#fff',
    },
    chatWidget: {
      position: 'fixed', bottom: '30px', right: '30px', width: '50px', height: '50px',
      backgroundColor: '#0066ff', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', zIndex: 999,
    },
    
    // Styles za Info na Trust
    infoSection: {
      background: '#f9fafb', padding: '80px 20px',
    },
    infoContainer: {
      maxWidth: '1200px', margin: '0 auto',
    },
    gridTwo: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px',
    },
    infoCard: {
      background: '#fff', padding: '30px', borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee',
    },
    statBox: {
      background: '#fff7f2', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #FF6600',
      marginBottom: '15px',
    },
    badge: {
      display: 'inline-block', background: '#FF6600', color: '#fff',
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
      marginBottom: '10px',
    },

    // Styles MPYA kwa Trust Section
    trustSection: {
      padding: '40px 20px', background: '#ffffff',
    },
    trustContainer: {
      maxWidth: '1000px', margin: '0 auto',
    },
    trustGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', marginTop: '30px',
    },
    trustItem: {
      textAlign: 'center', padding: '20px', background: '#f8faff',
      borderRadius: '12px', border: '1px solid #eef2ff',
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* ==========================================
          1. HERO SECTION (VIDEO - Inaonekana Vizuri!)
         ========================================== */}
      <div style={styles.heroContainer}>
        <video autoPlay loop muted playsInline style={styles.videoBackground}>
          {/* 🔥 Tumia video nzuri inayoonekana vizuri! */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4" type="video/mp4" />
        </video>
        <div style={styles.overlay}></div>

        <div style={styles.content}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '15px' }}>Sell on Skyfall.com</h2>
          <h1 style={{ fontSize: '52px', fontWeight: 700, marginBottom: '30px', lineHeight: 1.2, maxWidth: '800px' }}>
            Scale up your business and go<br />global with one membership
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '35px', cursor: 'pointer' }}>
            <div style={{ background: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '2px' }}>
              <span style={{ color: '#000', fontSize: '12px' }}>▶</span>
            </div>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>Watch 2-min video</span>
          </div>

          <button 
            onClick={handleStartSelling}
            style={{
              backgroundColor: '#1677ff', color: '#fff', padding: '14px 48px',
              borderRadius: '4px', fontSize: '16px', fontWeight: 'bold',
              border: 'none', cursor: 'pointer', transition: '0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0958d9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1677ff'}
          >
            Start selling now
          </button>
        </div>
      </div>

      {/* ==========================================
          2. SEHEMU MPYA: VERIFICATION & TRUST (Thibitisho & Uaminifu)
         ========================================== */}
      <div style={styles.trustSection}>
        <div style={styles.trustContainer}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ background: '#FF6600', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
              ✅ Verified by Skyfall
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '15px 0 5px 0', color: '#111' }}>
              We verify every company and store
            </h2>
            <p style={{ color: '#666', fontSize: '16px' }}>
              To ensure trust, we require all sellers to provide legal business documents before listing.
            </p>
          </div>

          <div style={styles.trustGrid}>
            <div style={styles.trustItem}>
              <div style={{ fontSize: '32px' }}>🏛️</div>
              <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>Business License</h4>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Valid BRELA or Government Certificate</p>
            </div>

            <div style={styles.trustItem}>
              <div style={{ fontSize: '32px' }}>📄</div>
              <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>TIN / Tax ID</h4>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Tax Identification Number for formal trading</p>
            </div>

            <div style={styles.trustItem}>
              <div style={{ fontSize: '32px' }}>🏭</div>
              <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>Physical Location</h4>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Store/Office verification via Google Maps</p>
            </div>

            <div style={styles.trustItem}>
              <div style={{ fontSize: '32px' }}>🛡️</div>
              <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>Store & Product Photos</h4>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Real images of your inventory and office</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px', background: '#fff7f2', padding: '20px', borderRadius: '12px', border: '1px solid #ffe6d5' }}>
            <p style={{ margin: 0, fontSize: '15px', color: '#333' }}>
              <strong style={{ color: '#FF6600' }}>🔒 Only verified sellers</strong> get the "Trusted" badge on their profile, increasing sales by an average of <strong>2.5x</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          3. STEPS SECTION (Hatua 3 - Imebaki sawa!)
         ========================================== */}
      <div style={styles.stepsContainer}>
        <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '60px' }}>Start your borderless business in 3 easy steps:</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ position: 'absolute', top: '35px', left: '15%', right: '15%', height: '2px', background: 'rgba(255,255,255,0.15)', zIndex: 0 }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#729aff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px', color: '#fff' }}>1</div>
            <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 600 }}>Leave your information</div>
            <div style={{ fontSize: '15px', color: '#ccc', marginTop: '4px' }}>for us to contact you</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#729aff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px', color: '#fff' }}>2</div>
            <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 600 }}>Select a plan and pay</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#729aff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px', color: '#fff' }}>3</div>
            <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 600 }}>Verify your business</div>
          </div>
        </div>

        <button 
          onClick={handleStartSelling}
          style={{
            marginTop: '50px', backgroundColor: '#1677ff', color: '#fff',
            padding: '12px 48px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold',
            border: 'none', cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0958d9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1677ff'}
        >
          Start selling now
        </button>
      </div>

      {/* ==========================================
          4. SEHEMU YA MAELEZO NA USHAHIDI WA KUKUZA BIASHARA
         ========================================== */}
      <div style={styles.infoSection}>
        <div style={styles.infoContainer}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#111' }}>
              Who is Skyfall for?
            </h2>
            <p style={{ color: '#666', fontSize: '18px', maxWidth: '700px', margin: '10px auto' }}>
              Built for serious businesses looking to expand their reach to thousands of everyday buyers and small shops.
            </p>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.infoCard}>
              <span style={styles.badge}>📦 Wholesale & Bulk</span>
              <h3 style={{ fontSize: '22px', margin: '10px 0' }}>Wholesalers & Manufacturers</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                If you have <strong>stock of 50+ units</strong> in your category, Skyfall connects you directly to hundreds of retailers and bulk buyers.
              </p>
              <div style={styles.statBox}>
                <strong style={{ color: '#FF6600' }}>📈 Proven Strategy:</strong>
                <p style={{ fontSize: '14px', margin: '5px 0 0 0', color: '#444' }}>
                  Top wholesalers generate <strong>4x more leads</strong> by listing full inventory and offering discounts.
                </p>
              </div>
            </div>

            <div style={styles.infoCard}>
              <span style={styles.badge}>🏪 Retail & Local Shops</span>
              <h3 style={{ fontSize: '22px', margin: '10px 0' }}>Retailers & Small Store Owners</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                We help <strong>local shops and small retailers</strong> reach everyday customers, universities, and hotels looking for single or bulk purchases.
              </p>
              <div style={{ ...styles.statBox, borderLeftColor: '#0071dc' }}>
                <strong style={{ color: '#0071dc' }}>🛒 How it works:</strong>
                <p style={{ fontSize: '14px', margin: '5px 0 0 0', color: '#444' }}>
                  Retailers list products and instantly get access to thousands of local everyday buyers.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '60px', background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#FF6600' }}>💡</span> How we help you grow
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '28px' }}>📊</div>
                <h4 style={{ fontSize: '16px', margin: '5px 0' }}>Data-Driven Insights</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>We show you trending products so you stock exactly what buyers want.</p>
              </div>
              <div>
                <div style={{ fontSize: '28px' }}>🤝</div>
                <h4 style={{ fontSize: '16px', margin: '5px 0' }}>Connect with Buyers</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>From a student buying 1 item to a business buying 100.</p>
              </div>
              <div>
                <div style={{ fontSize: '28px' }}>✅</div>
                <h4 style={{ fontSize: '16px', margin: '5px 0' }}>Verified Trust</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>We verify licenses so buyers trust you instantly, leading to faster sales.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          5. FLOATING CHAT WIDGET
         ========================================== */}
      <div style={styles.chatWidget} onClick={() => window.open('https://wa.me/255754394845', '_blank')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white' }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

    </div>
  );
};

export default SellerDashboard;