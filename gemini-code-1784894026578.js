import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [cadreStyle, setCadreStyle] = useState('chene');
  const [format, setFormat] = useState('21x30');

  const genererImage = async () => {
    if (!prompt) return alert('Veuillez décrire votre souvenir ou idée.');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
      else alert('Erreur de génération');
    } catch (err) {
      alert('Une erreur est survenue');
    }
    setLoading(false);
  };

  const payerCommande = async () => {
    if (!imageUrl) return alert('Veuillez d\'abord générer votre visuel.');
    
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, imageUrl, cadreStyle, format }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h1>🛠️ L'Atelier du Cadre Sur-Mesure</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* APERÇU LE CADRE */}
        <div style={{
          border: cadreStyle === 'chene' ? '20px solid #a27045' : cadreStyle === 'noir' ? '20px solid #1a1a1a' : '20px solid #f0f0f0',
          padding: '15px', background: '#fff', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
          {imageUrl ? (
            <img src={imageUrl} alt="Œuvre IA" style={{ width: '100%', height: 'auto' }} />
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>
              Aperçu de votre créa ici
            </div>
          )}
        </div>

        {/* FORMULAIRE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>1. Décrivez votre image (IA) :</label>
          <textarea 
            rows="3" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            placeholder="Ex: Un souvenir de mariage à la plage au coucher du soleil, style peinture à l'huile..." 
          />
          <button onClick={genererImage} disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
            {loading ? 'Création par l\'IA en cours...' : '✨ Générer l\'aperçu'}
          </button>

          <label>2. Choisissez la finition du bois :</label>
          <select value={cadreStyle} onChange={(e) => setCadreStyle(e.target.value)}>
            <option value="chene">Chêne Brut Artisan</option>
            <option value="noir">Bois Noir Mat</option>
            <option value="blanc">Bois Blanc Scandi</option>
          </select>

          <label>3. Format du cadre :</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="21x30">A4 (21x30 cm) - 49 €</option>
            <option value="30x40">30x40 cm - 69 €</option>
          </select>

          <button onClick={payerCommande} style={{ padding: '15px', background: '#b5835a', color: '#fff', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
            🛒 Commander mon cadre fait main
          </button>
        </div>
      </div>
    </div>
  );
}