import { useState } from "react";
import * as LucideIcons from "lucide-react";

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Je, Skyfall ni nini?",
      a: "Skyfall ni jukwaa la biashara ya jumla (B2B) linalowaunganisha wanunuzi na wauzaji kutoka Tanzania na duniani kote."
    },
    {
      q: "Jinsi ya kujiunga na Skyfall?",
      a: "Bonyeza 'Login to sell' au 'Sign Up', jaza maelezo yako, na uhakiki akaunti yako kwa barua pepe."
    },
    {
      q: "Je, ninaweza kununua bidhaa moja tu?",
      a: "Ndiyo, unaweza kununua bidhaa moja. Lakini bei ya jumla inahitaji idadi fulani kutoka kwa muuzaji."
    },
    {
      q: "Je, malipo yanalindwa?",
      a: "Ndiyo, Skyfall ina 'Buyer Protection' - pesa yako inalindwa mpaka bidhaa ifike salama."
    },
    {
      q: "Ninachukua hatua gani nikipata bidhaa mbovu?",
      a: "Fungua dispute kwenye 'Order Protections' au wasiliana na support yetu ndani ya siku 14."
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
        <LucideIcons.HelpCircle size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Kituo cha Msaada (FAQ)
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
        Maswali yanayoulizwa mara kwa mara
      </p>

      {faqs.map((faq, index) => (
        <div key={index} style={{ 
          marginBottom: '15px', 
          border: '1px solid #eee', 
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            style={{
              width: '100%',
              padding: '15px 20px',
              textAlign: 'left',
              backgroundColor: openFaq === index ? '#fff7f2' : 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: '500',
              fontSize: '16px'
            }}
          >
            {faq.q}
            {openFaq === index ? <LucideIcons.ChevronUp size={18} /> : <LucideIcons.ChevronDown size={18} />}
          </button>
          {openFaq === index && (
            <div style={{ padding: '15px 20px', backgroundColor: '#f9fafb', borderTop: '1px solid #eee' }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}