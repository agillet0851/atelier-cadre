import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt, imageUrl, cadreStyle, format } = req.body;
  const prix = format === '21x30' ? 4900 : 6900;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Cadre Artisan (${cadreStyle}) - ${format}`,
            description: `Prompt IA : ${prompt}`,
            images: [imageUrl],
          },
          unit_amount: prix,
        },
        quantity: 1,
      }],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH'],
      },
      metadata: {
        prompt_client: prompt,
        image_hd_url: imageUrl,
        format_cadre: format,
        bois_cadre: cadreStyle,
      },
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}