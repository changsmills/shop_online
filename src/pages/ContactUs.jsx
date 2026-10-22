import * as LucideIcons from "lucide-react";

export default function ContactUs() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      {/* ===== HEADER ===== */}
      <h1 className="text-2xl sm:text-[32px] font-bold mb-2.5 text-center text-gray-900 dark:text-white flex items-center justify-center gap-2.5">
        <LucideIcons.MessageCircle size={28} className="text-[#ff6a00]" />
        Wasiliana Nasi
      </h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 mb-8 sm:mb-10 text-center">
        Tupo hapa kukusaidia 24/7
      </p>

      {/* ===== CONTACT CARDS GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 sm:gap-6 lg:gap-[30px] mb-10 sm:mb-12">

        {/* WhatsApp Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] text-center border border-gray-100 dark:border-slate-700 transition-transform duration-200 hover:-translate-y-[5px]">
          <div className="w-[70px] h-[70px] rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-5">
            <LucideIcons.MessageCircle size={35} className="text-[#128c7e]" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2.5 text-gray-900 dark:text-white">
            Chat na Msaidizi
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">
            Jibu la haraka kwa ujumbe wa WhatsApp
          </p>
          <a
            href="https://wa.me/255754394845"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center bg-[#128c7e] hover:bg-[#0e6e63] text-white px-6 sm:px-[30px] py-3 rounded-[40px] no-underline font-medium text-sm sm:text-base transition-colors"
          >
            <LucideIcons.MessageCircle size={16} className="mr-2" />
            WhatsApp Sasa
          </a>
        </div>

        {/* Email Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] text-center border border-gray-100 dark:border-slate-700 transition-transform duration-200 hover:-translate-y-[5px]">
          <div className="w-[70px] h-[70px] rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center mx-auto mb-5">
            <LucideIcons.Mail size={35} className="text-[#ff6a00]" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2.5 text-gray-900 dark:text-white">
            Tutumie Barua Pepe
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">
            Tutajibu ndani ya saa 24
          </p>
          <a
            href="mailto:support@skyfall.com"
            className="inline-flex items-center justify-center bg-[#ff6a00] hover:bg-[#e55a00] text-white px-6 sm:px-[30px] py-3 rounded-[40px] no-underline font-medium text-sm sm:text-base transition-colors break-all"
          >
            <LucideIcons.Mail size={16} className="mr-2 flex-shrink-0" />
            support@skyfall.com
          </a>
        </div>

        {/* Office Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] text-center border border-gray-100 dark:border-slate-700 transition-transform duration-200 hover:-translate-y-[5px]">
          <div className="w-[70px] h-[70px] rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mx-auto mb-5">
            <LucideIcons.Building size={35} className="text-[#0071dc]" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2.5 text-gray-900 dark:text-white">
            Ofisi zetu zilipo
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">
            Tembelea ofisi yetu
          </p>
          <button
            onClick={() => window.open('https://maps.google.com/?q=Dar+es+Salaam+Tanzania', '_blank')}
            className="inline-flex items-center justify-center bg-[#0071dc] hover:bg-[#005bb0] text-white px-6 sm:px-[30px] py-3 rounded-[40px] border-none cursor-pointer font-medium text-sm sm:text-base transition-colors"
          >
            <LucideIcons.MapPin size={16} className="mr-2" />
            Tazama Mahali
          </button>
        </div>
      </div>

      {/* ===== CONTACT FORM ===== */}
      <div className="bg-gray-50 dark:bg-slate-800 p-5 sm:p-8 rounded-xl mt-5">
        <h3 className="text-lg sm:text-xl font-semibold mb-5 text-center text-gray-900 dark:text-white">
          Tutumie Ujumbe
        </h3>
        <form className="max-w-[600px] mx-auto">

          <div className="mb-4">
            <input
              type="text"
              placeholder="Jina lako"
              className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Barua pepe yako"
              className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <textarea
              rows="4"
              placeholder="Ujumbe wako..."
              className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff6a00] hover:bg-[#e55a00] text-white px-6 sm:px-[30px] py-3 rounded-lg border-none cursor-pointer font-semibold text-sm sm:text-base transition-colors"
          >
            Tuma Ujumbe
          </button>
        </form>
      </div>
    </div>
  );
}