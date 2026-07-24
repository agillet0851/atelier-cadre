import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 1. Accepter uniquement POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    // 2. Traitement sécurisé du corps de la requête
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const prompt = body?.prompt;

    if (!prompt) {
      return res.status(400).json({ message: "Le prompt est requis." });
    }

    console.log("--> Tentative de génération DALL-E 3 avec le prompt :", prompt);

    // 3. Appel à OpenAI
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    console.log("--> Image générée avec succès !");

    return res.status(200).json({ url: imageUrl });

  } catch (error) {
    console.error("--> Erreur détaillée lors de la génération :", error);
    return res.status(500).json({ 
      message: "Erreur lors de la génération d'image", 
      error: error.message 
    });
  }
}
