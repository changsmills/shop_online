import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

const SkyfallBusinessPage = () => {
  const navigate = useNavigate();

  // Navigation handlers
  const handleStartSelling = () => {
    navigate('/create-store');
  };

  const handleLearnMore = () => {
    // Scroll to steps section au navigate to about page
    const stepsSection = document.getElementById('steps-section');
    if (stepsSection) {
      stepsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterSeller = () => {
    navigate('/dashboard/register');
  };

  const handleLogin = () => {
    navigate('/dashboard/login');
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#333', backgroundColor: '#fff' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        padding: '80px 10% 60px 10%', 
        background: 'linear-gradient(135deg, #fff7f2 0%, #ffffff 100%)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '40px'
      }}>
        <div>
          <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', color: '#111', marginBottom: '20px' }}>
            Skyfall ni nini? <br/>
            <span style={{ color: '#ff6a00' }}>Soko Kuu la Kidijitali Tanzania.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6', marginBottom: '30px', maxWidth: '500px' }}>
            Skyfall ni jukwaa la kibiashara linalounganisha wauzaji wa jumla na rejareja nchi nzima. Tunarahisisha biashara kwa kukupa teknolojia ya kisasa ya kuwafikia wateja wengi zaidi.
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleStartSelling}
              style={{ 
                backgroundColor: '#ff6a00', 
                color: 'white', 
                padding: '15px 30px', 
                borderRadius: '8px', 
                border: 'none', 
                fontWeight: 'bold', 
                fontSize: '16px', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a00'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6a00'}
            >
              Anza Kuuza Bure
            </button>
            <button 
              onClick={handleLearnMore}
              style={{ 
                backgroundColor: 'transparent', 
                color: '#ff6a00', 
                padding: '15px 30px', 
                borderRadius: '8px', 
                border: '2px solid #ff6a00', 
                fontWeight: 'bold', 
                fontSize: '16px', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ff6a00';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#ff6a00';
              }}
            >
              Jifunze Zaidi
            </button>
          </div>
          
          {/* Login link for existing sellers */}
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            Tayari una akaunti? <span 
              onClick={handleLogin}
              style={{ color: '#ff6a00', cursor: 'pointer', fontWeight: '600' }}
            >
              Ingia hapa
            </span>
          </p>
        </div>
        
        {/* STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { label: 'Mikoa na Wilaya', val: '500+', sub: 'Tanzania nzima' },
            { label: 'Viwanda & Store', val: '1,000+', sub: 'Zilizothibitishwa' },
            { label: 'Bidhaa (Categories)', val: '5,900+', sub: 'Zinazouzwa' },
            { label: 'Lugha za Biashara', val: '2+', sub: 'Kiswahili & English' }
          ].map((stat, i) => (
            <div key={i} style={{ 
              padding: '30px', 
              backgroundColor: 'white', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
              borderRadius: '12px', 
              border: '1px solid #eee',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#ff6a00', margin: '0 0 5px 0' }}>{stat.val}</h2>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0' }}>{stat.label}</p>
              <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. STEPS SECTION (Mchakato wa Kuanza) */}
      <section id="steps-section" style={{ padding: '80px 10%', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '15px' }}>Ni rahisi kuanza kuuza kwenye Skyfall</h2>
          <p style={{ color: '#666' }}>Fuata hatua hizi chache kukuza biashara yako leo.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ 
            position: 'relative', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" 
              alt="Business Growth" 
              style={{ width: '100%', display: 'block', objectFit: 'cover' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {[
              { 
                title: 'Fungua Akaunti', 
                desc: 'Jisajili kama muuzaji na upate duka lako la kidijitali ndani ya dakika 2.', 
                icon: <LucideIcons.UserPlus />,
                action: () => navigate('/dashboard/register'),
                path: '/dashboard/register'
              },
              { 
                title: 'Pakia Bidhaa', 
                desc: 'Weka picha nzuri na bei za bidhaa zako ili wateja wazione.', 
                icon: <LucideIcons.Package />,
                action: () => navigate('/dashboard/products'),
                path: '/dashboard/products'
              },
              { 
                title: 'Weka Matangazo (Ads)', 
                desc: 'Tumia Skyfall Ads kupata kipaumbele na kuonekana mbele ya washindani.', 
                icon: <LucideIcons.Zap />,
                action: () => navigate('/advertise'),
                path: '/advertise'
              },
              { 
                title: 'Pokea Oda na Kulipwa', 
                desc: 'Ongea na wateja na upokee malipo yako kwa usalama kabisa.', 
                icon: <LucideIcons.CreditCard />,
                action: () => navigate('/dashboard/orders'),
                path: '/dashboard/orders'
              }
            ].map((step, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  gap: '20px',
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                onClick={step.action}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  backgroundColor: '#fff', 
                  color: '#ff6a00', 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  boxShadow: '0 5px 15px rgba(255,106,0,0.2)',
                  flexShrink: 0
                }}>
                  {step.icon}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '700' }}>Hatua ya {i+1}: {step.title}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION (Nyongeza) */}
      <section style={{ padding: '80px 10%', backgroundColor: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '15px' }}>Kwa nini kuchagua Skyfall?</h2>
          <p style={{ color: '#666' }}>Tunakupa zana bora za kukuza biashara yako</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { icon: <LucideIcons.Shield size={40} />, title: 'Usalama wa Juu', desc: 'Malipo na taarifa zako zinalindwa kwa teknolojia za kisasa' },
            { icon: <LucideIcons.Truck size={40} />, title: 'Usafirishaji Rahisi', desc: 'Tunaungana na makampuni bora ya usafirishaji Tanzania' },
            { icon: <LucideIcons.Headphones size={40} />, title: 'Msaada wa 24/7', desc: 'Timu yetu iko tayari kukusaidia wakati wote' },
            { icon: <LucideIcons.BarChart3 size={40} />, title: 'Analytics za Biashara', desc: 'Fuata mauzo yako na ujue wateja wako wanataka nini' }
          ].map((feature, i) => (
            <div key={i} style={{ 
              textAlign: 'center', 
              padding: '30px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ color: '#ff6a00', marginBottom: '20px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.5' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section style={{ padding: '80px 10%', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '15px' }}>Wanachosema Wajasiriamali</h2>
          <p style={{ color: '#666' }}>Maelfu ya wauzaji wanathamini Skyfall</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { name: 'John Mwita', store: 'Mwita Electronics', comment: 'Tangu nianze kutumia Skyfall, mauzo yangu yameongezeka kwa 150%!' },
            { name: 'Sarah John', store: 'Sarah Fashion', comment: 'Rahisi kutumia na wateja wananiamini kwa sababu ya Skyfall.' },
            { name: 'Ali Hassan', store: 'Hassan Hardware', comment: 'Skyfall imenifungulia milango ya wateja wapya nchi nzima.' }
          ].map((testimonial, i) => (
            <div key={i} style={{ 
              backgroundColor: '#fff', 
              padding: '30px', 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <div style={{ color: '#ff6a00', fontSize: '30px', marginBottom: '10px' }}>"</div>
              <p style={{ color: '#555', lineHeight: '1.6', fontStyle: 'italic' }}>{testimonial.comment}</p>
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontWeight: '700', margin: 0 }}>{testimonial.name}</p>
                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{testimonial.store}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA SECTION (Kumalizia) */}
      <section style={{ padding: '100px 10%', textAlign: 'center', background: 'linear-gradient(135deg, #ff6a00 0%, #e55a00 100%)', color: 'white' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px' }}>Tayari kukuza biashara yako?</h2>
        <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto' }}>
          Jiunge na maelfu ya Store za Tanzania zilizopo Skyfall sasa hivi na uanze kuwafikia wateja kutoka kila pembe ya nchi.
        </p>
        <button 
          onClick={handleRegisterSeller}
          style={{ 
            backgroundColor: 'white', 
            color: '#ff6a00', 
            padding: '18px 45px', 
            borderRadius: '30px', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '18px', 
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Jisajili Kama Muuzaji Sasa
        </button>
        <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8 }}>
          Au <span onClick={handleLogin} style={{ textDecoration: 'underline', cursor: 'pointer' }}>ingia kwenye akaunti yako</span> ikiwa tayari una store
        </p>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 10%', backgroundColor: '#111', color: '#666', textAlign: 'center' }}>
        <p>&copy; 2024 Skyfall. Haki zote zimehifadhiwa.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <span onClick={() => navigate('/terms')} style={{ cursor: 'pointer' }}>Terms</span>
          <span onClick={() => navigate('/privacy')} style={{ cursor: 'pointer' }}>Privacy</span>
          <span onClick={() => navigate('/contact-us')} style={{ cursor: 'pointer' }}>Contact</span>
          <span onClick={() => navigate('/help-center')} style={{ cursor: 'pointer' }}>Help</span>
        </div>
      </footer>
    </div>
  );
};

export default SkyfallBusinessPage;