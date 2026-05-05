import * as LucideIcons from "lucide-react";

export default function RefundPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
        <LucideIcons.RefundCc size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Sera ya Kurudisha Pesa
      </h1>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '30px' }}>Tarehe ya sasisho: Januari 2026</p>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '10px' }}>1. Unaweza Kurudisha Pesa lini?</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>✓ Bidhaa haikufika kabisa</li>
          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>✓ Bidhaa ni tofauti kabisa na ilivyoelezwa</li>
          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>✓ Bidhaa imeharibika au si ya ubora uliotarajiwa</li>
          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>✓ Muuzaji hakujibu kwa zaidi ya siku 7</li>
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '10px' }}>2. Muda wa Kurudisha Pesa</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>Una muda wa <strong>siku 14</strong> tangu utakapopokea bidhaa kufungua dispute. Baada ya hapo, hatuwezi kuhakikisha refund.</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '10px' }}>3. Mchakato wa Refund</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Fungua dispute kupitia "Order Protections"</li>
          <li>Toa ushahidi (picha, video, au maelezo)</li>
          <li>Skyfall itachunguza ndani ya siku 3-7</li>
          <li>Ukitupatia, pesa itarejeshwa kwa M-Pesa/Airtel</li>
        </ol>
      </div>

      <div style={{ backgroundColor: '#fef2f2', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
        <p style={{ fontSize: '14px', color: '#555' }}><strong>⚠️ Muhimu:</strong> Hakikisha unapiga picha ya bidhaa kabla ya kuifungua. Hii itasaidia kama ushahidi wakati wa dispute.</p>
      </div>
    </div>
  );
}