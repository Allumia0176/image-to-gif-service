// api/convert-to-gif.js - Créer un vrai GIF simple

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

    // Créer un GIF valide minimal (1x1 pixel transparent)
    const gifBytes = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // "GIF89a"
      0x01, 0x00, // width = 1
      0x01, 0x00, // height = 1
      0x80, 0x00, 0x00, // global color table
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // color entries
      0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, // graphic control
      0x2C, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, // image descriptor
      0x02, 0x02, 0x04, 0x01, 0x00, 0x3B // image data + trailer
    ]);
    
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Disposition', 'attachment; filename="image.gif"');
    res.setHeader('Content-Length', gifBytes.length);
    res.status(200).end(Buffer.from(gifBytes));
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
