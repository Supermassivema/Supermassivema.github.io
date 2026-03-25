const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, 'assets', 'images');
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;
const JPEG_QUALITY = 85;

let totalOriginal = 0;
let totalOptimized = 0;
let processedCount = 0;

function getAllImages(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllImages(fullPath));
    } else {
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function optimizeImage(filePath) {
  const originalSize = fs.statSync(filePath).size;
  const ext = path.extname(filePath).toLowerCase();

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = sharp(filePath)
      .rotate() // auto-rotate based on EXIF
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });

    let outputPath = filePath;

    if (ext === '.png') {
      // Convert PNG to JPG for photos (much smaller)
      outputPath = filePath.replace(/\.png$/i, '.jpg');
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
    } else {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
    }

    const buffer = await pipeline.toBuffer();

    // Only save if smaller
    if (buffer.length < originalSize) {
      fs.writeFileSync(outputPath, buffer);

      // If converted from PNG, delete original PNG
      if (ext === '.png' && outputPath !== filePath) {
        fs.unlinkSync(filePath);
      }

      const newSize = buffer.length;
      const saved = ((1 - newSize / originalSize) * 100).toFixed(1);
      console.log(`✓ ${path.relative(IMAGE_DIR, filePath)} | ${(originalSize/1024/1024).toFixed(1)}MB → ${(newSize/1024/1024).toFixed(1)}MB (${saved}% saved)`);

      totalOriginal += originalSize;
      totalOptimized += newSize;
      processedCount++;

      // Return info if PNG was converted
      if (ext === '.png' && outputPath !== filePath) {
        return { oldPath: filePath, newPath: outputPath };
      }
    } else {
      console.log(`– ${path.relative(IMAGE_DIR, filePath)} | already optimized`);
    }
  } catch (err) {
    console.error(`✗ ${path.relative(IMAGE_DIR, filePath)} | ${err.message}`);
  }
  return null;
}

async function main() {
  console.log('Scanning images...\n');
  const images = getAllImages(IMAGE_DIR);
  console.log(`Found ${images.length} images\n`);

  const pngConversions = [];

  // Process in batches of 5
  for (let i = 0; i < images.length; i += 5) {
    const batch = images.slice(i, i + 5);
    const results = await Promise.all(batch.map(f => optimizeImage(f)));
    results.filter(Boolean).forEach(r => pngConversions.push(r));
  }

  console.log(`\n========================================`);
  console.log(`Processed: ${processedCount} images`);
  console.log(`Original:  ${(totalOriginal/1024/1024).toFixed(1)} MB`);
  console.log(`Optimized: ${(totalOptimized/1024/1024).toFixed(1)} MB`);
  console.log(`Saved:     ${((totalOriginal - totalOptimized)/1024/1024).toFixed(1)} MB (${((1 - totalOptimized/totalOriginal) * 100).toFixed(1)}%)`);

  if (pngConversions.length > 0) {
    console.log(`\n⚠ PNG → JPG conversions (update references in _artworks):`);
    pngConversions.forEach(c => {
      console.log(`  ${path.relative(__dirname, c.oldPath)} → ${path.relative(__dirname, c.newPath)}`);
    });
  }
}

main().catch(console.error);
