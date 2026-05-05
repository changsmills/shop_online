import * as LucideIcons from "lucide-react";

export default function ContactSupport() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.Headset size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Wasiliana na Msaada
      </h1>
      
      <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <LucideIcons.MessageCircle size={30} color="#128c7e" />
          <div>
            <h3 style={{ fontWeight: '600' }}>WhatsApp</h3>
            <p style={{ color: '#666' }}>Jibu la haraka kwa ujumbe</p>
            <a href="https://wa.me/255" style={{ color: '#ff6a00', textDecoration: 'none' }}>0754 394 845 →</a>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <LucideIcons.Mail size={30} color="#dc2626" />
          <div>
            <h3 style={{ fontWeight: '600' }}>Barua Pepe</h3>
            <p style={{ color: '#666' }}>Tutumie ujumbe wako</p>
            <a href="mailto:joshuajulius241@gmail.com" style={{ color: '#ff6a00', textDecoration: 'none' }}>joshuajulius241@gmail.com →</a>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <LucideIcons.Phone size={30} color="#27ae60" />
          <div>
            <h3 style={{ fontWeight: '600' }}>Simu</h3>
            <p style={{ color: '#666' }}>Saa za kazi: 8am - 6pm</p>
            <span style={{ color: '#333' }}>0754 394 845</span>
          </div>
        </div>
      </div>
    </div>
  );
}