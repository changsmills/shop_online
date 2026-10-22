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
    <div className="max-w-[800px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      {/* ===== TITLE ===== */}
      <h1 className="text-2xl sm:text-[32px] font-bold mb-2.5 text-gray-900 dark:text-white flex items-center gap-2.5">
        <LucideIcons.HelpCircle size={28} className="text-[#ff6a00] flex-shrink-0" />
        Kituo cha Msaada (FAQ)
      </h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 mb-8 sm:mb-10">
        Maswali yanayoulizwa mara kwa mara
      </p>

      {/* ===== FAQ LIST ===== */}
      {faqs.map((faq, index) => {
        const isOpen = openFaq === index;
        return (
          <div
            key={index}
            className="mb-3.5 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
          >
            {/* Question Button */}
            <button
              onClick={() => setOpenFaq(isOpen ? null : index)}
              className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left border-none cursor-pointer flex justify-between items-center font-medium text-sm sm:text-base transition-colors ${
                isOpen
                  ? 'bg-orange-50 dark:bg-orange-950/30 text-gray-900 dark:text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <span className="pr-3">{faq.q}</span>
              <span className="flex-shrink-0 text-gray-500 dark:text-slate-400">
                {isOpen ? (
                  <LucideIcons.ChevronUp size={18} />
                ) : (
                  <LucideIcons.ChevronDown size={18} />
                )}
              </span>
            </button>

            {/* Answer Panel */}
            {isOpen && (
              <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed animate-[fadeIn_0.2s_ease]">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}