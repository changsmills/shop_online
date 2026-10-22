import { useState } from "react";
import { PlayCircle, X } from "lucide-react";

export default function Tutorials() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const tutorials = [
    {
      id: 1,
      title: "Jinsi ya Kujiunga na Skyfall",
      duration: "3:45",
      description: "Jifunze jinsi ya kuunda akaunti na kuanza kununua",
      thumbnail: "https://img.youtube.com/vi/placeholder1/mqdefault.jpg"
    },
    {
      id: 2,
      title: "Jinsi ya Kutafuta na Kununua Bidhaa",
      duration: "5:20",
      description: "Mwongozo wa kutumia search na categories kupata bidhaa unazotaka",
      thumbnail: "https://img.youtube.com/vi/placeholder2/mqdefault.jpg"
    },
    {
      id: 3,
      title: "Kuelewa Bei za Jumla (Wholesale)",
      duration: "4:15",
      description: "Jinsi ya kupata bei nafuu unaponunua kwa wingi",
      thumbnail: "https://img.youtube.com/vi/placeholder3/mqdefault.jpg"
    },
    {
      id: 4,
      title: "Jinsi ya Kufuatilia Stendi Yako",
      duration: "3:30",
      description: "Kutumia namba za stendi kufuatilia usafirishaji",
      thumbnail: "https://img.youtube.com/vi/placeholder4/mqdefault.jpg"
    },
    {
      id: 5,
      title: "Kufungua Dispute na Kupata Refund",
      duration: "6:00",
      description: "Hatua za kuchukua ukipata bidhaa mbovu",
      thumbnail: "https://img.youtube.com/vi/placeholder5/mqdefault.jpg"
    },
    {
      id: 6,
      title: "Jinsi ya Kuuza kwenye Skyfall",
      duration: "8:30",
      description: "Mwongozo kwa wauzaji wanaotaka kuanza biashara",
      thumbnail: "https://img.youtube.com/vi/placeholder6/mqdefault.jpg"
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5 font-sans">
      
      <h1 className="text-[32px] font-bold mb-2.5 text-center text-gray-900 dark:text-white flex items-center justify-center gap-2.5">
        <PlayCircle size={28} className="text-[#ff6a00]" />
        Video Tutorials
      </h1>
      
      <p className="text-base text-gray-500 dark:text-gray-400 mb-10 text-center">
        Tazama video fupi za jinsi ya kutumia Skyfall kupata bidhaa bora kwa bei ya jumla
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[30px]">
        {tutorials.map((tutorial) => (
          <div 
            key={tutorial.id}
            className="bg-white dark:bg-[#111111] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
            onClick={() => setSelectedVideo(tutorial)}
          >
            {/* Thumbnail Area */}
            <div className="relative bg-gray-100 dark:bg-gray-800 h-[200px] flex items-center justify-center">
              <PlayCircle size={50} className="text-[#ff6a00] opacity-80" />
              <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
                {tutorial.duration}
              </span>
            </div>
            
            {/* Content Area */}
            <div className="p-4">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                {tutorial.title}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 m-0">
                {tutorial.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100000] flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="bg-white dark:bg-[#111111] rounded-xl max-w-[800px] w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white m-0">
                {selectedVideo.title}
              </h3>
              <button 
                onClick={() => setSelectedVideo(null)} 
                className="bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 py-[60px] px-5 rounded-lg flex flex-col items-center justify-center">
                <PlayCircle size={80} className="text-[#ff6a00]" />
                <p className="mt-5 text-gray-500 dark:text-gray-400 mb-0">
                  Video inaandaliwa ...
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2.5 mb-0">
                  Tazama mwongozo wa {selectedVideo.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}