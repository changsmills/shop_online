import * as LucideIcons from "lucide-react";

export default function ShippingInfo() {
  const shippingMethods = [
    { icon: "Bus", title: "Usafirishaji kwa Basi", desc: "Tunatumia makampuni ya mabasi kama Dar Express, Metro, na Abood. Unapata namba za stendi kufuatilia mzigo.", time: "1-3 siku", price: "Kutoka TSh 5,000" },
    { icon: "Truck", title: "Courier / Door-to-Door", desc: "Tunakuletea bidhaa moja kwa moja nyumbani au ofisini kwako.", time: "2-5 siku", price: "Kutoka TSh 15,000" },
    { icon: "Package", title: "Posta (Postal Service)", desc: "Kwa bidhaa ndogo, tunaweza kutumia posta kwa gharama nafuu.", time: "5-14 siku", price: "Kutoka TSh 3,000" }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
        <LucideIcons.Truck size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Maelezo ya Usafirishaji
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
        Jinsi ya kupokea bidhaa zako kwa haraka na salama
      </p>

      <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
        {shippingMethods.map((method, index) => {
          const Icon = LucideIcons[method.icon];
          return (
            <div key={index} style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fff7f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon && <Icon size={24} color="#ff6a00" />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: '600', marginBottom: '5px' }}>{method.title}</h3>
                <p style={{ fontSize: '14px', color: '#555', marginBottom: '10px' }}>{method.desc}</p>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                  <span><LucideIcons.Clock size={14} style={{ marginRight: '5px' }} /> {method.time}</span>
                  <span><LucideIcons.CreditCard size={14} style={{ marginRight: '5px' }} /> {method.price}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '10px' }}>Kufuatilia Stendi yako</h3>
        <p style={{ fontSize: '14px', color: '#555' }}>Baada ya muuzaji kutuma bidhaa, utapokea namba ya stendi (receipt number) kwenye akaunti yako. Nenda kwenye "Fuatilia Stendi" kwa taarifa za usafirishaji.</p>
      </div>
    </div>
  );
}