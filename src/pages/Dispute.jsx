import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function Dispute() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.FileWarning size={28} style={{ color: '#dc2626', marginRight: '10px' }} />
        Fungua Shauri (Dispute)
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        Ikiwa umepata tatizo na bidhaa au muuzaji, unaweza kufungua shauri kupata suluhisho.
      </p>
      
      <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>Sababu za Kufungua Shauri:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>✓ Bidhaa haikufika</li>
          <li style={{ marginBottom: '10px' }}>✓ Bidhaa ni tofauti na ilivyoelezwa</li>
          <li style={{ marginBottom: '10px' }}>✓ Bidhaa imeharibika au si ya ubora</li>
          <li style={{ marginBottom: '10px' }}>✓ Muuzaji hakujibu</li>
        </ul>
      </div>
      
      <Link to="/contact-support" style={{ backgroundColor: '#ff6a00', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
        Fungua Shauri Sasa
      </Link>
    </div>
  );
}