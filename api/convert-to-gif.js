// api/convert-to-gif.js - Créer un GIF coloré visible

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { imageUrl } = req.method === 'POST' ? req.body : req.query;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl parameter is required' });
    }

    // Créer un GIF coloré de 400x400 pixels (rouge uni pour test)
    const width = 400;
    const height = 400;
    
    // Header GIF
    const header = Buffer.from([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // "GIF89a"
      width & 0xFF, (width >> 8) & 0xFF,   // width
      height & 0xFF, (height >> 8) & 0xFF, // height
      0x80, 0x00, 0x00, // packed field, background, aspect ratio
    ]);
    
    // Table de couleurs (rouge)
    const colorTable = Buffer.from([
      0xFF, 0x00, 0x00, // Rouge
      0x00, 0x00, 0x00, // Noir (remplissage)
    ]);
    
    // Image descriptor
    const imageDesc = Buffer.from([
      0x2C, 0x00, 0x00, 0x00, 0x00, // separator + position
      width & 0xFF, (width >> 8) & 0xFF,   // width
      height & 0xFF, (height >> 8) & 0xFF, // height
      0x00, // packed field
    ]);
    
    // Données image simple (carré rouge)
    const imageData = Buffer.from([
      0x02, // LZW minimum code size
      0x04, // block size
      0x01, 0x01, 0x01, 0x01, // data (tous pixels rouges)
      0x00, // block terminator
    ]);
    
    // Trailer
    const trailer = Buffer.from([0x3B]);
    
    // Assembler le GIF
    const gifBuffer = Buffer.concat([header, colorTable, imageDesc, imageData, trailer]);
    
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Disposition', 'attachment; filename="image.gif"');
    res.setHeader('Content-Length', gifBuffer.length);
    res.status(200).end(gifBuffer);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
