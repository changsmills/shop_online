import * as LucideIcons from "lucide-react";

export default function ReportAbuse() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.Flag size={28} style={{ color: '#dc2626', marginRight: '10px' }} />
        Ripoti Utapeli / Ubadhifu
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        Ripoti muuzaji au bidhaa unayoshuku ni tapeli au ubadhifu.
      </p>
      
      <div style={{ backgroundColor: '#fef2f2', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #fecaca' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px', color: '#dc2626' }}>Unaripoti nini?</h3>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Aina ya Ripoti</label>
            <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option>Tapeli / Udanganyifu</option>
              <option>Bidhaa Mbovu</option>
              <option>Muuzaji Asiyejibu</option>
              <option>Maudhui Yasiyofaa</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Maelezo ya Tatizo</label>
            <textarea rows="5" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="Eleza kwa undani tatizo lako..."></textarea>
          </div>
          <button style={{ backgroundColor: '#dc2626', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            Tumia Ripoti
          </button>
        </form>
      </div>
    </div>
  );
}