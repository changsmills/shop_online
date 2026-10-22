import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function Dispute() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      {/* Title */}
      <h1 className="text-2xl sm:text-[32px] font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-2.5">
        <LucideIcons.FileWarning size={28} className="text-[#dc2626] flex-shrink-0" />
        Fungua Shauri (Dispute)
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 mb-8">
        Ikiwa umepata tatizo na bidhaa au muuzaji, unaweza kufungua shauri kupata suluhisho.
      </p>

      {/* Reasons Box */}
      <div className="bg-gray-50 dark:bg-slate-800 p-5 rounded-lg mb-8 border border-gray-100 dark:border-slate-700">
        <h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 dark:text-white">
          Sababu za Kufungua Shauri:
        </h3>
        <ul className="list-none p-0 m-0">
          <li className="mb-2.5 text-sm sm:text-base text-gray-700 dark:text-slate-300">
            ✓ Bidhaa haikufika
          </li>
          <li className="mb-2.5 text-sm sm:text-base text-gray-700 dark:text-slate-300">
            ✓ Bidhaa ni tofauti na ilivyoelezwa
          </li>
          <li className="mb-2.5 text-sm sm:text-base text-gray-700 dark:text-slate-300">
            ✓ Bidhaa imeharibika au si ya ubora
          </li>
          <li className="mb-2.5 text-sm sm:text-base text-gray-700 dark:text-slate-300">
            ✓ Muuzaji hakujibu
          </li>
        </ul>
      </div>

      {/* CTA Button */}
      <Link
        to="/contact-support"
        className="inline-block bg-[#ff6a00] hover:bg-[#e55a00] text-white px-6 py-3 rounded-md no-underline font-semibold text-sm sm:text-base transition-colors"
      >
        Fungua Shauri Sasa
      </Link>
    </div>
  );
}