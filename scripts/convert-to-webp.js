const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function convertImages() {
  const allFiles = getAllFiles(targetDir);
  const imageFiles = allFiles.filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'));

  console.log(`Found ${imageFiles.length} images to convert...`);

  // Use a concurrency limit to avoid overloading
  const concurrencyLevel = 5;
  const chunks = [];
  for (let i = 0; i < imageFiles.length; i += concurrencyLevel) {
    chunks.push(imageFiles.slice(i, i + concurrencyLevel));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(async (file) => {
      const outputPath = file.replace(/\.(jpg|jpeg)$/i, '.webp');
      try {
        if (fs.existsSync(outputPath)) {
            // console.log(`Skipping already converted: ${path.basename(file)}`);
            return;
        }
        await sharp(file)
          .webp({ quality: 100, lossless: true })
          .toFile(outputPath);
        console.log(`Converted: ${path.basename(file)} -> ${path.basename(outputPath)}`);
      } catch (err) {
        console.error(`Error converting ${file}:`, err.message);
      }
    }));
  }
  console.log('Conversion complete!');
}

convertImages();
