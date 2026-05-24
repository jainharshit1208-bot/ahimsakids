const { Jimp } = require('jimp');

async function processImage(inputPath, outputPath) {
  try {
    const img = await Jimp.read(inputPath);
    
    img.scan((x, y, idx) => {
      const r = img.bitmap.data[idx];
      const g = img.bitmap.data[idx + 1];
      const b = img.bitmap.data[idx + 2];
      
      // Make all near-white pixels transparent
      if (r > 240 && g > 240 && b > 240) {
        img.bitmap.data[idx + 3] = 0;
      }
    });

    await img.write(outputPath);
    console.log(`Successfully processed ${outputPath}`);
  } catch (err) {
    console.error(`Failed to process ${inputPath}:`, err);
  }
}

const files = [
  { in: 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\973f09df-0ab8-42f4-b096-4a2c8139e34e\\hero_kashaya_1779562655610.png', out: 'assets/hero_kashaya.png' },
  { in: 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\973f09df-0ab8-42f4-b096-4a2c8139e34e\\heading_kashaya_1779562669562.png', out: 'assets/heading_kashaya.png' }
];

async function run() {
  for (const f of files) {
    await processImage(f.in, f.out);
  }
}

run();
