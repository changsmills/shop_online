import * as LucideIcons from "lucide-react";

export default function Privacy() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      {/* ===== TITLE ===== */}
      <h1 className="text-2xl sm:text-[32px] font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-2.5">
        <LucideIcons.Lock size={28} className="text-[#ff6a00] flex-shrink-0" />
        Sera ya Faragha
      </h1>

      {/* ===== LAST UPDATED ===== */}
      <p className="text-xs sm:text-sm text-gray-400 dark:text-slate-500 mb-8">
        Tarehe ya sasisho: Januari 2026
      </p>

      {/* ===== SECTION 1 ===== */}
      <div className="mb-8">
        <h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 dark:text-white">
          1. Taarifa Tunazokusanya
        </h3>
        <p className="leading-relaxed text-sm sm:text-base text-gray-600 dark:text-slate-300 m-0">
          Tunakusanya jina lako, barua pepe, namba ya simu, na maelezo ya malipo unapotumia Skyfall.
        </p>
      </div>

      {/* ===== SECTION 2 ===== */}
      <div className="mb-8">
        <h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 dark:text-white">
          2. Jinsi Tunavyotumia Taarifa Zako
        </h3>
        <p className="leading-relaxed text-sm sm:text-base text-gray-600 dark:text-slate-300 m-0">
          Tunatumia taarifa zako kukusaidia kufanya ununuzi, kuwasiliana na wewe, na kuboresha huduma zetu.
        </p>
      </div>

      {/* ===== SECTION 3 ===== */}
      <div className="mb-8">
        <h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 dark:text-white">
          3. Usalama wa Taarifa
        </h3>
        <p className="leading-relaxed text-sm sm:text-base text-gray-600 dark:text-slate-300 m-0">
          Tunatumia teknolojia za kisasa kulinda taarifa zako dhidi ya upotevu au matumizi mabaya.
        </p>
      </div>

      {/* ===== SECTION 4 ===== */}
      <div className="mb-8">
        <h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 dark:text-white">
          4. Kugawana Taarifa
        </h3>
        <p className="leading-relaxed text-sm sm:text-base text-gray-600 dark:text-slate-300 m-0">
          Hatutauzi taarifa zako kwa watu wengine. Tunazishiriki tu kwa wauzaji unaponunua bidhaa zao.
        </p>
      </div>
    </div>
  );
}