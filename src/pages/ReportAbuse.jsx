import * as LucideIcons from "lucide-react";

export default function ReportAbuse() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      {/* ===== TITLE ===== */}
      <h1 className="text-2xl sm:text-[32px] font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-2.5">
        <LucideIcons.Flag size={28} className="text-[#dc2626] flex-shrink-0" />
        Ripoti Utapeli / Ubadhifu
      </h1>

      {/* ===== SUBTITLE ===== */}
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 mb-8">
        Ripoti muuzaji au bidhaa unayoshuku ni tapeli au ubadhifu.
      </p>

      {/* ===== REPORT FORM CARD ===== */}
      <div className="bg-red-50 dark:bg-[#2d1a1a] p-5 rounded-lg mb-8 border border-red-200 dark:border-[#4a1a1a]">
        <h3 className="font-semibold text-base sm:text-lg mb-4 text-[#dc2626] dark:text-red-400">
          Unaripoti nini?
        </h3>

        <form>
          {/* Report Type */}
          <div className="mb-4">
            <label className="block mb-1.5 font-medium text-sm text-gray-800 dark:text-slate-200">
              Aina ya Ripoti
            </label>
            <select className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>Tapeli / Udanganyifu</option>
              <option>Bidhaa Mbovu</option>
              <option>Muuzaji Asiyejibu</option>
              <option>Maudhui Yasiyofaa</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1.5 font-medium text-sm text-gray-800 dark:text-slate-200">
              Maelezo ya Tatizo
            </label>
            <textarea
              rows="5"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
              placeholder="Eleza kwa undani tatizo lako..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 rounded-md border-none cursor-pointer font-semibold text-sm transition-colors"
          >
            Tumia Ripoti
          </button>
        </form>
      </div>
    </div>
  );
}