import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const genererImage = async () => {
    if (!prompt.trim()) {
      alert('Veuillez décrire votre idée d\'illustration.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        setErrorMessage(data.message || 'La génération a échoué. Veuillez réessayer.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Une erreur de connexion au serveur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const payerCommande = async () => {
    if (!imageUrl) {
      alert('Veuillez générer une image avant d\'ajouter au panier.');
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageUrl,
          cadreStyle: 'noir_mat',
          format: 'A3_21x30',
          prix: 20
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de l\'accès au paiement Stripe.');
      }
    } catch (err) {
      alert('Erreur lors de la redirection vers le paiement.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      color: '#1a1a1a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px'
    }}>
      {/* EN-TÊTE SITE */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '8px' }}>
          L'Atelier du Cadre
        </h1>
        <p style={{ color: '#666', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          Créez une œuvre d'art unique par IA, encadrée sur-mesure dans nos ateliers
        </p>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main style={{
        maxWidth: '960px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>

        {/* APERÇU DU CADRE VERTICAL (Ratio 21 / 30) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '340px',
            aspectRatio: '21 / 30',
            backgroundColor: '#121212', // Cadre Noir Mat
            padding: '22px', // Passe-partout Blanc
            borderRadius: '4px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
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
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)'
            }}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Œuvre IA"
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '0.9rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎨</div>
                  Aperçu de votre création
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FORMULAIRE DE PERSONNALISATION */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
              1. Décrivez votre œuvre (IA)
            </label>
            <textarea
              rows="3"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Une promenade d'automne dans la ville de Reims, style peinture Ghibli..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
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
                backgroundColor: loading ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Génération en cours...' : '✨ Générer l\'aperçu'}
            </button>

            {errorMessage && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px' }}>
                ⚠️ {errorMessage}
              </p>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9' }} />

          <div>
            <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
              2. Finition du cadre
            </label>
            <select
              disabled
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '0.9rem',
                color: '#334155',
                cursor: 'not-allowed'
              }}
            >
              <option value="noir_mat">Noir Mat Premium</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
              3. Format du cadre
            </label>
            <select
              disabled
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '0.9rem',
                color: '#334155',
                cursor: 'not-allowed'
              }}
            >
              <option value="A3">Format A3 (21x30 cm) — 20 €</option>
            </select>
          </div>

          <button
            onClick={payerCommande}
            style={{
              marginTop: '10px',
              padding: '16px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🛒 Commander mon cadre — 20 €
          </button>
        </div>

      </main>
    </div>
  );
}
