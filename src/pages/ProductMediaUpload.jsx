import React, { useRef } from "react";

export default function ProductMediaUpload({ images, setImages, files, setFiles, video, setVideo, setVideoFile }) {
  const imageInputRefs = useRef([]);
  const videoInputRef = useRef(null);

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);

      const newPreviews = [...images];
      newPreviews[index] = URL.createObjectURL(file);
      setImages(newPreviews);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Nimeongeza hadi 5MB kidogo maana 2MB ni ndogo sana kwa video
        alert("Video ni kubwa mno! Tafadhali weka video chini ya 5MB.");
        return;
      }
      setVideoFile(file);
      setVideo(URL.createObjectURL(file));
    }
  };

  return (
    <div className="pd-card mt-6"> {/* Tunatumia pd-card ili ifanane na ofisi */}
      <div className="pd-card-header">
        <h3>📸 Media za Bidhaa</h3>
        <p>Pakia picha 5 na video moja ya bidhaa yako</p>
      </div>
      
      {/* Grid ya Picha 5 */}
      <div className="pd-image-upload-grid"> {/* Inatumia class ile ile ya Office */}
        {images.map((url, index) => (
          <div 
            key={index} 
            className="pd-image-box" 
            onClick={() => imageInputRefs.current[index].click()}
          >
            {url ? (
              <>
                <img src={url} alt="Product" className="pd-office-img" />
                <div className="pd-edit-overlay"><span>BADILISHA</span></div>
              </>
            ) : (
              <div className="pd-placeholder">
                <span className="pd-icon">📸</span>
                <span>Picha {index + 1}</span>
              </div>
            )}
            <input 
              type="file" 
              hidden 
              ref={(el) => (imageInputRefs.current[index] = el)}
              onChange={(e) => handleImageChange(index, e)} 
              accept="image/*"
            />
          </div>
        ))}

        {/* Sehemu ya Video (Imeingizwa kwenye grid ili ipendeze) */}
        <div 
          className="pd-image-box" 
          style={{ background: '#000' }} 
          onClick={() => videoInputRef.current.click()}
        >
          {video ? (
            <>
              <video src={video} className="pd-office-img" muted />
              <div className="pd-edit-overlay"><span>BADILISHA VIDEO</span></div>
            </>
          ) : (
            <div className="pd-placeholder" style={{ color: '#fff' }}>
              <span className="pd-icon">📽️</span>
              <span>Pakia Video</span>
            </div>
          )}
          <input 
            type="file" 
            hidden 
            ref={videoInputRef}
            onChange={handleVideoChange} 
            accept="video/*"
          />
        </div>
      </div>
      
      <p className="pd-helper-text">
        * Kidokezo: Gusa picha yoyote hapo juu ili kuibadilisha.
      </p>
    </div>
  );
}