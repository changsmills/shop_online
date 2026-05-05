import * as LucideIcons from "lucide-react";

export default function Verification() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.CheckCircle size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Uhakiki wa Bidhaa
      </h1>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '10px' }}>Bidhaa Zilizothibitishwa</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Skyfall inathibitisha wauzaji wote na bidhaa zao kabla ya kuruhusiwa kwenye jukwaa letu.</p>
      </div>

      <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <LucideIcons.CheckCircle size={20} color="#27ae60" />
          <span>Wauzaji wote wanakaguliwa na timu yetu</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <LucideIcons.CheckCircle size={20} color="#27ae60" />
          <span>Bidhaa zenye certification zina alama maalum</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <LucideIcons.CheckCircle size={20} color="#27ae60" />
          <span>Mapitio ya wanunuzi wengine yanasaidia kuhakiki ubora</span>
        </div>
      </div>
    </div>
  );
}