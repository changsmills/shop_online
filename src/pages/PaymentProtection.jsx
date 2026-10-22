import * as LucideIcons from "lucide-react";

export default function PaymentProtection() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      {/* ===== TITLE ===== */}
      <h1 className="text-2xl sm:text-[32px] font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-2.5">
        <LucideIcons.ShieldCheck size={28} className="text-[#ff6a00] flex-shrink-0" />
        Payment Protection
      </h1>

      {/* ===== PROTECTION BANNER ===== */}
      <div className="bg-green-50 dark:bg-green-950/30 p-5 rounded-lg mb-8 border border-green-200 dark:border-green-900/60">
        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white m-0">
          Your payment is 100% protected
        </p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-2.5 mb-0 leading-relaxed">
          Skyfall keeps your money safe until you confirm that you have received the item as described.
        </p>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="mb-8">
        <h3 className="font-semibold text-base sm:text-lg mb-2.5 text-gray-900 dark:text-white">
          How our protection works
        </h3>
        <ol className="pl-5 leading-relaxed sm:leading-[1.8] text-sm sm:text-base text-gray-700 dark:text-slate-300 space-y-1.5">
          <li>You pay the seller through Skyfall</li>
          <li>Skyfall holds your money in escrow</li>
          <li>The seller is notified to ship the item</li>
          <li>Once you receive and are satisfied, Skyfall releases the money to the seller</li>
          <li>If there is an issue, we help you get a refund</li>
        </ol>
      </div>
    </div>
  );
}