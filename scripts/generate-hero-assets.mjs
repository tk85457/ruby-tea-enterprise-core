import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = path.join(__dirname, '../public/images/hero-sequence');
const OUTPUT_BASE = path.join(__dirname, '../public/images/hero-sequence');

const VARIANTS = [
  { name: 'mobile-small', width: 1080, quality: 85 }, // Upscaled for Portrait Cover (was 480, too blurry)
  { name: 'mobile-large', width: 1280, quality: 85 }, // High-Res Mobile (was 768)
  { name: 'tablet', width: 1600, quality: 85 },       // Sharp Tablet
  // 'desktop' uses the original source files
];

async function processImages() {
  console.log('🚀 Starting Hero Asset Generation...');

  // Ensure source directory exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // Get all webp files (assuming source is webp based on previous context)
  const files = fs.readdirSync(SOURCE_DIR).filter(file => file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png'));

  if (files.length === 0) {
    console.error('❌ No images found in source directory.');
    process.exit(1);
  }

  console.log(`Found ${files.length} frames to process.`);

  for (const variant of VARIANTS) {
    const variantDir = path.join(OUTPUT_BASE, variant.name);

    // Create variant directory
    if (!fs.existsSync(variantDir)) {
      fs.mkdirSync(variantDir, { recursive: true });
      console.log(`📁 Created directory: ${variantDir}`);
    }

    console.log(`⚙️ Processing ${variant.name} (${variant.width}px)...`);

    let processedCount = 0;

    // Process in batches to avoid OS file handle limits
    const BATCH_SIZE = 10;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (file) => {
            const inputPath = path.join(SOURCE_DIR, file);
            const outputPath = path.join(variantDir, file); // Keep same filename

            // Check if file already exists to skip (optional, but good for re-runs)
            // Remove check to force overwrite if logic changes

            try {
                await sharp(inputPath)
                    .resize({ width: variant.width, withoutEnlargement: true })
                    .webp({ quality: variant.quality }) // Enforce WebP output
                    .toFile(outputPath);
                processedCount++;
            } catch (err) {
                console.error(`❌ Error processing ${file}:`, err);
            }
        }));

        process.stdout.write(`\r   Progress: ${Math.min(i + BATCH_SIZE, files.length)}/${files.length}`);
    }
    console.log(`\n✅ Completed ${variant.name}`);
  }

  console.log('🎉 Asset generation complete!');
}

processImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
