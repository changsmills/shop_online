import { useState } from "react";
import * as LucideIcons from "lucide-react";

export default function Logistics() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState(null);

  const handleTrack = () => {
    // Simulated tracking
    if (trackingNumber) {
      setResult({
        status: "Inasafirishwa",
        location: "Morogoro",
        estimatedDelivery: "2026-01-25",
        busCompany: "Dar Express",
        receiptNumber: trackingNumber
      });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.Truck size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Fuatilia Stendi (Logistics)
      </h1>
      
      <div style={{ backgroundColor: '#f9fafb', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
        <p style={{ marginBottom: '15px', fontWeight: '500' }}>Weka namba ya stendi / receipt number</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Kwa mfano: DE-2026-001234"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
          />
          <button onClick={handleTrack} style={{ backgroundColor: '#ff6a00', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Fuatilia
          </button>
        </div>
      </div>

      {result && (
        <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>Taarifa za Usafirishaji</h3>
          <p><strong>Namba ya Stendi:</strong> {result.receiptNumber}</p>
          <p><strong>Kampuni ya Basi:</strong> {result.busCompany}</p>
          <p><strong>Hali:</strong> {result.status}</p>
          <p><strong>Mahali:</strong> {result.location}</p>
          <p><strong>Tarehe ya Kukadiriwa:</strong> {result.estimatedDelivery}</p>
        </div>
      )}
    </div>
  );
}