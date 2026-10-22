import { useState } from "react";
import * as LucideIcons from "lucide-react";

export default function Logistics() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState(null);

  const handleTrack = () => {
    if (trackingNumber) {
      setResult({
        status: "Inasafirishwa",
        location: "Morogoro",
        estimatedDelivery: "2026-01-25",
        busCompany: "Dar Express",
        receiptNumber: trackingNumber
      });
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      {/* ===== TITLE ===== */}
      <h1 className="text-2xl sm:text-[32px] font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-2.5">
        <LucideIcons.Truck size={28} className="text-[#ff6a00] flex-shrink-0" />
        Fuatilia Stendi (Logistics)
      </h1>

      {/* ===== TRACKING FORM ===== */}
      <div className="bg-gray-50 dark:bg-slate-800 p-5 sm:p-8 rounded-xl mb-8 border border-gray-100 dark:border-slate-700">
        <p className="mb-4 font-medium text-sm sm:text-base text-gray-800 dark:text-slate-200">
          Weka namba ya stendi / receipt number
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder="Kwa mfano: DE-2026-001234"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleTrack}
            className="bg-[#ff6a00] hover:bg-[#e55a00] text-white px-6 py-3 border-none rounded-lg cursor-pointer font-semibold text-sm transition-colors whitespace-nowrap"
          >
            Fuatilia
          </button>
        </div>
      </div>

      {/* ===== RESULT CARD ===== */}
      {result && (
        <div className="bg-green-50 dark:bg-green-950/30 p-5 rounded-lg border border-green-200 dark:border-green-900/60">
          <h3 className="font-semibold mb-4 text-base sm:text-lg text-green-900 dark:text-green-400">
            Taarifa za Usafirishaji
          </h3>
          <div className="space-y-2 text-sm sm:text-base text-gray-800 dark:text-slate-200">
            <p className="m-0"><strong>Namba ya Stendi:</strong> {result.receiptNumber}</p>
            <p className="m-0"><strong>Kampuni ya Basi:</strong> {result.busCompany}</p>
            <p className="m-0"><strong>Hali:</strong> {result.status}</p>
            <p className="m-0"><strong>Mahali:</strong> {result.location}</p>
            <p className="m-0"><strong>Tarehe ya Kukadiriwa:</strong> {result.estimatedDelivery}</p>
          </div>
        </div>
      )}
    </div>
  );
}