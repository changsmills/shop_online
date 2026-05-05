import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function HowToBuy() {
  const steps = [
    {
      icon: "UserPlus",
      title: "1. Jiunge / Ingia",
      description: "Jisajili kwa urahisi kwa kutumia email au namba ya simu. Kisha ingia kwenye akaunti yako.",
      color: "#ff6a00"
    },
    {
      icon: "Search",
      title: "2. Tafuta Bidhaa",
      description: "Tumia search bar au browse kwa categories. Unaweza pia kuchuja kwa bei, brand, au location.",
      color: "#0071dc"
    },
    {
      icon: "ShoppingCart",
      title: "3. Ongeza Kwenye Cart",
      description: "Bonyeza 'Add to Cart' kwenye bidhaa unayotaka. Unaweza kuongeza bidhaa nyingi kutoka kwa wauzaji tofauti.",
      color: "#27ae60"
    },
    {
      icon: "FileText",
      title: "4. Kagua Oda Yako",
      description: "Nenda kwenye cart yako, hakikisha wingi na bei ni sahihi. Kisha bonyeza 'Proceed to Checkout'.",
      color: "#8e44ad"
    },
    {
      icon: "Truck",
      title: "5. Chagua Usafirishaji",
      description: "Chagua njia ya usafirishaji. Tunatoa huduma za posta, basi, au courier kwa kutumia stendi.",
      color: "#e67e22"
    },
    {
      icon: "CreditCard",
      title: "6. Lipa Salama",
      description: "Lipa kwa M-Pesa, Airtel Money, au bank transfer. Malipo yako yanalindwa na Skyfall Protection.",
      color: "#16a085"
    }
  ];

  const benefits = [
    { icon: "ShieldCheck", title: "Ulinzi wa Mnunuzi", desc: "Pesa yako inalindwa mpaka bidhaa ifike" },
    { icon: "MessageCircle", title: "Msaada wa 24/7", desc: "Timu yetu iko tayari kukusaidia" },
    { icon: "Truck", title: "Tracking ya Stendi", desc: "Fuata mzigo wako kwa namba za basi" },
    { icon: "RefreshCw", title: "Refund Policy", desc: "Rudisha bidhaa ndani ya siku 14" }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '15px' }}>
          Jinsi ya Kuanza Kununua <span style={{ color: '#ff6a00' }}>Skyfall</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Fuata hatua hizi 6 rahisi kuanza kununua bidhaa kwa bei ya jumla
        </p>
      </div>

      {/* Steps Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '30px',
        marginBottom: '60px'
      }}>
        {steps.map((step, index) => {
          const IconComponent = LucideIcons[step.icon];
          return (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: `${step.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {IconComponent && <IconComponent size={30} color={step.color} />}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{step.description}</p>
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div style={{ backgroundColor: '#f9fafb', borderRadius: '16px', padding: '40px', marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', marginBottom: '40px' }}>
          Kwanini Ununue <span style={{ color: '#ff6a00' }}>Skyfall?</span>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          {benefits.map((benefit, index) => {
            const IconComponent = LucideIcons[benefit.icon];
            return (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {IconComponent && <IconComponent size={32} color="#ff6a00" />}
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>{benefit.title}</h4>
                <p style={{ fontSize: '13px', color: '#666' }}>{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: 'center' }}>
        <Link to="/" style={{
          backgroundColor: '#ff6a00',
          color: 'white',
          padding: '14px 40px',
          borderRadius: '40px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px',
          display: 'inline-block',
          transition: 'background 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e55a00'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6a00'}>
          Anza Kununua Sasa
        </Link>
      </div>
    </div>
  );
}