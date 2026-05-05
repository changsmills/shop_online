import * as LucideIcons from "lucide-react";

export default function Privacy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.Lock size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Sera ya Faragha
      </h1>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '30px' }}>Tarehe ya sasisho: Januari 2026</p>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>1. Taarifa Tunazokusanya</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Tunakusanya jina lako, barua pepe, namba ya simu, na maelezo ya malipo unapotumia Skyfall.</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>2. Jinsi Tunavyotumia Taarifa Zako</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Tunatumia taarifa zako kukusaidia kufanya ununuzi, kuwasiliana na wewe, na kuboresha huduma zetu.</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>3. Usalama wa Taarifa</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Tunatumia teknolojia za kisasa kulinda taarifa zako dhidi ya upotevu au matumizi mabaya.</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>4. Kugawana Taarifa</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Hatutauzi taarifa zako kwa watu wengine. Tunazishiriki tu kwa wauzaji unaponunua bidhaa zao.</p>
      </div>
    </div>
  );
}