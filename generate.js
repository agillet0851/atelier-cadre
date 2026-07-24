import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: `Style artistique tableau/illustration de haute qualité pour encadrement : ${prompt}`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la génération de l'image" });
  }
}