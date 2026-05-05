import * as LucideIcons from "lucide-react";

export default function Terms() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.FileText size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Vigezo na Masharti
      </h1>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '30px' }}>Tarehe ya sasisho: Januari 2026</p>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>1. Kukubaliana na Vigezo</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Kwa kutumia Skyfall, unakubali kufuata vigezo na masharti haya. Ikiwa hukubaliani, tafadhali usitumie huduma zetu.</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>2. Akaunti za Watumiaji</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Wewe ndiye mwenye jukumu la usalama wa akaunti yako. Taarifa zote unazotoa lazima ziwe sahihi na kamili.</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>3. Ununuzi na Malipo</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Unapofanya ununuzi, unakubali kulipa bei iliyoorodheshwa. Skyfall haina jukumu la ubora wa bidhaa kutoka kwa wauzaji.</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>4. Marejesho na Refund</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Marejesho yanafanywa kwa mujibu wa sera ya muuzaji. Skyfall itasaidia katika mchakato wa dispute.</p>
      </div>
    </div>
  );
}