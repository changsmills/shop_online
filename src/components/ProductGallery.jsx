import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import '../ProductGallery.css';

const ProductGallery = ({ product, isMobile = false }) => {
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
  
  // ========== VIDEO DATA (Now after mediaList is defined) ==========
  const videoItem = mediaList.find(item => item.type === 'video');
  const photoItems = mediaList.filter(item => item.type !== 'video');
  
  // ========== RESET MEDIA TYPE WAKATI BIDHAA INABADILIKA ==========
  useEffect(() => {
    if (isMobile) {
      if (videoItem) {
        setMediaType('video');
      } else {
        setMediaType('photos');
      }
    }
    setPhotoIndex(0);
  }, [product?.id, videoItem, isMobile]);

  const nextImage = (e) => {
    e?.stopPropagation();
    // Badilisha currentIndex badala ya photoIndex ili iathiri Modal na Desktop
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    
    // Kama unataka kuendelea kutumia photoIndex kwenye mobile view:
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

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    setBgPos(`${clampedX}% ${clampedY}%`);
  };

  if (!product || mediaList.length === 0) {
    return <div className="loading">Inapakia...</div>;
  }

  const currentPhoto = photoItems[photoIndex];
  const currentMedia = mediaList[currentIndex];
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

{/* ========== MOBILE VIEW (VIDEO/PHOTO TOGGLE) ========== */}
if (isMobile) {
  return (
    <div className="gallery-mobile-simple">

      {/* Main Display */}
      <div className="mobile-main-display" style={{ position: 'relative', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* VIDEO MODE */}
        {mediaType === 'video' && videoItem && (
          <div style={{ position: 'relative', width: '100%' }}>
            <video
              ref={videoRef}
              src={videoItem.url}
              className="mobile-video"
              style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              playsInline
            />
            
            {/* Video Controls Overlay */}
            <div className="video-controls-overlay" style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Progress Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'white', fontSize: '11px' }}>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercent}
                  onChange={handleSeek}
                  style={{
                    flex: 1,
                    height: '3px',
                    borderRadius: '3px',
                    background: `linear-gradient(to right, #ff6600 ${progressPercent}%, #555 ${progressPercent}%)`,
                    WebkitAppearance: 'none'
                  }}
                />
                <span style={{ color: 'white', fontSize: '11px' }}>{formatTime(duration)}</span>
              </div>
              
              {/* Control Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={handlePlayPause} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={handleMute} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={handleFullscreen} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto' }}>
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
              style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', cursor: 'pointer' }}
              onClick={() => setIsModalOpen(true)}
            />
            
            {/* Navigation Arrows for Photos */}
            {photoItems.length > 1 && (
              <>
                <button 
                  className="mobile-nav-arrow prev"
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  className="mobile-nav-arrow next"
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {/* Photo Counter */}
            {photoItems.length > 1 && (
              <div className="mobile-counter" style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '20px',
                fontSize: '12px',
                zIndex: 10
              }}>
                {photoIndex + 1} / {photoItems.length}
              </div>
            )}
          </>
        )}
      </div>

       {/* Toggle Buttons - Video / Photos */}
      {videoItem && (
        <div className="mobile-toggle-buttons" style={{
          display: 'flex',
          gap: '12px',
          marginTop: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setMediaType('video')}
            style={{
              padding: '8px 20px',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: mediaType === 'video' ? '#ff6600' : '#f0f0f0',
              color: mediaType === 'video' ? 'white' : '#666',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🎬 Video
          </button>
          <button
            onClick={() => setMediaType('photos')}
            style={{
              padding: '8px 20px',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: mediaType === 'photos' ? '#ff6600' : '#f0f0f0',
              color: mediaType === 'photos' ? 'white' : '#666',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            📷 Photos ({photoItems.length})
          </button>
        </div>
      )}

    {/* ========== SEHEMU YA MAELEZO YA BIDHAA (FULL WIDTH IMAGES) ========== */}
<div className="product-long-description" style={{ 
  marginTop: '20px', 
  display: 'flex', 
  flexDirection: 'column', // Inapanga picha mmoja baada ya mwingine kwenda chini
  gap: '0px', // Inaondoa nafasi kati ya picha ili zigandane kama Alibaba
  width: '100%' 
}}>
  {mediaList.map((item, idx) => (
    <div 
      key={idx} 
      style={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {item.type === 'video' ? (
        <div style={{ width: '100%', position: 'relative' }}>
          <video 
            src={item.url} 
            controls // Kwenye full view ni vizuri mteja aweza ku-play
            style={{ 
              width: '100%', 
              height: 'auto', 
              display: 'block' 
            }} 
          />
        </div>
      ) : (
        <img 
          src={item.url} 
          alt={`Product detail ${idx}`} 
          style={{ 
            width: '100%', 
            height: 'auto', // Inahakikisha picha haipotezi umbo lake (no distortion)
            display: 'block', // Inaondoa lile pengo dogo la pixel chini ya picha
            objectFit: 'contain'
          }} 
        />
      )}
    </div>
  ))}

  {/* Kitufe cha View More - Kinaonekana chini ya picha zote */}
  <div style={{ 
    textAlign: 'center', 
    padding: '30px 0', 
    backgroundColor: '#fff' 
  }}>
  </div>
</div>
    </div>
  );
}

  // ========== DESKTOP FULL VIEW ==========
  return (
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
                  style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
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

          <button className="modal-nav-btn prev" onClick={prevImage} style={{
            position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)',
            backgroundColor: 'white', border: 'none', width: '50px', height: '50px',
            borderRadius: '50%', cursor: 'pointer', zIndex: 100000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <ChevronLeft size={40} />
          </button>

          <button className="modal-nav-btn next" onClick={nextImage} style={{
            position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)',
            backgroundColor: 'white', border: 'none', width: '50px', height: '50px',
            borderRadius: '50%', cursor: 'pointer', zIndex: 100000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <ChevronRight size={40} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-main-view">
              {currentMedia?.type === 'video' ? (
                <video key={currentMedia.url} src={currentMedia.url} controls autoPlay className="modal-base-img" />
              ) : (
                <div className="modal-zoom-wrapper" onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZooming(true)} onMouseLeave={() => setIsZooming(false)}
                  style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <img key={currentMedia?.url} src={currentMedia?.url} alt="View" className="modal-base-img"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: 'scale(1.05)' }} />
                  {isZooming && (
                    <div className="modal-zoom-overlay" style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
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
  );
};

export default ProductGallery;