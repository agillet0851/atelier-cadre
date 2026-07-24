import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const genererImage = async () => {
    if (!prompt) return alert('Veuillez décrire votre idée d\'illustration.');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();

      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert('Erreur : ' + (data.message || 'L\'image n\'a pas pu être générée.'));
      }
    } catch (err) {
      alert('Une erreur est survenue lors de la connexion.');
    }
    setLoading(false);
  };

  const payerCommande = async () => {
    if (!imageUrl) return alert('Veuillez d\'abord générer votre visuel.');
    
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, imageUrl, cadreStyle: 'noir', format: 'A3' }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fcfcfc', 
      color: '#1a1a1a', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px' 
    }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '600', letterSpacing: '-0.5px', marginBottom: '8px' }}>
          L'Atelier du Cadre
        </h1>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>
          Créez une œuvre unique par IA, encadrée sur-mesure dans nos ateliers
        </p>
      </header>
      
      <main style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '50px',
        alignItems: 'start'
      }}>
        
        {/* APERÇU DU CADRE VERTICAL (Ratio 21/30) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '360px',
            aspectRatio: '21 / 30',
            backgroundColor: '#111111', // Cadre Noir Mat
            padding: '24px', // Passe-partout blanc
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box',
            display: 'flex'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.08)'
            }}>
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Œuvre IA" 
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.85rem' }}>
                  <p style={{ marginBottom: '8px', fontSize: '1.5rem' }}>🖼️</p>
                  Aperçu de votre création
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FORMULAIRE DE PERSONNALISATION */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '32px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #eaeaea',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px' 
        }}>
          <div>
            <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
              1. Décrivez votre œuvre (IA)
            </label>
            <textarea 
              rows="3" 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              placeholder="Ex: Une promenade d'automne dans le vignoble champenois, style peinture impressionniste..." 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button 
              onClick={genererImage} 
              disabled={loading} 
              style={{ 
                marginTop: '10px',
                width: '100%',
                padding: '12px', 
                backgroundColor: loading ? '#ccc' : '#111', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px',
                fontSize: '0.9rem', 
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Génération par l\'IA...' : '✨ Générer l\'aperçu'}
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }} />

          <div>
            <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
              2. Finition du cadre
            </label>
            <select 
              disabled 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#f8f8f8',
                fontSize: '0.9rem',
                color: '#333'
              }}
            >
              <option value="noir">Noir Mat Premium</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
              3. Format du cadre
            </label>
            <select 
              disabled
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#f8f8f8',
                fontSize: '0.9rem',
                color: '#333'
              }}
            >
              <option value="A3">A3 (21x30 cm) — 20 €</option>
            </select>
          </div>

          <button 
            onClick={payerCommande} 
            style={{ 
              marginTop: '10px',
              padding: '16px', 
              backgroundColor: '#111', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '0.95rem', 
              fontWeight: '600', 
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🛒 Commander mon cadre — 20 €
          </button>
        </div>

      </main>
    </div>
  );
}
