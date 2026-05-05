import * as LucideIcons from "lucide-react";

export default function WholesaleBenefits() {
  const benefits = [
    { icon: "TrendingDown", title: "Bei za Jumla", desc: "Pata bidhaa kwa bei ya kiwanda au jumla, si rejareja." },
    { icon: "ShieldCheck", title: "Ulinzi wa Mnunuzi", desc: "Malipo yako yanalindwa mpaka bidhaa ifike salama." },
    { icon: "Truck", title: "Usafirishaji Rahisi", desc: "Tunakusaidia kufuatilia stendi na kukuletea bidhaa." },
    { icon: "Users", title: "Wauzaji Walioidhinishwa", desc: "Wauzaji wote wamekaguliwa na timu yetu." },
    { icon: "MessageCircle", title: "Msaada 24/7", desc: "Timu ya msaada iko tayari kukusaidia wakati wote." },
    { icon: "CreditCard", title: "Malipo Salama", desc: "Lipa kwa M-Pesa, Airtel, au benki." }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>
        <LucideIcons.Gem size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Faida za Wanachama
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', textAlign: 'center' }}>
        Jiunge na maelfu ya wanunuzi wanaonufaika na Skyfall
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {benefits.map((benefit, index) => {
          const Icon = LucideIcons[benefit.icon];
          return (
            <div key={index} style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#fff7f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon && <Icon size={24} color="#ff6a00" />}
              </div>
              <div>
                <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>{benefit.title}</h3>
                <p style={{ fontSize: '13px', color: '#666' }}>{benefit.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}