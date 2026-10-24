// src/components/ProductGallery.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

const ProductGallery = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgPos, setBgPos] = useState('0% 0%');
  const [isZooming, setIsZooming] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ========== STATE ZA VIDEO PLAYER ==========
  const [mediaType, setMediaType] = useState('photos');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const videoRef = useRef(null);
  
 // ========== PREPARE MEDIA LIST ==========
  const mediaList = React.useMemo(() => {
    if (!product?.media_list) return [];
    return [...product.media_list]
      .filter(item => item?.url)
      .sort((a, b) => {
        if (a.type === 'video') return 1;
        if (b.type === 'video') return -1;
        return (a.display_order || 0) - (b.display_order || 0);
      });
  }, [product?.media_list]);
  
  const videoItem = mediaList.find(item => item.type === 'video');
  const photoItems = mediaList.filter(item => item.type !== 'video');
  
  // ========== RESET MEDIA TYPE ==========
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      if (videoItem) {
        setMediaType('video');
      } else {
        setMediaType('photos');
      }
    }
    setPhotoIndex(0);
  }, [product?.id, videoItem]);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    if (mediaType === 'photos' && photoItems.length > 0) {
      setPhotoIndex((prev) => (prev + 1) % photoItems.length);
    }
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    if (mediaType === 'photos' && photoItems.length > 0) {
      setPhotoIndex((prev) => (prev - 1 + photoItems.length) % photoItems.length);
    }
  };

  // ========== VIDEO PLAYER HANDLERS ==========
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  // ========== MOUSE ZOOM HANDLERS ==========
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    setBgPos(`${clampedX}% ${clampedY}%`);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - left) / width) * 100;
    const y = ((touch.clientY - top) / height) * 100;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    setBgPos(`${clampedX}% ${clampedY}%`);
    setIsZooming(true);
  };

  const handleTouchEnd = () => {
    setIsZooming(false);
  };

  if (!product || mediaList.length === 0) {
    return <div className="p-10 text-center text-gray-500">Inapakia...</div>;
  }

  const currentPhoto = photoItems[photoIndex];
  const currentMedia = mediaList[currentIndex];
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* ===== DESKTOP VIEW ===== */}
      <div className="hidden md:block max-w-[1200px] mx-auto p-5 bg-white dark:bg-black font-sans">
        <div className="flex gap-5 mb-10 items-start">
          
          {/* Thumbnails */}
          <div className="w-[80px] shrink-0">
            <div className="flex flex-col gap-3">
              {mediaList.map((item, i) => (
                <div 
                  key={i} 
                  className={`w-[70px] h-[70px] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${currentIndex === i ? 'border-brand-orange scale-105 shadow-md' : 'border-gray-200 hover:border-brand-orange'}`}
                  onMouseEnter={() => setCurrentIndex(i)}
                >
                  {item.type === 'video' && <div className="absolute z-10 bg-black/50 text-white p-1 rounded">▶️</div>}
                  <img src={item.type === 'video' ? `${item.url}#t=0.5` : item.url} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Stage */}
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 h-[550px] bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center relative cursor-zoom-in">
                {currentMedia?.type === 'video' ? (
                  <video key={currentMedia.url} src={currentMedia.url} controls autoPlay muted className="max-w-full max-h-full object-contain" />
                ) : (
                  <div 
                    className="w-full h-full relative"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <img src={currentMedia?.url} alt={product.name} className="w-full h-full object-contain" />
                    {isZooming && (
                      <div 
                        className="absolute inset-0 bg-no-repeat bg-[length:250%] pointer-events-none z-10"
                        style={{ backgroundImage: `url(${currentMedia?.url})`, backgroundPosition: bgPos }}
                      />
                    )}
                  </div>
                )}
              </div>
              <button className="absolute top-4 right-4 bg-white dark:bg-black p-2 rounded-full shadow-md hover:bg-brand-orange hover:text-white transition-colors" onClick={() => setIsModalOpen(true)}>
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Full List View */}
        <div className="flex flex-col w-full bg-white dark:bg-black">
          {mediaList.map((item, idx) => (
            <div key={idx} className="w-full border-b border-gray-200 dark:border-gray-800">
              {item.type === 'video' ? (
                <video src={item.url} controls className="w-full h-auto object-contain" muted />
              ) : (
                <img src={item.url} alt={`Detail ${idx}`} className="w-full h-auto object-contain" />
              )}
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {isModalOpen && createPortal(
          <div className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <button className="absolute top-5 right-5 bg-white/20 text-white p-2 rounded-full hover:bg-brand-orange transition-colors z-20" onClick={() => setIsModalOpen(false)}>
              <X size={35} />
            </button>
            <button className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-brand-orange transition-colors z-20" onClick={prevImage}><ChevronLeft size={30} /></button>
            <button className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-brand-orange transition-colors z-20" onClick={nextImage}><ChevronRight size={30} /></button>

            <div className="w-full max-w-[1200px] h-[85vh] bg-black border border-gray-800 rounded-xl overflow-hidden relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {currentMedia?.type === 'video' ? (
                <video key={currentMedia.url} src={currentMedia.url} controls autoPlay className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="w-full h-full p-5 flex items-center justify-center relative cursor-crosshair" 
                  onMouseMove={handleMouseMove} onMouseEnter={() => setIsZooming(true)} onMouseLeave={() => setIsZooming(false)}
                  onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} onTouchEnd={handleTouchEnd}
                >
                  <img key={currentMedia?.url} src={currentMedia?.url} alt="View" className="max-w-full max-h-full object-contain" />
                  {isZooming && (
                    <div className="absolute inset-0 bg-no-repeat bg-[length:250%] pointer-events-none" style={{ backgroundImage: `url(${currentMedia?.url})`, backgroundPosition: bgPos }} />
                  )}
                </div>
              )}
            </div>
            <div className="absolute bottom-5 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm">
              {currentIndex + 1} / {mediaList.length}
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* ===== MOBILE VIEW ===== */}
      <div className="block md:hidden w-full bg-black rounded-none overflow-hidden font-sans">
        <div className="relative w-full bg-black flex items-center justify-center min-h-[350px]">
          {mediaType === 'video' && videoItem && (
            <div className="relative w-full">
              <video ref={videoRef} src={videoItem.url} className="w-full h-auto max-h-[400px] object-contain" onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleTimeUpdate} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} playsInline />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs">{formatTime(currentTime)}</span>
                  <input type="range" min="0" max="100" value={progressPercent} onChange={handleSeek} className="flex-1 h-1 rounded bg-gray-500 accent-brand-orange" />
                  <span className="text-white text-xs">{formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handlePlayPause} className="text-white">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button onClick={handleMute} className="text-white">{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
                  <button onClick={handleFullscreen} className="text-white ml-auto"><Maximize size={18} /></button>
                </div>
              </div>
            </div>
          )}

          {mediaType === 'photos' && currentPhoto && (
            <>
              <img src={currentPhoto.url} alt={product.name} className="w-full h-auto max-h-[400px] object-contain block" onClick={() => setIsModalOpen(true)} onContextMenu={(e) => e.preventDefault()} />
              {photoItems.length > 1 && (
                <>
                  <button className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full" onClick={prevImage}><ChevronLeft size={20} /></button>
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full" onClick={nextImage}><ChevronRight size={20} /></button>
                </>
              )}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                {photoIndex + 1} / {photoItems.length}
              </div>
            </>
          )}
        </div>

        {videoItem && (
          <div className="flex gap-3 mt-3 justify-center">
            <button onClick={() => setMediaType('video')} className={`px-5 py-2 rounded-full border-none font-bold text-sm cursor-pointer transition-all ${mediaType === 'video' ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>🎬 Video</button>
            <button onClick={() => setMediaType('photos')} className={`px-5 py-2 rounded-full border-none font-bold text-sm cursor-pointer transition-all ${mediaType === 'photos' ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>📷 Photos ({photoItems.length})</button>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-0 w-full p-0">
          {mediaList.map((item, idx) => (
            <div key={idx} className="w-full bg-transparent relative overflow-hidden m-0 p-0">
              {item.type === 'video' ? (
                <video src={item.url} controls className="w-full h-auto block object-contain" />
              ) : (
                <img src={item.url} alt={`Detail ${idx}`} className="w-full h-auto block object-contain" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Lightbox Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/98 z-[10000] flex items-center justify-center p-0" onClick={() => setIsModalOpen(false)}>
          <button className="fixed top-4 right-4 bg-white/15 text-white p-2 rounded-full z-[10001]" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
          <button className="fixed left-3 top-1/2 -translate-y-1/2 bg-white/15 text-white p-2.5 rounded-full z-[10001]" onClick={prevImage}><ChevronLeft size={24} /></button>
          <button className="fixed right-3 top-1/2 -translate-y-1/2 bg-white/15 text-white p-2.5 rounded-full z-[10001]" onClick={nextImage}><ChevronRight size={24} /></button>
          
          <div className="w-screen h-screen flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
            {currentMedia?.type === 'video' ? (
              <video key={currentMedia.url} src={currentMedia.url} controls autoPlay className="max-w-full max-h-full object-contain" />
            ) : (
              <img key={currentMedia?.url} src={currentMedia?.url} alt="View" className="max-w-full max-h-full object-contain" />
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ProductGallery;