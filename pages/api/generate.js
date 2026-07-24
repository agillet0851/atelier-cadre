import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const prompt = body?.prompt;

    if (!prompt) {
      return res.status(400).json({ message: "Le prompt est requis." });
    }

    // Génération au format portrait (1024x1792)
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1792", 
    });

    const item = response.data?.[0];
    let imageUrl = item?.url;

    if (!imageUrl && item?.b64_json) {
      imageUrl = `data:image/png;base64,${item.b64_json}`;
    }

    if (!imageUrl) {
      throw new Error("L'API OpenAI n'a renvoyé aucun lien d'image valide.");
    }

    return res.status(200).json({ url: imageUrl });

  } catch (error) {
    console.error("Erreur lors de la génération :", error);
    return res.status(500).json({
      message: "Erreur lors de la génération d'image",
      error: error.message,
    });
  }
}
