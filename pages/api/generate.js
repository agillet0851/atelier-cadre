import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Le prompt est requis." });
  }

  try {
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return res.status(500).json({ 
      message: "Erreur lors de la génération d'image", 
      details: error.message || "Erreur inconnue" 
    });
  }
}
