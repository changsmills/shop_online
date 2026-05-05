import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function Blogs() {
  const articles = [
    { id: 1, title: "Jinsi ya Kuanza Biashara ya Jumla Tanzania", date: "Jan 15, 2026", readTime: "5 min", excerpt: "Mwongozo kamili kwa wajasiriamali wanaotaka kuingia kwenye biashara ya jumla." },
    { id: 2, title: "Vidokezo vya Kununua Bidhaa kutoka China", date: "Jan 10, 2026", readTime: "7 min", excerpt: "Jinsi ya kupata bidhaa bora kwa bei nzuri kutoka China." },
    { id: 3, title: "Jinsi ya Kuepuka Matapeli kwenye Biashara Online", date: "Jan 5, 2026", readTime: "4 min", excerpt: "Tahadhari za kuchukua unapofanya biashara mtandaoni." },
    { id: 4, title: "Faida za Kuwa na Logistics Partner", date: "Dec 28, 2025", readTime: "6 min", excerpt: "Kwa nini usafirishaji ni muhimu kwa biashara yako." }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
        <LucideIcons.BookOpen size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Makala za Biashara
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
        Soma makala muhimu kwa biashara yako
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {articles.map(article => (
          <div key={article.id} style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              <Link to={`/blog/${article.id}`} style={{ textDecoration: 'none', color: '#111' }}>{article.title}</Link>
            </h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', fontSize: '13px', color: '#888' }}>
              <span><LucideIcons.Calendar size={14} style={{ marginRight: '5px' }} /> {article.date}</span>
              <span><LucideIcons.Clock size={14} style={{ marginRight: '5px' }} /> {article.readTime}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#666' }}>{article.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}