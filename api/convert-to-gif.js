// api/convert-to-gif.js
// Micro-service pour convertir une image en GIF

import sharp from 'sharp';
import fetch from 'node-fetch';

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

    // Télécharger l'image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(400).json({ error: 'Failed to fetch image' });
    }
    
    const imageBuffer = await response.buffer();
    
    // Convertir en GIF animé simple
    // Créer plusieurs frames avec légère variation
    const frames = [];
    for (let i = 0; i < duration * 10; i++) {
      const frame = await sharp(imageBuffer)
        .resize(400, 400, { fit: 'inside' })
        .modulate({
          brightness: 1 + Math.sin(i * 0.2) * 0.1, // Léger effet de pulsation
        })
        .png()
        .toBuffer();
      
      frames.push(frame);
    }
    
    // Créer le GIF avec les frames
    const gif = await sharp(frames[0])
      .gif({
        delay: Array(frames.length).fill(100), // 100ms entre frames
        loop: 0 // Loop infini
      })
      .toBuffer();
    
    // Retourner le GIF
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', gif.length);
    res.end(gif);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
