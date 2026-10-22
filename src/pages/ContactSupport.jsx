import * as LucideIcons from "lucide-react";

export default function ContactSupport() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      <h1 className="text-2xl sm:text-[32px] font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-2.5">
        <LucideIcons.Headset size={28} className="text-[#ff6a00]" />
        Wasiliana na Msaada
      </h1>

      <div className="grid gap-4 sm:gap-5 mb-8">

        {/* WhatsApp Card */}
        <div className="flex items-center gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
          <LucideIcons.MessageCircle size={30} className="text-[#128c7e] flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base m-0">WhatsApp</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 my-1">Jibu la haraka kwa ujumbe</p>
            <a
              href="https://wa.me/255"
              className="text-[#ff6a00] no-underline text-sm sm:text-base font-medium hover:underline"
            >
              0754 394 845 →
            </a>
          </div>
        </div>

        {/* Email Card */}
        <div className="flex items-center gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
          <LucideIcons.Mail size={30} className="text-[#dc2626] flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base m-0">Barua Pepe</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 my-1">Tutumie ujumbe wako</p>
            <a
              href="mailto:joshuajulius241@gmail.com"
              className="text-[#ff6a00] no-underline text-sm sm:text-base font-medium hover:underline break-all"
            >
              joshuajulius241@gmail.com →
            </a>
          </div>
        </div>

        {/* Phone Card */}
        <div className="flex items-center gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
          <LucideIcons.Phone size={30} className="text-[#27ae60] flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base m-0">Simu</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 my-1">Saa za kazi: 8am - 6pm</p>
            <span className="text-gray-800 dark:text-slate-200 text-sm sm:text-base">0754 394 845</span>
          </div>
        </div>

      </div>
    </div>
  );
}