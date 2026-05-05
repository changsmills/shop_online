import * as LucideIcons from "lucide-react";

export default function ContactUs() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>
        <LucideIcons.MessageCircle size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Wasiliana Nasi
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', textAlign: 'center' }}>
        Tupo hapa kukusaidia 24/7
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        {/* WhatsApp */}
        <div style={{ 
          padding: '30px', 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          border: '1px solid #eee',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <LucideIcons.MessageCircle size={35} color="#128c7e" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Chat na Msaidizi</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Jibu la haraka kwa ujumbe wa WhatsApp</p>
          <a 
            href="https://wa.me/255700000000" 
            target="_blank" 
            rel="noreferrer"
            style={{ 
              backgroundColor: '#128c7e', 
              color: 'white', 
              padding: '12px 30px', 
              borderRadius: '40px', 
              textDecoration: 'none', 
              display: 'inline-block',
              fontWeight: '500'
            }}
          >
            <LucideIcons.MessageCircle size={16} style={{ marginRight: '8px' }} />
            WhatsApp Sasa
          </a>
        </div>

        {/* Barua Pepe */}
        <div style={{ 
          padding: '30px', 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          border: '1px solid #eee',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#fff7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <LucideIcons.Mail size={35} color="#ff6a00" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Tutumie Barua Pepe</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Tutajibu ndani ya saa 24</p>
          <a 
            href="mailto:support@skyfall.com" 
            style={{ 
              backgroundColor: '#ff6a00', 
              color: 'white', 
              padding: '12px 30px', 
              borderRadius: '40px', 
              textDecoration: 'none', 
              display: 'inline-block',
              fontWeight: '500'
            }}
          >
            <LucideIcons.Mail size={16} style={{ marginRight: '8px' }} />
            support@skyfall.com
          </a>
        </div>

        {/* Ofisi */}
        <div style={{ 
          padding: '30px', 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          border: '1px solid #eee',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <LucideIcons.Building size={35} color="#0071dc" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Ofisi zetu zilipo</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Tembelea ofisi yetu</p>
          <button 
            onClick={() => window.open('https://maps.google.com/?q=Dar+es+Salaam+Tanzania', '_blank')}
            style={{ 
              backgroundColor: '#0071dc', 
              color: 'white', 
              padding: '12px 30px', 
              borderRadius: '40px', 
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <LucideIcons.MapPin size={16} style={{ marginRight: '8px' }} />
            Tazama Mahali
          </button>
        </div>
      </div>

      {/* Contact Form */}
      <div style={{ backgroundColor: '#f9fafb', padding: '30px', borderRadius: '12px', marginTop: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>Tutumie Ujumbe</h3>
        <form style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '15px' }}>
            <input type="text" placeholder="Jina lako" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input type="email" placeholder="Barua pepe yako" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <textarea rows="4" placeholder="Ujumbe wako..." style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}></textarea>
          </div>
          <button type="submit" style={{ backgroundColor: '#ff6a00', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', width: '100%', fontWeight: '600' }}>
            Tuma Ujumbe
          </button>
        </form>
      </div>
    </div>
  );
}