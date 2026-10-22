import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-[#fcfcfc] dark:bg-slate-900 min-h-screen">

      {/* ===== HERO SLIDER ===== */}
      <div className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden relative">
        <div className="flex h-full w-[200%] animate-[slideShow_12s_infinite_ease-in-out]">

          <div className="w-1/2 relative">
            <img
              src="/images/business.jfif"
              alt="Business Dashboard"
              className="w-full h-full object-cover brightness-[0.6]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] font-black uppercase tracking-[2px] sm:tracking-[3px] md:tracking-[4px] m-0 [text-shadow:0_10px_20px_rgba(0,0,0,0.3)] animate-[fadeInUp_1s_ease-out]">
                Business Dashboard
              </h2>
            </div>
          </div>

          <div className="w-1/2 relative">
            <img
              src="/images/store_room.jfif"
              alt="Modern Store"
              className="w-full h-full object-cover brightness-[0.6]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] font-black uppercase tracking-[2px] sm:tracking-[3px] md:tracking-[4px] m-0 [text-shadow:0_10px_20px_rgba(0,0,0,0.3)] animate-[fadeInUp_1s_ease-out]">
                Modern Online Store
              </h2>
            </div>
          </div>

        </div>
      </div>

      {/* ===== INTRO SECTION ===== */}
      <div className="max-w-[900px] mx-auto mt-12 sm:mt-16 md:mt-20 mb-12 sm:mb-16 md:mb-20 text-center px-4 sm:px-5 dark:text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold text-[#1a1a1a] dark:text-white mb-4 sm:mb-5">
          Welcome to Virtual Store Platform
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-[1.2rem] text-gray-500 dark:text-slate-400 leading-relaxed sm:leading-[1.8]">
          Create your online store and start earning revenue without owning physical inventory.
        </p>
      </div>

      {/* ===== ACTION CARDS SECTION ===== */}
      <div className="max-w-[1200px] mx-auto mb-16 sm:mb-20 md:mb-[100px] grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-5 sm:gap-6 md:gap-[30px] px-4 sm:px-6">

        {/* Card 1: Dashboard */}
        <div className="relative h-[320px] sm:h-[360px] md:h-[400px] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group hover:-translate-y-[15px]">
          <img
            src="/images/business.jfif"
            alt="Dashboard"
            className="w-full h-full object-cover transition-transform duration-[600ms] ease group-hover:scale-110"
          />
          <Link
            to="/dashboard"
            className="absolute bottom-6 sm:bottom-7 md:bottom-[30px] left-1/2 -translate-x-1/2 w-4/5"
          >
            <button className="w-full px-6 sm:px-7 md:px-[30px] py-3 sm:py-3.5 md:py-4 border-none rounded-[15px] text-sm sm:text-base font-bold cursor-pointer transition-all duration-300 uppercase tracking-wider backdrop-blur-sm bg-green-500/90 text-white shadow-[0_10px_20px_rgba(34,197,94,0.3)] hover:bg-white hover:text-[#111] hover:scale-105">
              Go to Dashboard
            </button>
          </Link>
        </div>

        {/* Card 2: Create Store */}
        <div className="relative h-[320px] sm:h-[360px] md:h-[400px] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group hover:-translate-y-[15px]">
          <img
            src="/images/store_room.jfif"
            alt="Create Store"
            className="w-full h-full object-cover transition-transform duration-[600ms] ease group-hover:scale-110"
          />
          <Link
            to="/create-store"
            className="absolute bottom-6 sm:bottom-7 md:bottom-[30px] left-1/2 -translate-x-1/2 w-4/5"
          >
            <button className="w-full px-6 sm:px-7 md:px-[30px] py-3 sm:py-3.5 md:py-4 border-none rounded-[15px] text-sm sm:text-base font-bold cursor-pointer transition-all duration-300 uppercase tracking-wider backdrop-blur-sm bg-blue-600/90 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:bg-white hover:text-[#111] hover:scale-105">
              Create Your Store
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}