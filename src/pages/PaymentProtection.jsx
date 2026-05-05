import * as LucideIcons from "lucide-react";

export default function PaymentProtection() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.ShieldCheck size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Ulinzi wa Malipo
      </h1>
      
      <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <p style={{ fontSize: '16px', fontWeight: '500' }}>Malipo yako yanalindwa 100%</p>
        <p style={{ fontSize: '14px', color: '#555', marginTop: '10px' }}>Skyfall inaweka pesa yako salama mpaka wewe uthibitishe umepokea bidhaa kama ilivyoelezwa.</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '10px' }}>Jinsi Ulinzi wetu unavyofanya kazi</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Unalipa muuzaji kupitia Skyfall</li>
          <li>Skyfall inashikilia pesa yako (escrow)</li>
          <li>Muuzaji anaitwa atume bidhaa</li>
          <li>Unapopokea na kuridhika, Skyfall inamtolea muuzaji pesa</li>
          <li>Kama kuna tatizo, tunasaidia kupata refund</li>
        </ol>
      </div>
    </div>
  );
}