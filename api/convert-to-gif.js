// api/convert-to-video.js - Convertir image en vidéo

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { imageUrl, duration = 5 } = req.method === 'POST' ? req.body : req.query;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl parameter is required' });
    }

    console.log('🎬 Converting image to video:', imageUrl);

    // Télécharger l'image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    console.log('✅ Image downloaded, size:', imageBuffer.byteLength);
    
    // Créer une vidéo MP4 basique de quelques secondes avec l'image
    // Pour l'instant, on utilise un placeholder vidéo
    const videoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4';
    
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.status}`);
    }
    
    const videoBuffer = await videoResponse.arrayBuffer();
    const uint8Array = new Uint8Array(videoBuffer);
    
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.setHeader('Content-Length', uint8Array.length);
    res.status(200).end(Buffer.from(uint8Array));
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
