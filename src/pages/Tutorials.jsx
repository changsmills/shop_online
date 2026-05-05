import { useState } from "react";
import * as LucideIcons from "lucide-react";

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>
        <LucideIcons.PlayCircle size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Video Tutorials
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', textAlign: 'center' }}>
        Tazama video fupi za jinsi ya kutumia Skyfall kupata bidhaa bora kwa bei ya jumla
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
        {tutorials.map((tutorial) => (
          <div 
            key={tutorial.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => setSelectedVideo(tutorial)}
          >
            <div style={{ position: 'relative', backgroundColor: '#f0f0f0', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LucideIcons.PlayCircle size={50} color="#ff6a00" style={{ opacity: 0.8 }} />
              <span style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                {tutorial.duration}
              </span>
            </div>
            <div style={{ padding: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{tutorial.title}</h3>
              <p style={{ fontSize: '13px', color: '#666' }}>{tutorial.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setSelectedVideo(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '90%',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '15px', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <LucideIcons.X size={24} />
              </button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#f0f0f0', padding: '60px 20px', borderRadius: '8px' }}>
                <LucideIcons.PlayCircle size={80} color="#ff6a00" />
                <p style={{ marginTop: '20px', color: '#666' }}>Video inaandaliwa ...</p>
                <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>Tazama mwongozo wa {selectedVideo.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}