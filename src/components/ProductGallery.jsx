import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import '../ProductGallery.css';

const ProductGallery = ({ product }) => { // 🔥 IMEBADILISHWA: isMobile imeondolewa
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
  
 // ========== PREPARE MEDIA LIST (FIRST!) ==========
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
  
  // ========== VIDEO DATA ==========
  const videoItem = mediaList.find(item => item.type === 'video');
  const photoItems = mediaList.filter(item => item.type !== 'video');
  
  // ========== RESET MEDIA TYPE ==========
  useEffect(() => {
    // 🔥 IMEBADILISHWA: Mobile detection sasa inafanywa kwa CSS (Media Query), 
    // lakini bado tunahitaji logic hii kwa media type logic kwa mobile.
    // Tutachukulia kuwa ni mobile kwa kupitia window width (badala ya prop).
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

  // ========== MOUSE ZOOM HANDLERS (Desktop) ==========
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    setBgPos(`${clampedX}% ${clampedY}%`);
  };

  // ========== ZOOM TOUCH HANDLERS (KWA MOBILE) ==========
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
    setIsZooming(false); // Zoom inatoweka mkono ukiondolewa
  };

  if (!product || mediaList.length === 0) {
    return <div className="loading">Inapakia...</div>;
  }

  const currentPhoto = photoItems[photoIndex];
  const currentMedia = mediaList[currentIndex];
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // ========== MOBILE VIEW (VIDEO/PHOTO TOGGLE) - HII CLASS ITACHUKUA CSS ==========
  return (
    <>
      {/* ===== DESKTOP VIEW (Media Query inaficha kwenye Mobile) ===== */}
      <div className="gallery-main-container">
        <div className="gallery-wrapper">
          
          {/* Thumbnails - Vertical on desktop */}
          <div className="thumbnails-container">
            <button className="nav-btn prev" onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : mediaList.length - 1))}>
              ^
            </button>

            <div className="thumbnails-list">
              {mediaList.map((item, i) => (
                <div 
                  key={i} 
                  className={`thumb-item ${currentIndex === i ? 'active' : ''}`} 
                  onMouseEnter={() => setCurrentIndex(i)}
                >
                  {item.type === 'video' && <div className="video-badge">▶️</div>}
                  <img src={item.type === 'video' ? `${item.url}#t=0.5` : item.url} alt={`Thumbnail ${i}`} />
                </div>
              ))}
            </div>

            <button className="nav-btn next" onClick={() => setCurrentIndex(prev => (prev < mediaList.length - 1 ? prev + 1 : 0))}>
              ^
            </button>
          </div>

          {/* Main Stage */}
          <div className="main-stage-container">
            <div className="main-stage">
              <div className="main-display">
                {currentMedia?.type === 'video' ? (
                  <video 
                    key={currentMedia.url} 
                    src={currentMedia.url} 
                    controls 
                    autoPlay 
                    muted 
                    className="base-image"
                  />
                ) : (
                  <div 
                    className="zoom-container"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <img src={currentMedia?.url} alt={product.name} className="base-image" />
                    {isZooming && (
                      <div className="zoom-result" style={{ backgroundImage: `url(${currentMedia?.url})`, backgroundPosition: bgPos }} />
                    )}
                  </div>
                )}
              </div>
              
              <div className="action-icons-overlay">
                <button className="icon-btn" onClick={() => setIsModalOpen(true)}>
                  <Maximize2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Full List View */}
        <div className="kbc-full-view-list">
          {mediaList.map((item, idx) => (
            <div key={idx} className="kbc-full-view-item">
              {item.type === 'video' ? (
                <video src={item.url} controls className="kbc-full-view-media" muted />
              ) : (
                <img src={item.url} alt={`Product detail ${idx}`} className="kbc-full-view-media" />
              )}
            </div>
          ))}
        </div>

        {/* Lightbox Modal - Desktop */}
        {isModalOpen && createPortal(
          <div className="lightbox-overlay" onClick={() => setIsModalOpen(false)}>
            <button className="close-lightbox" onClick={() => setIsModalOpen(false)}>
              <X size={35} color="#0c0b0b" />
            </button>

            <button className="modal-nav-btn prev" onClick={prevImage} />
            <button className="modal-nav-btn next" onClick={nextImage} />

            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <div className="lightbox-main-view">
                {currentMedia?.type === 'video' ? (
                  <video key={currentMedia.url} src={currentMedia.url} controls autoPlay className="modal-base-img" />
                ) : (
                  <div className="modal-zoom-wrapper" 
                       onMouseMove={handleMouseMove}
                       onMouseEnter={() => setIsZooming(true)} 
                       onMouseLeave={() => setIsZooming(false)}
                       onTouchMove={handleTouchMove}      /* 🔥 IMEONGEWA KWA MOBILE ZOOM */
                       onTouchStart={handleTouchMove}     /* 🔥 IMEONGEWA KWA MOBILE ZOOM */
                       onTouchEnd={handleTouchEnd}        /* 🔥 IMEONGEWA KWA MOBILE ZOOM */
                  >
                    <img key={currentMedia?.url} src={currentMedia?.url} alt="View" className="modal-base-img" />
                    {isZooming && (
                      <div className="modal-zoom-overlay" style={{
                        backgroundImage: `url(${currentMedia?.url})`, backgroundPosition: bgPos,
                        backgroundSize: '250%', pointerEvents: 'none'
                      }} />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer-caption">
              <div className="counter">{currentIndex + 1} / {mediaList.length}</div>
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* ===== MOBILE VIEW (Imehamishiwa kwenye CSS) ===== */}
      <div className="gallery-mobile-simple">
        <div className="mobile-main-display">
          {/* VIDEO MODE */}
          {mediaType === 'video' && videoItem && (
            <div className="mobile-video-wrapper">
              <video
                ref={videoRef}
                src={videoItem.url}
                className="mobile-video"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                playsInline
              />
              
              <div className="video-controls-overlay">
                <div className="video-progress-row">
                  <span className="time-text">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={handleSeek}
                    className="video-progress-bar"
                  />
                  <span className="time-text">{formatTime(duration)}</span>
                </div>
                
                <div className="video-control-buttons">
                  <button onClick={handlePlayPause} className="control-btn">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={handleMute} className="control-btn">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <button onClick={handleFullscreen} className="control-btn ml-auto">
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PHOTO MODE */}
          {mediaType === 'photos' && currentPhoto && (
            <>
              <img 
                src={currentPhoto.url} 
                alt={product.name} 
                className="mobile-image"
                onClick={() => setIsModalOpen(true)}
              />
              
              {photoItems.length > 1 && (
                <>
                  <button className="mobile-nav-arrow prev" onClick={prevImage}>
                    <ChevronLeft size={20} />
                  </button>
                  <button className="mobile-nav-arrow next" onClick={nextImage}>
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              <div className="mobile-counter">
                {photoIndex + 1} / {photoItems.length}
              </div>
            </>
          )}
        </div>

        {videoItem && (
          <div className="mobile-toggle-buttons">
            <button
              onClick={() => setMediaType('video')}
              className={mediaType === 'video' ? 'active' : ''}
            >
              🎬 Video
            </button>
            <button
              onClick={() => setMediaType('photos')}
              className={mediaType === 'photos' ? 'active' : ''}
            >
              📷 Photos ({photoItems.length})
            </button>
          </div>
        )}

        <div className="product-long-description">
          {mediaList.map((item, idx) => (
            <div key={idx} className="product-long-desc-item">
              {item.type === 'video' ? (
                <video src={item.url} controls className="long-desc-media" />
              ) : (
                <img src={item.url} alt={`Product detail ${idx}`} className="long-desc-media" />
              )}
            </div>
          ))}
          <div className="long-desc-footer">
            {/* Kitufe cha View More kinaweza kuwekwa hapa kama class */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductGallery;