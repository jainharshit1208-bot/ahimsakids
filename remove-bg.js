const { Jimp } = require('jimp');

async function processImage(inputPath, outputPath) {
  try {
    const img = await Jimp.read(inputPath);
    
    // We want to make all near-white pixels transparent.
    // We iterate through all pixels.
    img.scan((x, y, idx) => {
      // img.bitmap.data[idx] is Red
      // img.bitmap.data[idx + 1] is Green
      // img.bitmap.data[idx + 2] is Blue
      // img.bitmap.data[idx + 3] is Alpha
      
      const r = img.bitmap.data[idx];
      const g = img.bitmap.data[idx + 1];
      const b = img.bitmap.data[idx + 2];
      
      // If the pixel is very bright (close to white), make it transparent
      if (r > 240 && g > 240 && b > 240) {
        img.bitmap.data[idx + 3] = 0; // Alpha to 0
      } else {
        // Option: add some feathering/anti-aliasing for edges
        // but simple threshold is fine for now
      }
    });

    await img.write(outputPath);
    console.log(`Successfully processed ${outputPath}`);
  } catch (err) {
    console.error(`Failed to process ${inputPath}:`, err);
  }
}

const files = [
  { in: 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\973f09df-0ab8-42f4-b096-4a2c8139e34e\\slide1_ahimsa_1779557063895.png', out: 'assets/slide1.png' },
  { in: 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\973f09df-0ab8-42f4-b096-4a2c8139e34e\\slide2_tirthankara_1779557080959.png', out: 'assets/slide2.png' },
  { in: 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\973f09df-0ab8-42f4-b096-4a2c8139e34e\\slide3_kashaya_1779557102361.png', out: 'assets/slide3.png' },
  { in: 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\973f09df-0ab8-42f4-b096-4a2c8139e34e\\slide4_stories_1779557120626.png', out: 'assets/slide4.png' } // changed to png for transparency
];

async function run() {
  for (const f of files) {
    await processImage(f.in, f.out);
  }
}

run();
