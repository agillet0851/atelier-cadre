import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Seules les requêtes POST sont autorisées
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    // Extraction sécurisée du prompt
    let prompt = "";
    if (typeof req.body === "string") {
      try {
        const parsed = JSON.parse(req.body);
        prompt = parsed.prompt;
      } catch (e) {
        prompt = "";
      }
    } else if (req.body && typeof req.body === "object") {
      prompt = req.body.prompt;
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ message: "Le texte de description est requis." });
    }

    // Appel à l'API OpenAI au format vertical portrait (1024x1792)
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt.trim(),
      n: 1,
      size: "1024x1792",
    });

    const item = response.data?.[0];
    let imageUrl = item?.url;

    // Conversion de secours si l'API renvoie du base64 au lieu d'une URL
    if (!imageUrl && item?.b64_json) {
      imageUrl = `data:image/png;base64,${item.b64_json}`;
    }

    if (!imageUrl) {
      return res.status(500).json({ message: "Aucune image n'a pu être générée par l'IA." });
    }

    return res.status(200).json({ url: imageUrl });

  } catch (error) {
    console.error("Erreur backend OpenAI :", error);
    return res.status(500).json({
      message: "Erreur lors de la génération d'image.",
      error: error.message || "Erreur serveur inconnue",
    });
  }
}
