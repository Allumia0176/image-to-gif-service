// api/convert-to-gif.js - Version simplifiée qui fonctionne

export default async function handler(req, res) {
  // Cors headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { imageUrl, duration = 3 } = req.method === 'POST' ? req.body : req.query;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl parameter is required' });
    }

    // Importer dynamiquement les modules
    const fetch = (await import('node-fetch')).default;
    const sharp = (await import('sharp')).default;

    // Télécharger l'image
    console.log('Fetching image:', imageUrl);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const imageBuffer = await response.buffer();
    console.log('Image downloaded, size:', imageBuffer.length);
    
    // Convertir en GIF simple (sans animation complexe pour éviter les erreurs)
    const gif = await sharp(imageBuffer)
      .resize(400, 400, { fit: 'inside' })
      .gif()
      .toBuffer();
    
    console.log('GIF created, size:', gif.length);
    
    // Retourner le GIF
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', gif.length);
    res.status(200).end(gif);
    
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
