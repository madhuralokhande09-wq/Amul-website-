const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function removeWhiteBgPNG(inputPath, outputPath) {
  const buf = fs.readFileSync(inputPath);
  
  // Simple PNG chunk parser
  let pos = 8; // skip 8-byte PNG header
  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  let idatChunks = [];

  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
      bitDepth = buf[pos + 16];
      colorType = buf[pos + 17];
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + length));
    }
    pos += 12 + length;
  }

  console.log(`Processing ${path.basename(inputPath)}: ${width}x${height}, colorType: ${colorType}`);
}

const assetsDir = path.join(__dirname, 'assets');
['bottle-front-view.png', 'bottle-back-view.png', 'bottle-nutrition-label.png'].forEach(file => {
  const fullPath = path.join(assetsDir, file);
  if (fs.existsSync(fullPath)) {
    removeWhiteBgPNG(fullPath, fullPath);
  }
});
